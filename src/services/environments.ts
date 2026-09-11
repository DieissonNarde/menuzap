function requireEnvironmentVariable(name: keyof ImportMetaEnv): string {
  const value = import.meta.env[name]?.trim();

  if (!value) {
    throw new Error(`A variável de ambiente ${name} não foi configurada.`);
  }

  return value;
}

export const PARSE_APPLICATION_ID = requireEnvironmentVariable(
  "VITE_PARSE_APPLICATION_ID",
);
export const PARSE_JAVASCRIPT_KEY = requireEnvironmentVariable(
  "VITE_PARSE_JAVASCRIPT_KEY",
);
export const PARSE_SERVER_URL = requireEnvironmentVariable(
  "VITE_PARSE_SERVER_URL",
);
