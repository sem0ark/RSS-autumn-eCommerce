import background from '../../../assets/background.jpg';
import './loginPage.css';

import { Page } from '../../framework/ui_components/page';

import { containerComponents } from '../shared/containerComponents';
import { footerComponents } from '../shared/footer/footer';
import { htmlComponents } from '../shared/htmlComponents';
import { navBar } from '../shared/navBar/navBar';
import { loginForm } from './loginForm';
import { backgroundImageLayout } from '../shared/layouts/backgroundImageLayout';

const { div, h2, link, h1 } = htmlComponents;

const { containerOuter, containerCenterRoundEdges } = containerComponents;
const { footerContainer } = footerComponents;

export const loginPage = () =>
  new Page(() => {
    return containerOuter(
      navBar(),
      backgroundImageLayout(background)(
        containerCenterRoundEdges.cls('form-container')(
          h2('Create your unique bouquet').cls('form-header'),
          h1('Login').cls('form-title'),
          loginForm(),
          div(
            'Not registered yet? ',
            link('/signup', 'Create an account').cls('link-subtext')
          ).cls('subtext')
        )
      ),
      footerContainer()
    );
  }, 'Login | True Colors');
