import './mainPage.css';
import { Page } from '../../framework/ui_components/page';

import { containerComponents } from '../shared/containerComponents';
import { navContainer } from '../shared/nav/nav';
import { mainComponents } from './mainComponent';
import { footerComponents } from '../shared/footer/footer';

const { wrapper } = containerComponents;
const { navElement } = navContainer;
const { mainContainerMP } = mainComponents;
const { footerContainer } = footerComponents;

export const mainPage = () =>
  new Page(() => {
    return wrapper(navElement(), mainContainerMP(), footerContainer());
  });
