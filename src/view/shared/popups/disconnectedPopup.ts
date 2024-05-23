import './disconnectedPopup.css';

import { factories } from '../../../framework/factories';
import { containerComponents } from '../containerComponents';
import { htmlComponents } from '../htmlComponents';
import { inputComponents } from '../inputComponents';

const { div, p } = htmlComponents;
const { buttonPrimary } = inputComponents;
const { containerModalCenter } = containerComponents;

export const disconnectedPopup = () => {
  const active = factories.pboolean(
    window.navigator.onLine || window.navigator?.onLine === undefined,
    'currentlyOnline'
  );

  window.addEventListener('online', () => active.set(window.navigator.onLine));
  window.addEventListener('offline', () => active.set(window.navigator.onLine));

  return containerModalCenter(
    div(
      p('Hey! It looks like you are offline!'),
      buttonPrimary('OK').onClick(() => active.disable())
    ).cls('disconnected-popup-modal')
  )
    .cls('disconnected-popup')
    .propClass(active, (o) => (o ? [] : ['active']));
};
