interface Config {
  VITE_CTP_PROJECT_KEY: string;
  VITE_CTP_AUTH_HOST: string;
  VITE_CTP_API_HOST: string;

  VITE_CTP_CLIENT_SECRET: string;
  VITE_CTP_CLIENT_ID: string;

  /**
   * Scopes for basic customer functionality
   */
  VITE_CTP_SCOPES: string;

  // VITE_CTP_SCOPES_LIMITED: string;
}

const getConfig = (): Partial<Config> => {
  return {
    VITE_CTP_PROJECT_KEY: import.meta.env.VITE_CTP_PROJECT_KEY,
    VITE_CTP_AUTH_HOST: import.meta.env.VITE_CTP_AUTH_HOST,
    VITE_CTP_API_HOST: import.meta.env.VITE_CTP_API_HOST,

    VITE_CTP_CLIENT_SECRET: import.meta.env.VITE_CTP_CLIENT_SECRET,
    VITE_CTP_CLIENT_ID: import.meta.env.VITE_CTP_CLIENT_ID,

    VITE_CTP_SCOPES: import.meta.env.VITE_CTP_SCOPES,
    // VITE_CTP_SCOPES_LIMITED: import.meta.env.VITE_CTP_SCOPES_LIMITED,
  };
};

const checkMissingEntries = (config: Partial<Config>): Config => {
  for (const [key, value] of Object.entries(config))
    if (value === undefined) throw new Error(`Missing key ${key} in dotenv`);
  return config as Config;
};

export const config = checkMissingEntries(getConfig());
