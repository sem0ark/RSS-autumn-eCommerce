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
import { notificationContext } from '../../contexts/notificationContext';

const { asynchronous, functional } = factories;
const { div, p, span, form, hidden } = htmlComponents;
const { buttonPrimary, buttonSecondary, inputText, validated } =
  inputComponents;
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

          const clearCart =
            buttonSecondary('Clear Cart').cls('clear-cart-button');
          clearCart.onClick(() =>
            clearCart.asyncApplyAttr(cartContext.clearCartData(), 'disable')
          );

          const [promoCodeInput, , promoCodeInputValue] = validated(
            inputText().attr('placeholder', 'FLOWER'),
            []
          );

          const codeSubmitButton = buttonSecondary('Apply Code');

          return div(
            cart.discount
              ? hidden()
              : form(promoCodeInput, codeSubmitButton)
                  .cls('promo-form')
                  .onSubmit(() => {
                    if (!promoCodeInputValue.get()) return;

                    const promise = cartContext
                      .applyPromoCode(promoCodeInputValue.get())
                      .then((s) => {
                        if (s)
                          notificationContext.addSuccess(
                            "You've got a discount!"
                          );
                        else notificationContext.addError('Incorrect code...');
                      });

                    codeSubmitButton.asyncApplyAttr(promise, 'disabled');
                  }),

            ...cart.products.map((product) => cartEntry(product)),
            p(
              'Total price is ',
              span(
                cart.discount
                  ? span(`${cart.discount}`).cls('price-discount', 'strike-through')
                  : hidden(),
                cart.price
              ).cls('price')
            ),

            div(clearCart, buttonPrimary('Order')).cls('control-buttons')
          ).cls('cart-page');
        });
      },
      () => spinner().cls('cart-page')
    )
  );
});
