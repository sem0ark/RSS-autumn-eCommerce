import { RegExpRoute, Router } from '../framework/routing/router';
import { log } from '../framework/utilities/logging';
import { loginPage } from '../view/login/loginPage';
import { mainPage } from '../view/main/mainPage';

export const loadApp = () => {
  log('Loading the application');

  log('Initializing router');
  Router.getRouter(
    new RegExpRoute('/login', loginPage()),
    new RegExpRoute('/main', mainPage())
  );

  Router.getRouter().initNavigation();
};
