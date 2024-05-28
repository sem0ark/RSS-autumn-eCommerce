import './productCard.css';

import cartSVG from '../../../assets/shopping-cart.svg';
import trashcanSVG from '../../../assets/trash-can-regular.svg';
import { Property } from '../../framework/reactive_properties/property';

import { htmlComponents } from '../shared/htmlComponents';
import { inputComponents } from '../shared/inputComponents';
import { factories } from '../../framework/factories';
import { spinnerComponents } from '../shared/spinnerComponents';
import { Router } from '../../framework/routing/router';
import { ProductDataExternal } from '../../utils/dataAndTyping/catalogDTO';
import { cartContext } from '../../contexts/cartContext';
import { notificationContext } from '../../contexts/notificationContext';
import { HTMLComponent } from '../../framework/ui_components/htmlComponent';

const { asynchronous, pfunc, functional } = factories;
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

  const alreadyInCart = pfunc(
    () =>
      !!cartContext.cart
        .get()
        ?.products.find((item) => item.product.id === product.id)
  );

  const attemptAddToCart = (c: HTMLComponent) => () => {
    if (alreadyInCart.get()) {
      notificationContext.addInformation('Product is already in the cart');
      return;
    }

    const prom = cartContext.addProduct(product.id, 1);
    c.asyncApplyAttr(
      prom.then((success) => {
        if (success) notificationContext.addSuccess('Added to the cart');
      }),
      'disabled'
    );
  };

  const attemptRemoveFromCart = (c: HTMLComponent) => () => {
    if (!alreadyInCart.get()) {
      notificationContext.addInformation('Product is not in the cart');
      return;
    }

    const prom = cartContext.removeProduct(product.id);
    c.asyncApplyAttr(
      prom.then((success) => {
        if (success) notificationContext.addSuccess('Removed from the cart');
      }),
      'disabled'
    );
  };

  const buyButton = functional(() => {
    let b: HTMLComponent;

    if (!alreadyInCart.get()) {
      b = buttonPrimary(iconSvg(cartSVG), 'Buy').cls('buy-button');
      b.onClick(attemptAddToCart(b), true, true);
    } else {
      b = buttonPrimary(iconSvg(trashcanSVG), 'Remove').cls(
        'buy-button',
        'removing'
      );
      b.onClick(attemptRemoveFromCart(b), true, true);
    }

    return b;
  });

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
