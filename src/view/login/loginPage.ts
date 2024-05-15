import background from '../../../assets/background.jpg';
import './loginPage.css';

import { Page } from '../../framework/ui_components/page';

import { containerComponents } from '../shared/containerComponents';
import { htmlComponents } from '../shared/htmlComponents';
import { loginForm } from './loginForm';
import { backgroundImageLayout } from '../shared/layouts/backgroundImageLayout';
import { authContext } from '../../contexts/authContext';
import { Router } from '../../framework/routing/router';
import { notificationContext } from '../../contexts/notificationContext';

const { div, h2, link, h1 } = htmlComponents;
const { containerCenterRoundEdges } = containerComponents;

export const loginPage = new Page(() => {
  if (authContext.userIsLoggedIn.get()) {
    Router.navigateTo('/');
    notificationContext.addInformation(`You are already logged in.`);
  }

  return backgroundImageLayout(background)(
    containerCenterRoundEdges.cls('form-container', 'login-page')(
      h2('Create your unique bouquet').cls('form-header'),
      h1('Login').cls('form-title'),
      loginForm(),
      div(
        'Not registered yet? ',
        link('/login/signup', 'Create an account').cls('link-subtext')
      ).cls('subtext')
    )
  );
}, 'Login | True Colors');
