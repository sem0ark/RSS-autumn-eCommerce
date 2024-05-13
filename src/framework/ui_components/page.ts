import { Component } from './component';

/**
 * Class representing a Page in Single Page Application
 * It will contain a render function, returning some Component and also optionally receive some path arguments from the Router.
 */
export class Page {
  public static rootId: string = 'app-root';

  public constructor(
    private renderPage: (...config: string[]) => Component,
    private readonly pageTitle?: string
  ) {}

  public render(...config: string[]): void {
    if (document.getElementById(Page.rootId) === null) {
      const appRoot = document.createElement('div');
      appRoot.id = Page.rootId;
      document.body.appendChild(appRoot);
    }

    // to avoid mishaps such as page not rendering fully before adding a new
    setTimeout(() => {
      (document.getElementById(Page.rootId) as HTMLElement).innerHTML = '';
      document
        .getElementById(Page.rootId)
        ?.appendChild(this.renderPage(...config).render(false));
    });

    const pageTitleElement = document.getElementById('page-title');
    if (pageTitleElement && this.pageTitle) {
      pageTitleElement.innerText = this.pageTitle;
    }
  }
}
