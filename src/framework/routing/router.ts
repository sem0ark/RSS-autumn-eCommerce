import { Property } from '../reactive_properties/property';
import { Storage } from '../persistence/storage';
import { log } from '../utilities/logging';
import { Page } from '../ui_components/page';

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
      log(`Popstate: location: ${appPath}, state: ${JSON.stringify(e.state)}`);

      this.matchRoutes(appPath);
    });
  }

  private matchRoutes(pathName: string): void {
    log(`Matching routes for "${pathName}"`);

    this.currentPath?.set(pathName);
    for (const route of this.routes) {
      const m = route.match(pathName);

      if (m !== null) {
        log(`Found route "${route.routePath}" for "${pathName}"`);
        return route.render(...m);
      }
    }
  }

  public static getRouter(...routes: Route[]): Router {
    if (Router.router) return Router.router;
    Router.router = new Router(routes);
    return Router.router;
  }

  public static clearRouter() {
    delete Router.router;
  }

  public static navigateTo(pathName: string): void {
    const newPath = `${window.location.origin}${window.location.pathname}#${pathName}`;

    log(`Updating "window" path to ${newPath}`);
    history.pushState({}, pathName, newPath);
    Router.getRouter().matchRoutes(pathName);
  }
}

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
    log(
      `Rendering page for route "${this.routePath}" with parameters: [${params}]`
    );
    this.page?.render(...params);
  }
}

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

export class RegExpRoute extends Route {
  private regex: RegExp;

  constructor(routeString: string, page: Page) {
    super(page, routeString);
    this.regex = RegExpRoute.makeRouteRegExp(routeString);
    log(
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
    str = str.replace(/\[string\]/g, `([a-zA-Z0-9\\-]+)`);
    str = str.replace(/\[path\]/g, `([^\\s\\?\\#]+)`);

    return new RegExp(`^${str}$`, 'i');
  }
}
