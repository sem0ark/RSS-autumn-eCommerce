import background from '../../../assets/background.jpg';
import './mainPage.css';

import { Page } from '../../framework/ui_components/page';
import { containerComponents } from '../shared/containerComponents';
import { htmlComponents } from '../shared/htmlComponents';
import { backgroundImageLayout } from '../shared/layouts/backgroundImageLayout';
import { inputComponents } from '../shared/inputComponents';
import { Router } from '../../framework/routing/router';
import { showTime } from '../../framework/utilities/format';
import { factories } from '../../framework/factories';

const { pinteger, functional, text } = factories;
const { div, h1, h2, p } = htmlComponents;
const { containerFlexColumn } = containerComponents;
const { buttonPrimary } = inputComponents;

const counter = pinteger(6000, 'promo-time-counter');
setInterval(() => counter.set(Math.max(counter.get() - 1, 0)), 1000);

export const mainPage = new Page(() => {
  return backgroundImageLayout(background)(
    containerFlexColumn({
      gap: 90,
    })(
      div(
        h2('Use promo code!'),
        p('FLOWER').cls('promo'),
        p(
          'Time left: ',
          functional(() => text(showTime(counter.get())))
        ).cls('time')
      ).cls('promo-codes'),

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
