import cartSVG from '../../../../assets/shopping-cart.svg';

import { CC } from '../../../framework/ui_components/htmlComponent';
import { htmlComponents } from '../htmlComponents';

const { button, iconSvg } = htmlComponents;

export const shoppingCartBtn = (...children: CC) =>
  button(...children)
    .cls('shopping-cart-btn', 'icon-btn')
    .add(iconSvg(cartSVG));
