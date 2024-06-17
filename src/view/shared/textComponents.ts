import './textComponents.css';

import { CC } from '../../framework/ui_components/htmlComponent';
import { htmlComponents } from './htmlComponents';

const { h2, h3, p, span, div, iconSvg } = htmlComponents;

const header2Orange = (...c: CC) =>
  h2(span(), ...c).cls('text-components-header');

const header3Orange = (...c: CC) =>
  h3(span(), ...c).cls('text-components-header');

const textSubtext = p.cls('text-components-subtext');

const textMenuEntry = (iconPath: string, ...c: CC) =>
  div.cls('text-components-menu-entry')(iconSvg(iconPath), ...c);

export const textComponents = {
  header2Orange,
  header3Orange,
  textSubtext,
  textMenuEntry,
};
