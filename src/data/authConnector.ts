import { error } from '../framework/utilities/logging';
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
  password?: string;

  firstName?: string;
  lastName?: string;

  dateOfBirth?: Date;
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

export class AuthConnector {
  private _accessToken?: Token;

  private _refreshToken?: Token;

  /**
   * @returns If access token is available.
   */
  public isLoggedIn(): boolean {
    return !!this._accessToken;
  }

  public async requestTokenRefresh() {
    const result = await ServerConnector.post<LoginTokenResponse>(
      ServerConnector.getOAuthURL('customers/token'),
      {
        ...ServerConnector.makeBasicAuthHeader(),
        ...ServerConnector.formDataHeaders,
      },
      `grant_type=refresh_token&refresh_token=${this._refreshToken}`
    );

    if (result.ok) {
      this._accessToken = result.body.access_token;
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
        ...ServerConnector.makeBasicAuthHeader(),
        ...ServerConnector.formDataHeaders,
      },
      `grant_type=password&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&scope=${config.VITE_CTP_SCOPES_LIMITED}`
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
    if (!this._accessToken)
      throw new Error('Access token for sign in was not initialized.');

    const result = await ServerConnector.post<CustomerDataReceived>(
      ServerConnector.getAuthURL('login'),
      {
        ...ServerConnector.makeBearerAuthHeader(this._accessToken),
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
    const tokenResult = await this.requestLoginToken(email, password);
    if (!tokenResult.ok) return tokenResult;

    if (tokenResult.body.access_token)
      this._accessToken = tokenResult.body.access_token;

    return this.requestLoginSignIn(email, password);
  }
}
