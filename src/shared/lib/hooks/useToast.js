import { useCallback, useEffect, useRef, useState } from "react";

export function useToast(duration = 3200) {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  const dismissToast = useCallback(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = null;
    setToast(null);
  }, []);

  const showToast = useCallback(
    (message, options = {}) => {
      if (!message) {
        dismissToast();
        return;
      }

      const payload =
        typeof message === "object"
          ? message
          : {
              message,
              tone: options.tone || "success",
              title: options.title,
              duration: options.duration || duration
            };

      if (timerRef.current) window.clearTimeout(timerRef.current);
      setToast(payload);
      timerRef.current = window.setTimeout(() => {
        setToast(null);
        timerRef.current = null;
      }, payload.duration || duration);
    },
    [dismissToast, duration]
  );

  useEffect(() => () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
  }, []);

  return { toast, showToast, dismissToast };
}
