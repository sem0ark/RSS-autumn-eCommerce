import { config } from '../utils/config';

export type Token = string;
export type TokenType = 'Bearer';

export class ServerConnector {
  /**
   * Provides a standard set of headers for form submission request
   */
  public static readonly formDataHeaders = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  public static getAuthURL(postfix = '') {
    return `https://${config.VITE_CTP_AUTH_HOST}/oauth/${config.VITE_CTP_PROJECT_KEY}/${postfix}`;
  }

  public static makeBasicAuthHeader(): string {
    const encodedData = btoa(
      `${config.VITE_CTP_CLIENT_ID}:${config.VITE_CTP_CLIENT_SECRET}`
    );
    return `Basic ${encodedData}`;
  }

  public static makeBearerAuthHeader(token: Token): string {
    return `Bearer ${token}`;
  }

  private static async makeRequestJSON(
    url: string,
    method: string,
    headers: HeadersInit = {},
    body?: string | object
  ) {
    const formattedBody = body
      ? undefined
      : typeof body === 'object'
        ? JSON.stringify(body)
        : body;

    const response = await fetch(url, {
      method: method,
      headers,
      body: formattedBody,
    });

    return response.json();
  }

  /**
   * Make a formatted "post" request.
   * @param url URL of the request.
   * @param headers Required headers, such as token.
   * @param body Text representation (or object - automatically parsed to JSON) of body if needed.
   * @returns "body" object from parsed JSON is any.
   */
  public static post = async (
    url: string,
    headers: HeadersInit = {},
    body?: string | object
  ) => ServerConnector.makeRequestJSON(url, 'POST', headers, body);

  /**
   * Make a formatted "get" request.
   * @param url URL of the request.
   * @param headers Required headers, such as token.
   * @param body Text representation (or object - automatically parsed to JSON) of body if needed.
   * @returns "body" object from parsed JSON is any.
   */
  public static get = async (
    url: string,
    headers: HeadersInit = {},
    body?: string | object
  ) => ServerConnector.makeRequestJSON(url, 'GET', headers, body);

  /**
   * Make a formatted "put" request.
   * @param url URL of the request.
   * @param headers Required headers, such as token.
   * @param body Text representation (or object - automatically parsed to JSON) of body if needed.
   * @returns "body" object from parsed JSON is any.
   */
  public static put = async (
    url: string,
    headers: HeadersInit = {},
    body?: string | object
  ) => ServerConnector.makeRequestJSON(url, 'PUT', headers, body);

  /**
   * Make a formatted "delete" requ.est
   * @param url URL of the request.
   * @param headers Required headers, such as token.
   * @param body Text representation (or object - automatically parsed to JSON) of body if needed.
   * @returns "body" object from parsed JSON is any.
   */
  public static delete = async (
    url: string,
    headers: HeadersInit = {},
    body?: string | object
  ) => ServerConnector.makeRequestJSON(url, 'DELETE', headers, body);
}
