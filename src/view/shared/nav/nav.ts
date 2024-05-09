import './nav.css';
import { htmlComponents } from '../htmlComponents';
import { registerBtn } from '../buttons/registerBtn';
import { loginBtn } from '../buttons/loginBtn';
import { userProfileBtn } from '../buttons/userProfileBtn';
import { shoppingCartBtn } from '../buttons/shoppingCartBtn';
import logoSite from '../../../../assets/logo-site.svg';

const { div, header, nav, ul, li, link, iconSvg } = htmlComponents;

const navElement = () =>
  header(
    div(
      div(iconSvg(logoSite)).cls('logo-site'),
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
        ).cls('header-nav'),
        div().cls('header-btn-container').add(registerBtn()).add(loginBtn())
      ).cls('header-nav-container'),
      div(userProfileBtn(), shoppingCartBtn()).cls('header-btn-container')
    ).cls('header-container', '_container')
  ).cls('header', 'nav-element');

export const navContainer = {
  navElement,
};
