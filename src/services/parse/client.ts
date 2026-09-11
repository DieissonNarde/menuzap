import Parse from "parse";

import {
  PARSE_APPLICATION_ID,
  PARSE_JAVASCRIPT_KEY,
  PARSE_SERVER_URL,
} from "../environments";

let initialized = false;

export function initializeParse(): void {
  if (initialized) return;

  Parse.initialize(PARSE_APPLICATION_ID, PARSE_JAVASCRIPT_KEY);
  Parse.serverURL = PARSE_SERVER_URL;
  initialized = true;
}

export default Parse;
