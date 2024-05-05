import { DefaultRoute, RegExpRoute, Router } from '../framework/routing/router';
import { Page } from '../framework/ui_components/page';
import { log } from '../framework/utilities/logging';

import { factories } from '../framework/factories';

// view/examplePage.ts
function examplePage() {
  return new Page(() => {
    return factories.html('button')(
      'some text',
      123,
      factories.html('p')('some paragraph')
    );
  });
}

// view/notFoundPage.ts
function notFoundPage() {
  return new Page(() => {
    return factories.html('p')('Page not found!');
  });
}

// loaders/loadApp.ts
// will load the application using specified routing
// works as a main entry for the application
function loadApp() {
  log('Loading the application');

  log('Initializing router');
  Router.getRouter(
    new RegExpRoute('/', examplePage()), // render example page on root
    new DefaultRoute(notFoundPage()) // other
  );

  Router.getRouter().initNavigation();
}

export const exampleCounterApp = () => {
  loadApp();
};
