import { error } from '../framework/utilities/logging';
import { config } from '../utils/config';
import { ServerConnector, Token, TokenType } from './serverConnector';

/**
 * Response structure on login
 */
interface LoginResponse {
  access_token: Token;
  expires_in: number;

  // commented out values to hide from the other app's functionality
  // scope: string;
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

  // middleName?: string;
  // title?: string;

  dateOfBirth?: Date;

  addresses: Address[];
}

export type CustomerDataReceived = CustomerData & {
  id: string;
  version: number;
};

export class AuthConnector {
  private static _accessToken?: Token;

  private static _refreshToken?: Token;

  /**
   * @returns if access token is available
   */
  public static isLoggedIn(): boolean {
    return !!AuthConnector.accessToken;
  }

  public static get accessToken(): string | undefined {
    return AuthConnector._accessToken;
  }

  public static get refreshToken(): string | undefined {
    return AuthConnector._refreshToken;
  }

  public static set accessToken(newToken: Token) {
    AuthConnector._accessToken = newToken;
  }

  public static set refreshToken(newToken: Token) {
    AuthConnector._refreshToken = newToken;
  }

  /**
   * Authorize the user.
   * @param username - entered username from the form
   * @param password - entered password from the form
   * @returns Login information about the user
   */
  public async makeLoginRequest(
    username: string,
    password: string
  ): Promise<LoginResponse | null> {
    try {
      const result = await ServerConnector.post(
        ServerConnector.getAuthURL(),
        {
          Authorization: ServerConnector.makeBasicAuthHeader(),
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
}
