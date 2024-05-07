import { htmlComponents } from '../htmlComponents';
import { PropertyValueType } from '../../../framework/reactive_properties/types';
import { Component } from '../../../framework/ui_components/component';
import cartSVG from '../../../../assets/shopping-cart.svg';

const { button, iconSvg } = htmlComponents;

type CC = (Component | PropertyValueType)[];

export const shoppingCartBtn = (...children: CC) =>
  button(...children)
    .cls('shopping-cart-btn', 'icon-btn')
    .add(iconSvg(cartSVG));
