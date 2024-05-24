import './productCard.css';

import cartSVG from '../../../assets/shopping-cart.svg';
import { Property } from '../../framework/reactive_properties/property';

import { htmlComponents } from '../shared/htmlComponents';
import { inputComponents } from '../shared/inputComponents';
import { factories } from '../../framework/factories';
import { spinnerComponents } from '../shared/spinnerComponents';
import { Router } from '../../framework/routing/router';
import { ProductDataExternal } from '../../utils/dataAndTyping/catalogDTO';
import { cartContext } from '../../contexts/cartContext';
import { notificationContext } from '../../contexts/notificationContext';

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

  const buyButton = buttonPrimary(iconSvg(cartSVG), 'Buy').cls('buy-button');
  buyButton.onClick(
    () => {
      const prom = cartContext.addProduct(product.id, 1);
      buyButton.asyncApplyAttr(
        prom.then((success) => {
          if (success) notificationContext.addSuccess('Added to the cart');
        }),
        'disabled'
      );
    },
    true,
    true
  );

  return div(
    cardImage,

    p(product.name).cls('name'),
    p(product.shortDescription).cls('description'),
    product.discount
      ? div(
          product.discount,
          span(product.price).cls('discount', 'strike-through')
        ).cls('price', 'price-discount')
      : div(product.price).cls('price'),

    buyButton
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
