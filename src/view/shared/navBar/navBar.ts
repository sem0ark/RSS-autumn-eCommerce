import './navBar.css';
import userSVG from '../../../../assets/icon-user-profile.svg';
import cartSVG from '../../../../assets/shopping-cart.svg';
import logoSVG from '../../../../assets/logo-site.svg';

import { htmlComponents } from '../htmlComponents';
import { inputComponents } from '../inputComponents';
import { containerComponents } from '../containerComponents';
import { factories } from '../../../framework/factories';

const { div, nav, ul, li, link, iconSvg } = htmlComponents;
const { buttonSecondary, buttonPrimary, buttonIcon } = inputComponents;
const { containerMaxWidth, containerFlexRow } = containerComponents;

export const navBar = () => {
  const menuOpen = factories.pboolean(false, 'menuOpen');

  return containerMaxWidth
    .cls('navbar')(
      div(iconSvg(logoSVG))
        .cls('logo-site')
        .onClick(() => menuOpen.toggle()),
      div(
        nav(
          ul(
            li(link('/', 'Home').cls('header-link', 'active-link')),
            li(link('/catalog', 'Catalog').cls('header-link')),
            li(link('/about', 'About us').cls('header-link'))
          ).cls('header-list')
        ),
        containerFlexRow({ gap: 20 })(
          buttonSecondary('Sign up'),
          buttonPrimary('Login')
        ).cls('navbar-buttons')
      ).cls('header-nav-container'),

      containerFlexRow({ gap: 20 })(
        buttonIcon(userSVG),
        buttonIcon(cartSVG)
      ).cls('navbar-buttons')
    )
    .propClass(menuOpen, (o) => (o ? ['navbar-menu-open'] : []))
    .tag('header');
};
