import background from '../../../assets/background.jpg';
import './loginPage.css';

import { Page } from '../../framework/ui_components/page';

import { containerComponents } from '../shared/containerComponents';

import { footerComponents } from '../shared/footer/footer';

const { wrapper } = containerComponents;
const { footerContainer } = footerComponents;

const { formContainer } = formComponents;
const { main, div, img } = htmlComponents;

export const loginPage = () =>
  new Page(() => {
    return wrapper(
      navBar(),

      main.cls('main', 'main-logo-page')(
        div.cls('background-logo-img-container')(
          img(background).cls('background-logo-img')
        ),
        div.cls('main-logo-page-container', '_container')(formContainer())
      ),

      footerContainer()
    );
  });
