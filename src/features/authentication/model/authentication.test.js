import assert from "node:assert/strict";
import test from "node:test";
import {
  createDemoSession,
  createDemoUser,
  validateLoginCredentials,
  validateRegistration
} from "./authentication.js";

test("login validation accepts a valid email and password", () => {
  assert.equal(validateLoginCredentials("demo@dolean.app", "demo1234"), "");
});

test("login validation rejects malformed email and short passwords", () => {
  assert.notEqual(validateLoginCredentials("invalid-email", "demo1234"), "");
  assert.notEqual(validateLoginCredentials("demo@dolean.app", "123"), "");
});

test("demo sessions derive a readable name from the email", () => {
  assert.deepEqual(createDemoSession("carlos.serrano@dolean.app"), {
    name: "carlos serrano",
    email: "carlos.serrano@dolean.app"
  });
});

test("registration validation reports password, confirmation, and consent errors", () => {
  assert.match(validateRegistration({ password: "123", confirm: "123", accepted: true }), /6 caracteres/);
  assert.match(validateRegistration({ password: "secret1", confirm: "secret2", accepted: true }), /no coinciden/);
  assert.match(validateRegistration({ password: "secret1", confirm: "secret1", accepted: false }), /aceptar/);
  assert.equal(validateRegistration({ password: "secret1", confirm: "secret1", accepted: true }), "");
});

test("demo registration trims the name", () => {
  assert.deepEqual(createDemoUser("  Carlos  ", "carlos@dolean.app"), {
    name: "Carlos",
    email: "carlos@dolean.app"
  });
});
