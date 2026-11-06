import { useCallback, useEffect, useRef, useState } from "react";
import { createVoiceRecordingSession } from "../../../shared/lib/audio/recorder";

export function useAudioRecorder() {
  const [status, setStatus] = useState("idle");
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState("");
  const [file, setFile] = useState(null);
  const sessionRef = useRef(null);
  const timerRef = useRef(null);
  const startedAtRef = useRef(0);

  const clearTimer = useCallback(() => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = null;
  }, []);

  const start = useCallback(async () => {
    if (status === "requesting" || status === "recording") return;
    setStatus("requesting");
    setError("");
    setFile(null);
    setSeconds(0);

    try {
      const session = await createVoiceRecordingSession();
      sessionRef.current = session;
      session.start();
      startedAtRef.current = Date.now();
      setStatus("recording");
      clearTimer();
      timerRef.current = window.setInterval(() => {
        setSeconds((Date.now() - startedAtRef.current) / 1000);
      }, 200);
    } catch (recordingError) {
      setError(recordingError.message);
      setStatus("error");
    }
  }, [clearTimer, status]);

  const stop = useCallback(async () => {
    const session = sessionRef.current;
    if (!session) return null;
    clearTimer();
    setStatus("processing");
    try {
      const recordedFile = await session.stop();
      sessionRef.current = null;
      setSeconds((Date.now() - startedAtRef.current) / 1000);
      if (!recordedFile) {
        setError("No se capturó audio. Intenta grabar de nuevo.");
        setStatus("error");
        return null;
      }
      setFile(recordedFile);
      setStatus("ready");
      return recordedFile;
    } catch {
      setError("No fue posible finalizar la grabación.");
      setStatus("error");
      return null;
    }
  }, [clearTimer]);

  const cancel = useCallback(() => {
    clearTimer();
    sessionRef.current?.cancel();
    sessionRef.current = null;
    setStatus("idle");
    setSeconds(0);
    setError("");
    setFile(null);
  }, [clearTimer]);

  const reset = useCallback(() => {
    clearTimer();
    setStatus("idle");
    setSeconds(0);
    setError("");
    setFile(null);
  }, [clearTimer]);

  useEffect(() => () => {
    clearTimer();
    sessionRef.current?.cancel();
  }, [clearTimer]);

  return {
    status,
    seconds,
    error,
    file,
    isRecording: status === "recording",
    isRequesting: status === "requesting",
    isProcessing: status === "processing",
    start,
    stop,
    cancel,
    reset
  };
}
