import { CC } from '../../../framework/ui_components/htmlComponent';
import { htmlComponents } from '../htmlComponents';
import userSVG from '../../../../assets/icon-user-profile.svg';

const { button, iconSvg } = htmlComponents;

export const userProfileBtn = (...children: CC) =>
  button(...children)
    .cls('user-profile-btn', 'icon-btn')
    .add(iconSvg(userSVG));
