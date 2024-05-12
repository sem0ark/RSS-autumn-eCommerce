import background from '../../../assets/background.jpg';
import './notFoundPage.css';

import { Page } from '../../framework/ui_components/page';
import { containerComponents } from '../shared/containerComponents';
import { htmlComponents } from '../shared/htmlComponents';
import { backgroundImageLayout } from '../shared/layouts/backgroundImageLayout';
import { inputComponents } from '../shared/inputComponents';
import { Router } from '../../framework/routing/router';

const { h1, h2, p } = htmlComponents;
const { containerFlexColumn } = containerComponents;
const { buttonPrimary } = inputComponents;

export const notFoundPage = new Page(() => {
  return backgroundImageLayout(background)(
    containerFlexColumn({
      gap: 90,
    })(
      containerFlexColumn({
        gap: 10,
      })(
        h1('404').cls('util-drop-shadow'),
        h2('Oops! Page not found').cls('util-drop-shadow')
      ),
      p(
        'The page you are looking for might have been removed or temporarily unavailable.'
      ),
      buttonPrimary('Back to Home')
        .cls('util-drop-shadow')
        .onClick(() => Router.navigateTo('/'))
    ).cls('not-found-page')
  );
}, 'Main | True Colors');
