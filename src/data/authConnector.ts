import { error } from '../framework/utilities/logging';
import { config } from '../utils/config';
import { ServerConnector, Token, TokenType } from './serverConnector';

/**
 * Response structure on login
 */
export interface LoginResponse {
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
    return !!this.accessToken;
  }

  public get accessToken(): string | undefined {
    return this._accessToken;
  }

  public set accessToken(newToken: Token) {
    this._accessToken = newToken;
  }

  public get refreshToken(): string | undefined {
    return this._refreshToken;
  }

  public set refreshToken(newToken: Token) {
    this._refreshToken = newToken;
  }

  /**
   * Authorize the user.
   * @param username - entered username from the form
   * @param password - entered password from the form
   * @returns Login information about the user
   */
  public async requestLoginToken(
    username: string,
    password: string
  ): Promise<LoginResponse | null> {
    try {
      const result = await ServerConnector.post(
        ServerConnector.getOAuthURL('customers/token'),
        {
          ...ServerConnector.makeBasicAuthHeader(),
          ...ServerConnector.formDataHeaders,
        },
        `grant_type=password&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&scope=${config.VITE_CTP_SCOPES_LIMITED}`
      );
      return result as LoginResponse;
    } catch (err) {
      error('Failed to log in', err as object);
    }
    return null;
  }

  /**
   * Authorize the user.
   * @param email - entered username from the form
   * @param password - entered password from the form
   * @returns Login information about the user
   */
  public async requestLoginSignIn(
    email: string,
    password: string
  ): Promise<LoginResponse | null> {
    try {
      if (!this.accessToken)
        throw new Error('Access token for sign in was not initialized.');

      const result = await ServerConnector.post(
        ServerConnector.getAuthURL('login'),
        {
          ...ServerConnector.makeBearerAuthHeader(this.accessToken),
          ...ServerConnector.formJSONHeaders,
        },
        { email, password }
      );
      return result as LoginResponse;
    } catch (err) {
      error('Failed to log in', err as object);
    }
    return null;
  }
}
