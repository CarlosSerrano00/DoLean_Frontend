import { useCallback, useEffect, useRef, useState } from "react";
import { clamp } from "../../../shared/lib/format";

export function usePlayback({ duration, audioUrl }) {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.8);
  const audioRef = useRef(null);
  const frameRef = useRef(null);
  const timeRef = useRef(0);
  const durationRef = useRef(duration);
  const volumeRef = useRef(volume);

  durationRef.current = duration;
  timeRef.current = currentTime;
  volumeRef.current = volume;

  useEffect(() => {
    if (!audioUrl) {
      audioRef.current?.pause();
      audioRef.current = null;
      return undefined;
    }

    const audio = new Audio(audioUrl);
    audio.preload = "auto";
    audio.volume = volumeRef.current;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
      if (audioRef.current === audio) audioRef.current = null;
    };
  }, [audioUrl]);

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    timeRef.current = 0;
  }, [audioUrl]);

  useEffect(() => {
    setCurrentTime((time) => Math.min(time, duration));
  }, [duration]);

  const setVolume = useCallback((nextVolume) => {
    const safe = clamp(Number(nextVolume) || 0, 0, 1);
    setVolumeState(safe);
    volumeRef.current = safe;
    if (audioRef.current) audioRef.current.volume = safe;
  }, []);

  const seek = useCallback((nextTime) => {
    const safe = clamp(Number(nextTime) || 0, 0, durationRef.current);
    setCurrentTime(safe);
    timeRef.current = safe;
    if (audioRef.current) audioRef.current.currentTime = safe;
  }, []);

  const play = useCallback(() => {
    if (timeRef.current >= durationRef.current - 0.02) {
      setCurrentTime(0);
      timeRef.current = 0;
      if (audioRef.current) audioRef.current.currentTime = 0;
    }
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
    audioRef.current?.pause();
  }, []);

  const stop = useCallback(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    timeRef.current = 0;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  const toggle = useCallback(() => {
    if (isPlaying) pause();
    else play();
  }, [isPlaying, pause, play]);

  useEffect(() => {
    if (!isPlaying) return undefined;

    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = timeRef.current;
      audio.play().catch(() => {
        /* Autoplay can be blocked; the visual transport still advances. */
      });
    }

    let lastTick = performance.now();
    const tick = (now) => {
      const delta = Math.min(0.1, (now - lastTick) / 1000);
      lastTick = now;
      const liveAudio = audioRef.current;
      const nextTime =
        liveAudio && !liveAudio.paused
          ? liveAudio.currentTime
          : timeRef.current + delta;

      if (nextTime >= durationRef.current) {
        setCurrentTime(durationRef.current);
        timeRef.current = durationRef.current;
        setIsPlaying(false);
        liveAudio?.pause();
        return;
      }

      timeRef.current = nextTime;
      setCurrentTime(nextTime);
      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      if (audio) {
        audio.pause();
        timeRef.current = audio.currentTime;
      }
    };
  }, [isPlaying]);

  useEffect(() => () => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    audioRef.current?.pause();
  }, []);

  return { currentTime, isPlaying, play, pause, toggle, stop, seek, volume, setVolume };
}
