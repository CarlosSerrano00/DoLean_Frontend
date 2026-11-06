import { useCallback, useState } from "react";
import { decodeAudioFile } from "../../../shared/lib/audio/audioFiles";

export function useAudioImport() {
  const [asset, setAsset] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const importFile = useCallback(async (file) => {
    if (!file) return null;
    setStatus("loading");
    setError("");
    try {
      const decoded = await decodeAudioFile(file);
      /* The previous URL is owned by audioLibrary once an asset is registered. */
      setAsset(decoded);
      setStatus("ready");
      return decoded;
    } catch (importError) {
      setError(importError.message);
      setStatus("error");
      return null;
    }
  }, []);

  const clearAsset = useCallback(() => {
    setAsset((previous) => {
      if (previous?.url) URL.revokeObjectURL(previous.url);
      return null;
    });
    setStatus("idle");
    setError("");
  }, []);

  const useExistingAsset = useCallback((existing) => {
    setAsset(existing);
    setStatus(existing ? "ready" : "idle");
    setError("");
  }, []);

  return { asset, status, error, importFile, clearAsset, useExistingAsset, setError };
}
