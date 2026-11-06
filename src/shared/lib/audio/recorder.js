const MIME_EXTENSION = {
  "audio/webm": "webm",
  "audio/ogg": "ogg",
  "audio/mp4": "m4a",
  "audio/mpeg": "mp3",
  "audio/wav": "wav"
};

function buildRecordingFile(blob) {
  const extension = MIME_EXTENSION[blob.type] || "webm";
  const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  return new File([blob], `grabacion-${stamp}.${extension}`, {
    type: blob.type || "audio/webm"
  });
}

export async function createVoiceRecordingSession() {
  if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
    throw new Error("La grabación desde micrófono no está disponible en este navegador.");
  }

  let stream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  } catch (error) {
    const messages = {
      NotAllowedError: "Permiso de micrófono denegado. Habilítalo en el navegador para grabar.",
      NotFoundError: "No se encontró ningún micrófono conectado.",
      NotReadableError: "El micrófono está en uso por otra aplicación.",
      SecurityError: "La grabación requiere una conexión segura (HTTPS o localhost)."
    };
    throw new Error(messages[error?.name] || "No fue posible acceder al micrófono.");
  }

  const chunks = [];
  const recorder = new MediaRecorder(stream);
  recorder.addEventListener("dataavailable", (event) => {
    if (event.data.size > 0) chunks.push(event.data);
  });

  let stopped = false;
  const releaseStream = () => {
    stream.getTracks().forEach((track) => track.stop());
  };

  return {
    start() {
      recorder.start(250);
    },
    stop() {
      if (stopped) return Promise.resolve(null);
      stopped = true;
      return new Promise((resolve) => {
        recorder.addEventListener(
          "stop",
          () => {
            releaseStream();
            const blob = new Blob(chunks, { type: recorder.mimeType || "audio/webm" });
            resolve(blob.size ? buildRecordingFile(blob) : null);
          },
          { once: true }
        );
        recorder.stop();
      });
    },
    cancel() {
      stopped = true;
      if (recorder.state !== "inactive") recorder.stop();
      releaseStream();
    }
  };
}
