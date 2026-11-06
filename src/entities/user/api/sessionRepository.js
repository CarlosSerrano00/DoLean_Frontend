import { readJSON, removeItem, writeJSON } from "../../../shared/lib/storage/jsonStorage";

const SESSION_KEY = "dolean_user";

export const sessionRepository = {
  get() {
    return readJSON(SESSION_KEY, null);
  },
  save(user) {
    writeJSON(SESSION_KEY, user);
  },
  clear() {
    removeItem(SESSION_KEY);
  }
};
