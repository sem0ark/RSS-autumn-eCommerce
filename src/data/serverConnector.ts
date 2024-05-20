import { trace } from '../framework/utilities/logging';
import { config } from '../utils/config';

export type Token = string;
export type TokenType = 'Bearer';

/**
 * Describes a single error entry in the errors array from the API.
 */
export interface ErrorEntry {
  code: string;
  message: string;
}

export type APIResponse<T> =
  | {
      ok: true;
      body: T;
    }
  | {
      ok: false;
      errors: ErrorEntry[];
    };

export class ServerConnector {
  /**
   * Provides a standard set of headers for form submission request
   */
  public static readonly formDataHeaders = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  /**
   * Provides a standard set of headers for JSON data
   */
  public static readonly formJSONHeaders = {
    'Content-Type': 'application/json',
  };

  public static getOAuthURL(postfix = '') {
    return `https://${config.VITE_CTP_AUTH_HOST}/oauth/${config.VITE_CTP_PROJECT_KEY}/${postfix}`;
  }

  public static getAPIURL(postfix = '') {
    return `https://${config.VITE_CTP_API_HOST}/${config.VITE_CTP_PROJECT_KEY}/${postfix}`;
  }

  public static makeBearerAuthHeader(token: Token) {
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  public static makeBasicAuthHeader() {
    const encodedData = btoa(
      `${config.VITE_CTP_CLIENT_ID}:${config.VITE_CTP_CLIENT_SECRET}`
    );
    return {
      Authorization: `Basic ${encodedData}`,
    };
  }

  private static async makeRequestJSON<T>(
    url: string,
    method: string,
    headers: HeadersInit = {},
    body?: string | object
  ): Promise<APIResponse<T>> {
    const formattedBody = body
      ? typeof body === 'object'
        ? JSON.stringify(body)
        : body
      : undefined;

    try {
      trace(`Sending a new request ${url}:${method}, ${body}`);
      const response = await fetch(url, {
        method: method,
        headers,
        body: formattedBody,
      });

      if (response.ok)
        return {
          ok: true,
          body: await response.json(),
        };

      return {
        ok: false,
        // https://docs.commercetools.com/api/errors#top
        errors: (await response.json()).errors as ErrorEntry[],
      };
    } catch (err) {
      return {
        ok: false,
        errors: [
          {
            code: 'Fetch Error',
            message: `Request Failed: ${err}`,
          },
        ],
      };
    }
  }

  /**
   * Make a formatted "post" request.
   * @param url URL of the request.
   * @param headers Required headers, such as token.
   * @param body Text representation (or object - automatically parsed to JSON) of body if needed.
   * @returns "body" object from parsed JSON is any.
   */
  public static post = async <T>(
    url: string,
    headers: HeadersInit = {},
    body?: string | object
  ) => ServerConnector.makeRequestJSON<T>(url, 'POST', headers, body);

  /**
   * Make a formatted "get" request.
   * @param url URL of the request.
   * @param headers Required headers, such as token.
   * @param body Text representation (or object - automatically parsed to JSON) of body if needed.
   * @returns "body" object from parsed JSON is any.
   */
  public static get = async <T>(
    url: string,
    headers: HeadersInit = {},
    body?: string | object
  ) => ServerConnector.makeRequestJSON<T>(url, 'GET', headers, body);

  /**
   * Make a formatted "put" request.
   * @param url URL of the request.
   * @param headers Required headers, such as token.
   * @param body Text representation (or object - automatically parsed to JSON) of body if needed.
   * @returns "body" object from parsed JSON is any.
   */
  public static put = async <T>(
    url: string,
    headers: HeadersInit = {},
    body?: string | object
  ) => ServerConnector.makeRequestJSON<T>(url, 'PUT', headers, body);

  /**
   * Make a formatted "delete" request.
   * @param url URL of the request.
   * @param headers Required headers, such as token.
   * @param body Text representation (or object - automatically parsed to JSON) of body if needed.
   * @returns "body" object from parsed JSON is any.
   */
  public static delete = async <T>(
    url: string,
    headers: HeadersInit = {},
    body?: string | object
  ) => ServerConnector.makeRequestJSON<T>(url, 'DELETE', headers, body);
}
