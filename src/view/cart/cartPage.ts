import './cartPage.css';

import { cartContext } from '../../contexts/cartContext';
import { factories } from '../../framework/factories';
import { Router } from '../../framework/routing/router';
import { Page } from '../../framework/ui_components/page';
import { htmlComponents } from '../shared/htmlComponents';
import { inputComponents } from '../shared/inputComponents';
import { minimalLayout } from '../shared/layouts/minimalLayout';
import { cartEntry } from './cartEntry';
import { spinnerComponents } from '../shared/spinnerComponents';

const { asynchronous, functional } = factories;
const { div, p, span } = htmlComponents;
const { buttonPrimary } = inputComponents;
const { spinner } = spinnerComponents;

export const cartPage = new Page(() => {
  return minimalLayout('Your cart')(
    asynchronous(
      async () => {
        const success = await cartContext.fetchCartData();
        if (!success) throw new Error('Failed to load a cart!');

        return functional(() => {
          const cart = cartContext.cart.get();

          if (!cart || !cart?.products?.length) {
            return div(
              p('There is still nothing in your cart, you may buy something!'),
              buttonPrimary('Go to Catalog').onClick(() =>
                Router.navigateTo('/catalog')
              )
            ).cls('cart-page', 'cart-empty');
          }

          return div(
            ...cart.products.map((product) => cartEntry(product)),
            p('Total price is ', span(cart.price).cls('price'))
          ).cls('cart-page');
        });
      },
      () => spinner().cls('cart-page')
    )
  );
});
