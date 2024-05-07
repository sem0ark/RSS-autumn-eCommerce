import './loginPage.css';
import { Page } from '../../framework/ui_components/page';

import { containerComponents } from '../shared/containerComponents';
import { navContainer } from '../shared/nav/nav';
import { footerComponents } from '../shared/footer/footer';
import { htmlComponents } from '../shared/htmlComponents';

const { wrapper } = containerComponents;
const { navElement } = navContainer;
const { main } = htmlComponents;
const { footerContainer } = footerComponents;

export const loginPage = () =>
  new Page(() => {
    return wrapper(navElement(), main('main').cls('main'), footerContainer());
  });
