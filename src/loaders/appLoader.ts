import { Router } from '../framework/routing/router';
import { log } from '../framework/utilities/logging';
import { loginRequest } from '../data/loginRequest';

export const loadApp = () => {
  log('Loading the application');

  log('Initializing router');
  Router.getRouter();

  Router.getRouter().initNavigation();

  loginRequest().then(console.log).catch(console.error);
};
