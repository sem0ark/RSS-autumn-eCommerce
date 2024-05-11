import background from '../../../assets/background.jpg';
import './loginPage.css';

import { Page } from '../../framework/ui_components/page';

import { containerComponents } from '../shared/containerComponents';
import { footerComponents } from '../shared/footer/footer';
import { htmlComponents } from '../shared/htmlComponents';
import { navBar } from '../shared/navBar/nav';
import { loginForm } from './loginForm';
import { backgroundImageLayout } from '../shared/layouts/backgroundImageLayout';

const { div, h2, link, h1 } = htmlComponents;

const { wrapper, containerCenterRoundEdges } = containerComponents;
const { footerContainer } = footerComponents;

const linkToRegisterPage = () =>
  div(
    'Not registered yet? ',
    link('/login', 'Create an account').cls('link-subtext')
  ).cls('subtext');

export const loginPage = () =>
  new Page(() => {
    return wrapper(
      navBar(),
      backgroundImageLayout(background)(
        containerCenterRoundEdges.cls('form-container')(
          h2('Create your unique bouquet').cls('form-header'),
          h1('Login').cls('form-title'),
          loginForm(),
          linkToRegisterPage()
        )
      ),
      footerContainer()
    );
  }, 'Login | True Colors');
