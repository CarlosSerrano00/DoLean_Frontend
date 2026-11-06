export function validateLoginCredentials(email, password) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 6) {
    return "Introduce un correo válido y una contraseña de al menos 6 caracteres.";
  }

  return "";
}

export function createDemoSession(email) {
  return { name: email.split("@")[0].replace(/[._-]/g, " "), email };
}

export function validateRegistration({ password, confirm, accepted }) {
  if (password.length < 6) return "La contraseña debe tener al menos 6 caracteres.";
  if (password !== confirm) return "Las contraseñas no coinciden.";
  if (!accepted) return "Debes aceptar las condiciones para continuar.";

  return "";
}

export function createDemoUser(name, email) {
  return { name: name.trim(), email };
}
