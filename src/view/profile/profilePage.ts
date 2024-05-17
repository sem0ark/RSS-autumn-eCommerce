import './profilePage.css';

import { Page } from '../../framework/ui_components/page';
import { sidebarLayout } from '../shared/layouts/sidebarLayout';
import { htmlComponents } from '../shared/htmlComponents';

const { aside, main } = htmlComponents;

export const profilePage = new Page(() => {
  return sidebarLayout('Create an account')(aside(), main());
}, 'Profile | True Colors');
