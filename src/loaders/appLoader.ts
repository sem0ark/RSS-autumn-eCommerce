import '../styles/utilityStyles.css';

import { RegExpRoute, Router } from '../framework/routing/router';
import { log } from '../framework/utilities/logging';
import { loginPage } from '../view/login/loginPage';

export const loadApp = () => {
  log('Loading the application');

  log('Initializing router');
  Router.getRouter(new RegExpRoute('/login', loginPage()));

  Router.getRouter().initNavigation();
};
