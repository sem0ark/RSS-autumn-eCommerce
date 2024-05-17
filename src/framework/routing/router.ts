import { Property } from '../reactive_properties/property';
import { Storage } from '../persistence/storage';
import { info } from '../utilities/logging';
import { Page } from '../ui_components/page';

/**
 * Router class implemented routing functionality for the Single Page application.
 * It will use header-like inner routing to allow smooth reloads and UX on on the website.
 */
export class Router {
  private static router?: Router;

  private static extractPath(href: string) {
    const pathIndex = href.indexOf('#');
    if (pathIndex === -1) return '/';

    const queryIndex = href.indexOf('?', pathIndex);
    const appPath = href.slice(
      pathIndex + 1,
      queryIndex !== -1 ? queryIndex : href.length + 1
    );
    return appPath;
  }

  private currentPath?: Property<string>;

  /**
   * Will initialize the localStorage saving for the current route.
   */
  public initNavigation() {
    const storage = new Storage('router_');
    this.currentPath = storage.registerProperty(
      new Property<string>('currentPath', '/')
    );
    Router.navigateTo(this.currentPath?.get());
  }

  private constructor(private routes: Route[]) {
    addEventListener('popstate', (e: PopStateEvent) => {
      const appPath = Router.extractPath(document.location.href);
      info(`Popstate: location: ${appPath}, state: ${JSON.stringify(e.state)}`);

      this.matchRoutes(appPath);
    });
  }

  private matchRoutes(pathName: string): void {
    info(`Matching routes for "${pathName}"`);

    this.currentPath?.set(pathName);
    for (const route of this.routes) {
      const m = route.match(pathName);

      if (m !== null) {
        info(`Found route "${route.routePath}" for "${pathName}"`);
        return route.render(...m);
      }
    }
  }

  /**
   * Get the current router instance. Will be used to initialize the navigation on the SPA website.
   *
   * @param routes - will be used in case the router was deleted or not instantiated
   * @returns
   */
  public static getRouter(...routes: Route[]): Router {
    if (Router.router) return Router.router;
    Router.router = new Router(routes);
    return Router.router;
  }

  public static clearRouter() {
    delete Router.router;
  }

  public static navigateTo(pathName: string, overridePath = false): void {
    const newPath = `${window.location.origin}${window.location.pathname}#${pathName}`;

    info(`Updating "window" path to ${newPath}`);
    if (overridePath) history.replaceState({}, '', newPath);
    else history.pushState({}, '', newPath);

    Router.getRouter().matchRoutes(pathName);
  }
}

/**
 * Will match a standard string URL.
 */
export abstract class Route {
  constructor(
    protected page?: Page,
    protected routeString?: string
  ) {}

  public get routePath() {
    return this.routeString;
  }

  public abstract match(url: string): string[] | null;

  public render(...params: string[]): void {
    info(
      `Rendering page for route "${this.routePath}" with parameters: [${params}]`
    );
    this.page?.render(...params);
  }
}

/**
 * Will match any request, in case the previous routes didn't handle it, and resolve the provided page.
 */
export class DefaultRoute extends Route {
  constructor(protected page: Page) {
    super(page, 'default-route');
  }

  public match(): string[] | null {
    return [];
  }

  public render(...params: string[]): void {
    this.page.render(...params);
  }
}

export class RedirectRoute extends Route {
  constructor(protected redirectionLink: string) {
    super(undefined, `redirect to ${redirectionLink}`);
  }

  public match(): string[] | null {
    return [];
  }

  public render(): void {
    Router.navigateTo(this.redirectionLink);
  }
}

/**
 * Will match regular-expression-like route and, in case the specific expressions were used, send them into the provided page on render.
 * Expressions possible:
 * - `[int]` (as in `/product/data/[int]`) will match any digits and pass them as a string into Page instance. (e.g. 02324)
 * - `[word]` (as in `/message/to/[word]`) will match any set of lower and upper case characters. (e.g. BaNana)
 * - `[string]` (as in /`product/[string]/data`) will match any digits or characters and pass them as a string into Page instance. (e.g. some-id-123)
 * - `[path]` (as in `/product/category/[path]`) will match any path and will pass split values into Page instance (e.g. `/product/category/apples/green` into `["apple", "green"]`)
 */
export class RegExpRoute extends Route {
  private regex: RegExp;

  constructor(routeString: string, page: Page) {
    super(page, routeString);
    this.regex = RegExpRoute.makeRouteRegExp(routeString);
    info(
      `Initializing RegExpRouter{${routeString}} with expression ${this.regex}`
    );
  }

  public match(url: string): string[] | null {
    const match = url.match(this.regex);
    if (match === null) return null;
    return match.slice(1).flatMap((v) => v.split('/')); // for handling path data
  }

  private static makeRouteRegExp(str: string): RegExp {
    str = str.replace(/\[int\]/g, `([0-9]+)`);
    str = str.replace(/\[word\]/g, `([a-zA-Z]+)`);
    str = str.replace(/\[string\]/g, `([a-zA-Z0-9\\-\\_]+)`);
    str = str.replace(/\[path\]/g, `([^\\s\\?\\#]+)`);

    return new RegExp(`^${str}$`, 'i');
  }
}
