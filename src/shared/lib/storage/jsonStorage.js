export function readJSON(key, fallback) {
  const rawValue = window.localStorage.getItem(key);
  if (rawValue === null) return fallback;

  try {
    return JSON.parse(rawValue);
  } catch (error) {
    console.error(`No se pudo leer el dato local "${key}".`, error);
    return fallback;
  }
}

export function writeJSON(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function removeItem(key) {
  window.localStorage.removeItem(key);
}
