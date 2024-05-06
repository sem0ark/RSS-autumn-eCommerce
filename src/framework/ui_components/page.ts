import { Component } from './component';

/**
 * Class representing a Page in Single Page Application
 * It will contain a render function, returning some Component and also optionally receive some path arguments from the Router.
 */
export class Page {
  public static rootId: string = 'app-root';

  public constructor(private renderPage: (...config: string[]) => Component) {}

  public render(...config: string[]): void {
    if (document.getElementById(Page.rootId) === null) {
      const appRoot = document.createElement('div');
      appRoot.id = Page.rootId;
      document.body.appendChild(appRoot);
    }

    (document.getElementById('app-root') as HTMLElement).innerHTML = '';
    document
      .getElementById('app-root')
      ?.appendChild(this.renderPage(...config).render(false));
  }
}
