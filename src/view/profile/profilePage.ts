import './profilePage.css';
import signOutSVG from '../../../assets/sign-out.svg';
import profileSVG from '../../../assets/icon-user-profile.svg';

import { Page } from '../../framework/ui_components/page';
import { sidebarLayout } from '../shared/layouts/sidebarLayout';
import { htmlComponents } from '../shared/htmlComponents';
import { textComponents } from '../shared/textComponents';
import { factories } from '../../framework/factories';
import { authContext } from '../../contexts/authContext';
import { userData } from './userData';
import { Router } from '../../framework/routing/router';

const { functional } = factories;
const { aside, main, div, hidden } = htmlComponents;
const { header2Orange, header3Orange, textSubtext, textMenuEntry } =
  textComponents;

export const profilePage = new Page(() => {
  if (!authContext.userIsLoggedIn.get()) {
    Router.navigateTo('/', true);
    return hidden();
  }

  return sidebarLayout('My Info')(
    aside(
      functional(() => header2Orange(`Hello, ${authContext.userName.get()}`)),
      textSubtext('Welcome to your account'),
      div(
        textMenuEntry(profileSVG, 'My Info').cls('active'),
        textMenuEntry(signOutSVG, 'Sign Out').onClick(() => {
          authContext.attemptLogout().then((success) => {
            if (success) Router.navigateTo('/');
          });
        })
      ).cls('menu')
    ).cls('profile-page'),
    main(
      header2Orange('My Info'),

      header3Orange('Profile Details'),
      userData(),

      header3Orange('Addresses')
    ).cls('profile-page')
  );
}, 'Profile | True Colors');
