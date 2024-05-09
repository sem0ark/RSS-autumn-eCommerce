import './loginPage.css';
import { Page } from '../../framework/ui_components/page';

import { containerComponents } from '../shared/containerComponents';
import { navContainer } from '../shared/nav/nav';
import { mainComponents } from './mainLoginPage';
import { footerComponents } from '../shared/footer/footer';

const { wrapper } = containerComponents;
const { navElement } = navContainer;
const { mainContainer } = mainComponents;
const { footerContainer } = footerComponents;

export const loginPage = () =>
  new Page(() => {
    return wrapper(navElement(), mainContainer(), footerContainer());
  });
