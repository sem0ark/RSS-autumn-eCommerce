import background from '../../../assets/background.jpg';
import './mainPage.css';

import { Page } from '../../framework/ui_components/page';
import { containerComponents } from '../shared/containerComponents';
import { htmlComponents } from '../shared/htmlComponents';
import { backgroundImageLayout } from '../shared/layouts/backgroundImageLayout';
import { inputComponents } from '../shared/inputComponents';
import { Router } from '../../framework/routing/router';

const { h1, h2, p } = htmlComponents;
const { containerFlexColumn } = containerComponents;
const { buttonPrimary } = inputComponents;

export const mainPage = new Page(() => {
  return backgroundImageLayout(background)(
    containerFlexColumn({
      gap: 90,
    })(
      containerFlexColumn({
        gap: 10,
      })(
        h1('True Colors').cls('util-drop-shadow'),
        h2('Flower salon').cls('util-drop-shadow')
      ),
      p(
        'Choose one of the ready-made bouquets or order a unique one that will meet all your wishes'
      ).cls('util-drop-shadow'),
      buttonPrimary('Go to catalog')
        .cls('util-drop-shadow')
        .onClick(() => Router.navigateTo('/catalog'))
    ).cls('main-page')
  );
}, 'Main | True Colors');
