import './navBar.css';

import userSVG from '../../../../assets/icon-user-profile.svg';
import cartSVG from '../../../../assets/shopping-cart.svg';
import logoSVG from '../../../../assets/logo-site.svg';

import { htmlComponents } from '../htmlComponents';
import { inputComponents } from '../inputComponents';
import { containerComponents } from '../containerComponents';
import { factories } from '../../../framework/factories';
import { authContext } from '../../../contexts/authContext';
import { Router } from '../../../framework/routing/router';

const { functional } = factories;
const { div, nav, ul, li, link, iconSvg, hidden } = htmlComponents;
const { buttonSecondary, buttonPrimary, buttonIcon } = inputComponents;
const { containerMaxWidth, containerFlexRow } = containerComponents;

const currentTab = factories.pinteger(0, 'currentTab');

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
            li(
              link('/', 'Home')
                .cls('header-link')
                .propClass(currentTab, (c) => (c === 0 ? ['active-link'] : []))
            ).onClick(() => currentTab.set(0)),
            li(
              link('/catalog', 'Catalog')
                .cls('header-link')
                .propClass(currentTab, (c) => (c === 1 ? ['active-link'] : []))
            ).onClick(() => currentTab.set(1)),
            li(
              link('/about', 'About us')
                .cls('header-link')
                .propClass(currentTab, (c) => (c === 2 ? ['active-link'] : []))
            ).onClick(() => currentTab.set(2))
          ).cls('header-list')
        ),

        containerFlexRow({ gap: 20 })(
          buttonSecondary('Sign Up')
            .onClick(() => Router.navigateTo('/login/signup'))
            .propClass(currentTab, (c) => (c === 3 ? ['active'] : []))
            .onClick(() => currentTab.set(3)),

          buttonPrimary('Login')
            .onClick(() => Router.navigateTo('/login'))
            .propClass(currentTab, (c) => (c === 4 ? ['active'] : []))
            .onClick(() => currentTab.set(4)),

          functional(() =>
            authContext.userIsLoggedIn.get()
              ? buttonSecondary('Logout').onClick(() =>
                  authContext.attemptLogout().then((success) => {
                    if (success) Router.navigateTo('/');
                  })
                )
              : hidden()
          )
        ).cls('navbar-buttons')
      ).cls('header-nav-container'),

      containerFlexRow({ gap: 20 })(
        buttonIcon(userSVG)
          .onClick(() => Router.navigateTo('/user'))
          .propClass(currentTab, (c) => (c === 5 ? ['active'] : []))
          .onClick(() => currentTab.set(5)),
        buttonIcon(cartSVG)
          .onClick(() => Router.navigateTo('/cart'))
          .propClass(currentTab, (c) => (c === 6 ? ['active'] : []))
          .onClick(() => currentTab.set(6))
      ).cls('navbar-buttons')
    )
    .propClass(menuOpen, (o) => (o ? ['navbar-menu-open'] : []))
    .tag('header');
};
