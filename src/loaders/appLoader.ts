import '../styles/utilityStyles.css';

import { DefaultRoute, RegExpRoute, Router } from '../framework/routing/router';
import { log } from '../framework/utilities/logging';
import { loginPage } from '../view/login/loginPage';
import { mainPage } from '../view/main/mainPage';
import { notFoundPage } from '../view/notFoundPage/notFoundPage';
import { signupPage } from '../view/signup/signupPage';
import { profilePage } from '../view/profile/profilePage';
import { catalogPage } from '../view/catalog/catalogPage';
import { productDescriptionPage } from '../view/productDescription/productDescriptionPage';
import { cartPage } from '../view/cart/cartPage';
import { aboutPage } from '../view/about/aboutPage';

export const loadApp = () => {
  log('Loading the application');

  log('Initializing router');
  Router.getRouter(
    new RegExpRoute('/', mainPage),
    new RegExpRoute('/main', mainPage),
    new RegExpRoute('/login/signup', signupPage),
    new RegExpRoute('/login', loginPage),
    new RegExpRoute('/user', profilePage),
    new RegExpRoute('/catalog', catalogPage),
    new RegExpRoute('/catalog/[string]', catalogPage),
    new RegExpRoute('/products/[string]', productDescriptionPage),
    new RegExpRoute('/cart', cartPage),
    new RegExpRoute('/about', aboutPage),
    new DefaultRoute(notFoundPage)
  );

  Router.getRouter().initNavigation();
};
