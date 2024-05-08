interface ENV {
  VITE_CTP_PROJECT_KEY: string | undefined;
  VITE_CTP_CLIENT_SECRET: string | undefined;
  VITE_CTP_CLIENT_ID: string | undefined;
  VITE_CTP_AUTH_URL: string | undefined;
  VITE_CTP_API_URL: string | undefined;
  VITE_CTP_SCOPES: string[] | undefined;
}

interface Config {
  VITE_CTP_PROJECT_KEY: string;
  VITE_CTP_CLIENT_SECRET: string;
  VITE_CTP_CLIENT_ID: string;
  VITE_CTP_AUTH_URL: string;
  VITE_CTP_API_URL: string;
  VITE_CTP_SCOPES: string[];
}

const getConfig = (): ENV => {
  return {
    VITE_CTP_PROJECT_KEY: import.meta.env.VITE_CTP_PROJECT_KEY,
    VITE_CTP_CLIENT_SECRET: import.meta.env.VITE_CTP_CLIENT_SECRET,
    VITE_CTP_CLIENT_ID: import.meta.env.VITE_CTP_CLIENT_ID,
    VITE_CTP_AUTH_URL: import.meta.env.VITE_CTP_AUTH_URL,
    VITE_CTP_API_URL: import.meta.env.VITE_CTP_API_URL,
    VITE_CTP_SCOPES: import.meta.env.VITE_CTP_SCOPES ? import.meta.env.VITE_CTP_SCOPES : undefined,
  };
};

const getEnvConfig = (config: ENV): Config => {
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined) {
      throw new Error(`Missing key ${key} in dotenv`);
    }
  }
  return config as Config;
};

const config = getConfig();

const getEnvVars = getEnvConfig(config);

export default getEnvVars;