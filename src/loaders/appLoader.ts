import '../styles/utilityStyles.css';

import { DefaultRoute, RegExpRoute, Router } from '../framework/routing/router';
import { log } from '../framework/utilities/logging';
import { loginPage } from '../view/login/loginPage';
import { mainPage } from '../view/main/mainPage';
import { notFoundPage } from '../view/notFoundPage/notFoundPage';

export const loadApp = () => {
  log('Loading the application');

  log('Initializing router');
  Router.getRouter(
    new RegExpRoute('/', mainPage),
    new RegExpRoute('/main', mainPage),
    new RegExpRoute('/login', loginPage),
    new DefaultRoute(notFoundPage)
  );

  Router.getRouter().initNavigation();
};
