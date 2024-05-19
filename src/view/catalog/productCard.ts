import './productCard.css';

import cartSVG from '../../../assets/shopping-cart.svg';
import { ProductDataExternal } from '../../contexts/catalogContext';
import { Property } from '../../framework/reactive_properties/property';

import { htmlComponents } from '../shared/htmlComponents';
import { inputComponents } from '../shared/inputComponents';
import { factories } from '../../framework/factories';
import { spinnerComponents } from '../shared/spinnerComponents';
import { Router } from '../../framework/routing/router';

const { asynchronous } = factories;
const { p, div, span, img, iconSvg } = htmlComponents;
const { buttonPrimary } = inputComponents;
const { spinner } = spinnerComponents;

export const productCard = (productProp: Property<ProductDataExternal>) => {
  const product = productProp.get();

  const cardImage = asynchronous(
    async () => {
      const url = product.imageUrl;
      if (!url) return div('Image not found').cls('image');

      return new Promise((res) => {
        const image = new Image();
        image.src = url;
        image.onload = () => res(img(url).cls('image'));
      });
    },
    () => spinner().cls('image')
  );

  return div(
    cardImage,

    p(product.name).cls('name'),

    product.discount
      ? div(
          product.discount,
          span(product.price).cls('discount', 'strike-through')
        ).cls('price', 'price-discount')
      : div(product.price).cls('price'),
    buttonPrimary(iconSvg(cartSVG), 'Buy')
      .cls('buy-button')
      .onClick(() => {}, true, true)
  )
    .cls('product-card')
    .onClick(
      () => {
        Router.navigateTo(`/products/${product.id}`);
      },
      true,
      true
    );
};
