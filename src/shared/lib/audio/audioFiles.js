const AUDIO_EXTENSION = /\.(wav|wave|mp3|m4a|aac|ogg|oga|opus|flac|webm|aiff?|mp4)$/i;
const AUDIO_MIME = /^audio\//i;
const MAX_FILE_BYTES = 50 * 1024 * 1024;

export const AUDIO_ACCEPT =
  ".wav,.wave,.mp3,.m4a,.aac,.ogg,.oga,.opus,.flac,.webm,.aiff,.aif,audio/*";

export function validateAudioFile(file) {
  if (!file) return "Selecciona un archivo de audio.";
  if (!AUDIO_MIME.test(file.type || "") && !AUDIO_EXTENSION.test(file.name || "")) {
    return "Formato no compatible. Usa WAV, MP3, M4A, AAC, OGG, FLAC o WebM.";
  }
  if (file.size === 0) return "El archivo está vacío o no se puede leer.";
  if (file.size > MAX_FILE_BYTES) return "El archivo supera el límite de 50 MB.";

  return "";
}

export function extractPeaks(audioBuffer, buckets = 220) {
  const channel = audioBuffer.getChannelData(0);
  const size = Math.max(1, Math.floor(channel.length / buckets));
  const peaks = [];

  for (let bucket = 0; bucket < buckets; bucket += 1) {
    const start = bucket * size;
    const end = Math.min(channel.length, start + size);
    let peak = 0;

    for (let index = start; index < end; index += 1) {
      const value = Math.abs(channel[index]);
      if (value > peak) peak = value;
    }

    peaks.push(peak);
  }

  const maxPeak = Math.max(...peaks, 0.0001);
  return peaks.map((peak) => Math.max(0.025, peak / maxPeak));
}

export function slicePeaks(peaks, ratio = 1) {
  if (!peaks?.length) return [];
  const visible = Math.max(1, Math.round(peaks.length * Math.min(1, Math.max(0.02, ratio))));
  return peaks.slice(0, visible);
}

export async function decodeAudioFile(file) {
  const validationError = validateAudioFile(file);
  if (validationError) throw new Error(validationError);

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    throw new Error(
      "Este navegador no admite la decodificación de audio. La forma de onda se mostrará de forma ilustrativa."
    );
  }

  const arrayBuffer = await file.arrayBuffer();
  const context = new AudioContextClass();

  try {
    const audioBuffer = await context.decodeAudioData(arrayBuffer.slice(0));
    return {
      file,
      name: file.name,
      size: file.size,
      type: file.type || "audio",
      duration: audioBuffer.duration,
      sampleRate: audioBuffer.sampleRate,
      channels: audioBuffer.numberOfChannels,
      peaks: extractPeaks(audioBuffer),
      audioBuffer,
      url: URL.createObjectURL(file)
    };
  } catch {
    throw new Error(
      "El navegador no pudo decodificar este archivo. Prueba con un WAV o MP3 válido."
    );
  } finally {
    await context.close().catch(() => {});
  }
}

export { MAX_FILE_BYTES };
