import { config } from '../utils/config';
import { debug, error } from '../framework/utilities/logging';
import {
  APIResponse,
  ServerConnector,
  Token,
  TokenType,
} from './serverConnector';
import { factories } from '../framework/factories';
import { Storage } from '../framework/persistence/storage';
import { ProfileUpdateAction } from '../contexts/fieldEditBuilder';

/**
 * Address object interface based on the commerce tools documentation and RSS requirements.
 */
export interface Address {
  id?: string;
  key?: string;
  // title: string;
  // firstName: string;
  // lastName: string;

  country: string;
  city: string;
  postalCode: string;
  streetName: string;
  // streetNumber: string;

  // phone: string;
  // mobile: string;
  // email: string;
}

export interface CustomerData {
  email: string;
  password: string;

  firstName: string;
  lastName: string;

  shippingAddressIds?: string[];
  billingAddressIds?: string[];

  defaultShippingAddress?: number;
  defaultBillingAddress?: number;

  defaultShippingAddressId?: string;
  defaultBillingAddressId?: string;

  dateOfBirth: string;
  addresses: Address[];
}

export type FormData = {
  user: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
  };

  billingAddress: Address;
  billingAddressSaveDefault: boolean;
} & (
  | {
      sameShippingAddress: false;
      shippingAddress: Address;
      shippingAddressSaveDefault: boolean;
    }
  | {
      sameShippingAddress: true;
    }
);

/**
 * Full information about the client after signing in.
 * Example result:
 *
 * ```typescript
 * {
 *  addresses: [],
 *  email: "johndoe@example.com",
 *  firstName: "John",
 *  id: "some_123_id",
 *  isEmailVerified: false,
 *  lastName: "Doe",
 *  password: "****aGg=",
 *  version: 1,
 *  createdAt: "2015-07-06T13:22:33.339Z",
 *  lastModifiedAt: "2015-07-06T13:22:33.339Z",
 *  authenticationMode: "Password",
 *  stores: []
 * }
 * ```
 */
export type CustomerDataReceived = CustomerData & {
  id: string;
  version: number;
};

interface LoginTokenResponse {
  access_token: Token;
  expires_in: number;

  // commented out values to hide from the other app's functionality
  refresh_token: Token;
  token_type: TokenType;
}

interface CustomerSingInResponse {
  customer: CustomerDataReceived;
}

class AuthConnector {
  constructor(
    private _tokenData = factories.property<{
      accessToken: Token;
      refreshToken: Token;
      /**
       * Date of expiration in milliseconds
       */
      expirationDateMS: number;
      isAnonymous: boolean;
    } | null>(null)
  ) {
    const storage = new Storage('AuthConnector');
    storage.registerProperty(_tokenData);
  }

  /**
   * @returns If access token is available.
   */
  public isLoggedIn(): boolean {
    const token = this._tokenData.get();
    return token !== null && !token.isAnonymous;
  }

  public getAuthBearerHeaders() {
    const token = this._tokenData.get();
    if (!token)
      throw new Error('Access token for sign in was not initialized.');
    return ServerConnector.makeBearerAuthHeader(token.accessToken);
  }

  public getAuthBasicHeaders() {
    return ServerConnector.makeBasicAuthHeader();
  }

  private configureTokenData(
    responseData: LoginTokenResponse,
    isAnonymous = false
  ) {
    this._tokenData.set({
      accessToken: responseData.access_token,
      refreshToken: responseData.refresh_token,
      expirationDateMS: Date.now() + responseData.expires_in * 1000,
      isAnonymous,
    });
  }

  public async requestTokenRefresh() {
    const token = this._tokenData.get();
    if (!token)
      throw new Error('Access token for refresh  was not initialized.');

    if (!token.refreshToken) {
      error('Failed to find refreshToken!');
      return;
    }

    const result = await ServerConnector.post<LoginTokenResponse>(
      ServerConnector.getOAuthURL('customers/token'),
      {
        ...this.getAuthBasicHeaders(),
        ...ServerConnector.formDataHeaders,
      },
      `grant_type=refresh_token&refresh_token=${token.refreshToken}`
    );

    if (result.ok) {
      this.configureTokenData(result.body);
    } else {
      error('Failed to refresh token data', result.errors);
    }
  }

  /**
   * Authorize the user.
   * @param username - entered username from the form
   * @param password - entered password from the form
   * @returns Login information about the user
   */
  private async requestLoginToken(username: string, password: string) {
    const result = await ServerConnector.post<LoginTokenResponse>(
      ServerConnector.getOAuthURL('customers/token'),
      {
        ...this.getAuthBasicHeaders(),
        ...ServerConnector.formDataHeaders,
      },
      `grant_type=password&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&scope=${config.VITE_CTP_SCOPES}`
    );

    if (result.ok) return result;
    error('Failed to request token data', result.errors);
    return result;
  }

  /**
   * Create an anonymous token
   * @returns Login information about the user
   */
  private async requestAnonymousToken() {
    const result = await ServerConnector.post<LoginTokenResponse>(
      ServerConnector.getOAuthURL('anonymous/token'),
      {
        ...this.getAuthBasicHeaders(),
        ...ServerConnector.formDataHeaders,
      },
      `grant_type=client_credentials&scope=${config.VITE_CTP_SCOPES}`
    );

    if (result.ok) return result;
    error('Failed to request anonymous token data', result.errors);
    return result;
  }

  /**
   * Authorize the user.
   * @param email - entered username from the form
   * @param password - entered password from the form
   * @returns Login information about the user
   */
  private async requestLoginSignIn(email: string, password: string) {
    const token = this._tokenData.get();
    if (!token)
      throw new Error('Access token for sign in was not initialized.');

    const result = await ServerConnector.post<CustomerSingInResponse>(
      ServerConnector.getAPIURL('me/login'),
      {
        ...this.getAuthBearerHeaders(),
        ...ServerConnector.formJSONHeaders,
      },
      { email, password }
    );

    if (result.ok) return result;
    error('Failed to request token data', result.errors);
    return result;
  }

  /**
   * Unauthorize the user.
   */
  public async requestLogout() {
    this._tokenData.set(null);
  }

  /**
   * Authorize the user.
   * @param email - entered username from the form
   * @param password - entered password from the form
   * @returns Login information about the user
   */
  private async requestSignUp(userData: CustomerData) {
    const token = this._tokenData.get();
    if (!token)
      throw new Error('Access token for sign up was not initialized.');

    const result = await ServerConnector.post<CustomerSingInResponse>(
      ServerConnector.getAPIURL('me/signup'),
      {
        ...this.getAuthBearerHeaders(),
        ...ServerConnector.formJSONHeaders,
      },
      userData
    );

    if (result.ok) return result;
    error('Failed to request token data', result.errors);
    return result;
  }

  /**
   *
   * @param userVersion user's version, which is being updated, internal value
   * @param actions list of actions for updating the client, see FieldEditBuilder
   * @returns Updated information about the user
   */
  private async requestProfileUpdate(
    userVersion: number,
    actions: ProfileUpdateAction[]
  ) {
    const token = this._tokenData.get();
    if (!token) throw new Error('Access token  was not initialized.');

    const result = await ServerConnector.post<CustomerDataReceived>(
      ServerConnector.getAPIURL('me'),
      {
        ...this.getAuthBearerHeaders(),
        ...ServerConnector.formJSONHeaders,
      },
      {
        version: userVersion,
        actions,
      }
    );

    if (result.ok) return result;
    error('Failed to request token data', result.errors);
    return result;
  }

  /**
   *
   * @param userVersion user's version, which is being updated, internal value
   * @param currentPassword old password
   * @param newPassword new password
   * @returns
   */
  private async requestPasswordUpdate(
    userVersion: number,
    currentPassword: string,
    newPassword: string
  ) {
    const token = this._tokenData.get();
    if (!token) throw new Error('Access token  was not initialized.');

    const result = await ServerConnector.post<CustomerDataReceived>(
      ServerConnector.getAPIURL('me/password'),
      {
        ...this.getAuthBearerHeaders(),
        ...ServerConnector.formJSONHeaders,
      },
      {
        version: userVersion,
        currentPassword,
        newPassword,
      }
    );

    if (result.ok) return result;
    error('Failed to request token data', result.errors);
    return result;
  }

  /**
   * Authorize the user.
   * @param username - entered username from the form
   * @param password - entered password from the form
   * @returns Login information about the user
   */
  public async runSignInWorkflow(
    email: string,
    password: string
  ): Promise<APIResponse<CustomerSingInResponse>> {
    debug('Trying to run login workflow.');
    const token = this._tokenData.get();

    if (!token || token.isAnonymous) {
      const tokenResult = await this.requestLoginToken(email, password);
      if (!tokenResult.ok) return tokenResult;

      this.configureTokenData(tokenResult.body);
    } else if (token.expirationDateMS < Date.now() && !!token.refreshToken) {
      debug('Token already exists, but it is outdated.');
      await this.requestTokenRefresh();
    }

    const singInResult = await this.requestLoginSignIn(email, password);

    if (singInResult.ok) debug('Singed in successfully', singInResult.body);
    else error('Sing In Failed', singInResult.errors);

    return singInResult;
  }

  /**
   * Attempt to re-authorize the user.
   * @returns void or error on validation failure
   */
  public async runReSignInWorkflow(): Promise<void> {
    debug('Trying to run re-login workflow.');
    const token = this._tokenData.get();

    if (!token || token.isAnonymous)
      throw new Error('Access token for sign in was not initialized.');

    if (token.expirationDateMS < Date.now()) {
      debug('Token already exists, but it is outdated.');
      return this.requestTokenRefresh();
    }
  }

  /**
   * Authorize the user for the standard catalog functionality.
   * Will automatically update the session information before making request.
   * @returns
   */
  public async runGeneralAuthWorkflow(): Promise<void> {
    debug('Trying to run general authentication workflow.');
    const token = this._tokenData.get();

    if (!token) {
      debug('User is not logged in, trying to get an anonymous token.');

      const tokenResult = await this.requestAnonymousToken();
      if (!tokenResult.ok) {
        error('Failed to request the anonymous token');
        return;
      }

      this.configureTokenData(tokenResult.body, true);
    } else if (token.expirationDateMS < Date.now()) {
      debug('Token already exists, but it is outdated.');
      await this.requestTokenRefresh();
    } else {
      debug('User is already logged in, doing nothing.');
    }
  }

  /**
   * Sign up the user based on the form data.
   * @returns Login information about the user
   */
  public async runSignUpWorkflow(
    formData: FormData
  ): Promise<APIResponse<CustomerSingInResponse>> {
    debug('Trying to run sign up workflow.');
    const token = this._tokenData.get();

    if (!token || !token.isAnonymous) {
      const tokenResult = await this.requestAnonymousToken();
      if (!tokenResult.ok) return tokenResult;
      this.configureTokenData(tokenResult.body, true);
    } else if (token.expirationDateMS < Date.now()) {
      debug('Token already exists, but it is outdated.');
      await this.requestTokenRefresh();
    }

    const requestBody: CustomerData = formData.sameShippingAddress
      ? {
          ...formData.user,
          addresses: [formData.billingAddress],
          defaultBillingAddress: formData.billingAddressSaveDefault
            ? 0
            : undefined,
          defaultShippingAddress: formData.billingAddressSaveDefault
            ? 0
            : undefined,
        }
      : {
          ...formData.user,
          addresses: [formData.billingAddress, formData.shippingAddress],
          defaultBillingAddress: formData.billingAddressSaveDefault
            ? 0
            : undefined,
          defaultShippingAddress: formData.shippingAddressSaveDefault
            ? 0
            : undefined,
        };

    const result = await this.requestSignUp(requestBody);

    if (result.ok) debug('Received signup result', result.body);
    else {
      error('Sing Up Failed', result.errors);
      return result;
    }

    const { email, password } = formData.user;
    return this.runSignInWorkflow(email, password);
  }

  /**
   *
   * @param userVersion user's version, which is being updated, internal value
   * @param currentPassword old password
   * @param newPassword new password
   * @returns
   */
  public async runPasswordUpdateWorkflow(
    userVersion: number,
    currentPassword: string,
    newPassword: string
  ): Promise<APIResponse<CustomerDataReceived>> {
    debug('Trying to run password update workflow.');

    const result = await this.requestPasswordUpdate(
      userVersion,
      currentPassword,
      newPassword
    );

    if (result.ok) debug('Received password update result', result.body);
    else error('Password update failed', result.errors);

    return result;
  }

  /**
   *
   * @param userVersion user's version, which is being updated, internal value
   * @param actions list of actions for updating the client, see FieldEditBuilder
   * @returns Updated information about the user
   */
  public async runProfileUpdateWorkflow(
    userVersion: number,
    actions: ProfileUpdateAction[]
  ): Promise<APIResponse<CustomerDataReceived>> {
    debug('Trying to run profile update workflow.', actions);

    const result = await this.requestProfileUpdate(userVersion, actions);

    if (result.ok) debug('Received profile update result', result.body);
    else error('Profile update failed', result.errors);

    return result;
  }
}

export const authConnector = new AuthConnector();
