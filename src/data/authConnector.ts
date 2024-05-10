import { debug, error } from '../framework/utilities/logging';
import { config } from '../utils/config';
import {
  APIResponse,
  ServerConnector,
  Token,
  TokenType,
} from './serverConnector';

/**
 * Response structure on login
 */
export interface LoginTokenResponse {
  access_token: Token;
  expires_in: number;

  // commented out values to hide from the other app's functionality
  refresh_token: Token;
  token_type: TokenType;
}

/**
 * Address object interface based on the commerce tools documentation and RSS requirements.
 */
export interface Address {
  // key: string;
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

  firstName: string;
  lastName: string;

  dateOfBirth: Date;
  addresses: Address[];
}

/**
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

class AuthConnector {
  private _tokenData?: {
    accessToken: Token;
    /**
     * Date of expiration in milliseconds
     */
    expirationDateMS: number;
    refreshToken: Token;
  };

  /**
   * @returns If access token is available.
   */
  public isLoggedIn(): boolean {
    return !!this._tokenData;
  }

  public getAuthBearerHeaders() {
    if (!this._tokenData?.accessToken)
      throw new Error('Access token for sign in was not initialized.');
    return ServerConnector.makeBearerAuthHeader(this._tokenData.accessToken);
  }

  public getAuthBasicHeaders() {
    return ServerConnector.makeBasicAuthHeader();
  }

  private configureTokenData(responseData: LoginTokenResponse) {
    this._tokenData = {
      accessToken: responseData.access_token,
      refreshToken: responseData.refresh_token,
      expirationDateMS: Date.now() + responseData.expires_in,
    };
  }

  public async requestTokenRefresh() {
    const result = await ServerConnector.post<LoginTokenResponse>(
      ServerConnector.getOAuthURL('customers/token'),
      {
        ...this.getAuthBasicHeaders(),
        ...ServerConnector.formDataHeaders,
      },
      `grant_type=refresh_token&refresh_token=${this._tokenData?.refreshToken}`
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
   * Authorize the user.
   * @param email - entered username from the form
   * @param password - entered password from the form
   * @returns Login information about the user
   */
  private async requestLoginSignIn(email: string, password: string) {
    if (!this._tokenData?.accessToken)
      throw new Error('Access token for sign in was not initialized.');

    const result = await ServerConnector.post<CustomerDataReceived>(
      ServerConnector.getAuthURL('me/login'),
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
   * Authorize the user.
   * @param username - entered username from the form
   * @param password - entered password from the form
   * @returns Login information about the user
   */
  public async runSignInWorkflow(
    email: string,
    password: string
  ): Promise<APIResponse<CustomerDataReceived>> {
    debug('Trying to run login workflow.');

    if (!this._tokenData) {
      const tokenResult = await this.requestLoginToken(email, password);
      if (!tokenResult.ok) return tokenResult;

      this.configureTokenData(tokenResult.body);
    } else if (this._tokenData?.expirationDateMS > Date.now()) {
      debug('Token already exists, but it is outdated.');
      await this.requestTokenRefresh();
    }

    const singInResult = await this.requestLoginSignIn(email, password);

    if (singInResult.ok) debug('Singed in successfully', singInResult.body);
    else debug('Sing In Failed', singInResult.errors);

    return singInResult;
  }
}

export const authConnector = new AuthConnector();
