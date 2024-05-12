import './navBar.css';
import userSVG from '../../../../assets/icon-user-profile.svg';
import cartSVG from '../../../../assets/shopping-cart.svg';
import logoSVG from '../../../../assets/logo-site.svg';

import { htmlComponents } from '../htmlComponents';
import { inputComponents } from '../inputComponents';
import { containerComponents } from '../containerComponents';

const { div, nav, ul, li, link, iconSvg } = htmlComponents;
const { buttonSecondary, buttonPrimary, buttonIcon } = inputComponents;
const { containerMaxWidth, containerFlexRow } = containerComponents;

export const navBar = () =>
  containerMaxWidth
    .cls('navbar')(
      div(iconSvg(logoSVG)).cls('logo-site'),
      div(
        nav(
          ul(
            li(link('/', 'Home').cls('header-link', 'active-link')).cls(
              'header-item'
            ),
            li(link('/catalog', 'Catalog product').cls('header-link')).cls(
              'header-item'
            ),
            li(link('/about', 'About us').cls('header-link')).cls('header-item')
          ).cls('header-list')
        ),
        containerFlexRow({ gap: 20 })(
          buttonSecondary('Sign up'),
          buttonPrimary('Login')
        )
      ).cls('header-nav-container'),
      containerFlexRow({ gap: 20 })(buttonIcon(userSVG), buttonIcon(cartSVG))
    )
    .tag('header');
