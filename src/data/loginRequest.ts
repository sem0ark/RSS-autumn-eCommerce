import { apiRoot } from './buildClient';

export const loginRequest = async () => {
  const authRequest = apiRoot
    .login()
    .post({ body: { email: 'johndoe@example.com', password: 'secret123' } });
  const authResponse = await authRequest.execute();
  return authResponse;
};
