import '../styles/utilityStyles.css';

import { Router } from '../framework/routing/router';
import { log } from '../framework/utilities/logging';

export const loadApp = () => {
  log('Loading the application');

  log('Initializing router');
  Router.getRouter();

  Router.getRouter().initNavigation();
};
