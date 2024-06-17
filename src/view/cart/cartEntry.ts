import './cartEntry.css';
import trashSVG from '../../../assets/trash-can-regular.svg';

import { factories } from '../../framework/factories';
import { CartEntryExternal } from '../../utils/dataAndTyping/cartDTO';
import { htmlComponents } from '../shared/htmlComponents';
import { inputComponents } from '../shared/inputComponents';
import { spinnerComponents } from '../shared/spinnerComponents';
import { cartContext } from '../../contexts/cartContext';

const { asynchronous } = factories;
const { div, img, span } = htmlComponents;
const { spinner } = spinnerComponents;
const { buttonIconText, buttonIcon } = inputComponents;

export const cartEntry = (item: CartEntryExternal) => {
  const cardImage = asynchronous(
    async () => {
      const url = item.product.imageUrl;
      if (!url) return div('Image not found').cls('image');

      return new Promise((res) => {
        const image = new Image();
        image.src = url;
        image.onload = () => res(img(url).cls('image'));
      });
    },
    () => spinner().cls('image')
  );

  const buttonClear = buttonIcon(trashSVG).cls('trash');
  buttonClear.onClick(() => {
    const promise = cartContext.removeProduct(item.product.id, item.quantity);
    buttonClear.asyncApplyAttr(promise, 'disabled');
  });

  const buttonAdd = buttonIconText('+');
  buttonAdd.onClick(() => {
    const promise = cartContext.addProduct(item.product.id, 1);
    buttonAdd.asyncApplyAttr(promise, 'disabled');
  });

  const buttonSubtract = buttonIconText('-');
  buttonSubtract
    .onClick(() => {
      const promise = cartContext.removeProduct(item.product.id, 1);
      buttonSubtract.asyncApplyAttr(promise, 'disabled');
    })
    .if(item.quantity === 1, () => buttonSubtract.attr('disabled'));

  return div(
    div(
      cardImage,
      span(item.product.name).cls('name'),
      item.product.discount
        ? div(
            span(item.product.price).cls('discount', 'strike-through'),
            item.product.discount
          ).cls('price', 'price-discount')
        : div(item.product.price).cls('price')
    ).cls('product-description'),

    div(
      buttonClear,
      div(buttonAdd, span(item.quantity), buttonSubtract).cls(
        'quantity-controls'
      ),
      span(item.totalPrice).cls('total-price')
    ).cls('product-controls')
  ).cls('cart-entry');
};
