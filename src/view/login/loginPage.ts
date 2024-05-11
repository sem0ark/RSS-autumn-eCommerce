import background from '../../../assets/background.jpg';
import './loginPage.css';

import { Page } from '../../framework/ui_components/page';

import { containerComponents } from '../shared/containerComponents';
import { footerComponents } from '../shared/footer/footer';
import { htmlComponents } from '../shared/htmlComponents';
import { navBar } from '../shared/navBar/nav';
import { loginForm } from './loginForm';
import { backgroundImageLayout } from '../shared/layouts/backgroundImageLayout';

const { wrapper, containerCenterRoundEdges } = containerComponents;
const { footerContainer } = footerComponents;

const { div, h2, link, p } = htmlComponents;

const linkToRegisterPage = () =>
  div(
    'Not Registered Yet? ',
    link('/signup', 'Create an account').cls('link-subtext')
  ).cls('subtext');

export const loginPage = () =>
  new Page(() => {
    return wrapper(
      navBar(),
      backgroundImageLayout(background)(
        containerCenterRoundEdges.cls('form-container')(
          h2('Create your unique bouquet').cls('form-title'),
          p('Login').cls('form-title'),
          loginForm(),
          linkToRegisterPage()
        )
      ),
      footerContainer()
    );
  }, 'Login | True Colors');
