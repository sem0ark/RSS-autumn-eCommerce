import './profilePage.css';
import signOutSVG from '../../../assets/sign-out.svg';
import profileSVG from '../../../assets/icon-user-profile.svg';

import { Page } from '../../framework/ui_components/page';
import { sidebarLayout } from '../shared/layouts/sidebarLayout';
import { htmlComponents } from '../shared/htmlComponents';
import { textComponents } from '../shared/textComponents';
import { factories } from '../../framework/factories';
import { authContext } from '../../contexts/authContext';

const { functional } = factories;
const { aside, main, div } = htmlComponents;
const { header2Orange, header3Orange, textSubtext, textMenuEntry } =
  textComponents;

export const profilePage = new Page(() => {
  return sidebarLayout('My Info')(
    aside(
      functional(() => header2Orange(`Hello, ${authContext.userName.get()}`)),
      textSubtext('Welcome to your account'),
      div(
        textMenuEntry(profileSVG, 'My Info').cls('active'),
        textMenuEntry(signOutSVG, 'Hello')
      ).cls('menu')
    ).cls('profile-page'),
    main(
      header2Orange('My Info'),
      header3Orange('Contact Details'),
      header3Orange('Address')
    ).cls('profile-page')
  );
}, 'Profile | True Colors');
