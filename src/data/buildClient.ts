import fetch from 'node-fetch';
import {
  ClientBuilder,
  // Import middlewares
  type PasswordAuthMiddlewareOptions, // Required for user authentication
  type HttpMiddlewareOptions, // Required for sending HTTP requests
} from '@commercetools/sdk-client-v2';
import { MyTokenCache } from './tokenCache';
import getEnvVars from './dotEnvType';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';

export const myTokenCache = new MyTokenCache();

// Configure passwordAuthMiddlewareOptions
const passwordAuthOptions: PasswordAuthMiddlewareOptions = {
  host: getEnvVars.VITE_CTP_AUTH_URL,
  projectKey: getEnvVars.VITE_CTP_PROJECT_KEY,
  credentials: {
    clientId: getEnvVars.VITE_CTP_CLIENT_ID,
    clientSecret: getEnvVars.VITE_CTP_CLIENT_SECRET,
    user: {
      username: 'johndoe@example.com', // Will be taken from email input of login form
      password: 'secret123', // Will be taken from password input of login form
    },
  },
  tokenCache: myTokenCache,
  fetch,
};

// Configure httpMiddlewareOptions
const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: getEnvVars.VITE_CTP_API_URL,
  fetch,
};

// Create the ClientBuilder
const ctpClient = new ClientBuilder()
  .withPasswordFlow(passwordAuthOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .withLoggerMiddleware() // Include middleware for logging
  .build();

export const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
  projectKey: getEnvVars.VITE_CTP_PROJECT_KEY,
});
