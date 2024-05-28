import './productDescription.css';

import { productInfoContext } from '../../contexts/productInfoContext';
import { factories } from '../../framework/factories';
import { Page } from '../../framework/ui_components/page';
import { htmlComponents } from '../shared/htmlComponents';
import { inputComponents } from '../shared/inputComponents';
import { blankLayout } from '../shared/layouts/blankLayout';
import { spinnerComponents } from '../shared/spinnerComponents';
import { sliderComponent } from './imageSlider';
import { cartContext } from '../../contexts/cartContext';
import { notificationContext } from '../../contexts/notificationContext';
import { HTMLComponent } from '../../framework/ui_components/htmlComponent';

const { asynchronous, pfunc, functional } = factories;
const { main, div, span, h2, h3, p } = htmlComponents;
const { spinner } = spinnerComponents;
const { buttonPrimary } = inputComponents;

export const productDescriptionPage = new Page((productId: string) => {
  // update the cart data in case it was not loaded
  cartContext.fetchCartData();

  const renderSlider = async () => {
    const product = await productInfoContext.getProductData(productId);
    return sliderComponent(product.imageUrls || []).cls('slider');
  };

  const alreadyInCart = pfunc(
    () =>
      !!cartContext.cart
        .get()
        ?.products.find((item) => item.product.id === productId)
  );

  const attemptAddToCart = (c: HTMLComponent) => () => {
    if (alreadyInCart.get()) {
      notificationContext.addInformation('Product is already in the cart');
      return;
    }

    const prom = cartContext.addProduct(productId, 1);
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

    const prom = cartContext.removeProduct(productId);
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
      b = buttonPrimary('Add To Cart');
      b.onClick(attemptAddToCart(b), true, true);
    } else {
      b = buttonPrimary('Remove').cls('removing');
      b.onClick(attemptRemoveFromCart(b), true, true);
    }

    return b;
  });

  const renderDescription = async () => {
    const product = await productInfoContext.getProductData(productId);
    return div(
      h2(product.name),

      product.discount
        ? div(
            product.discount,
            span(product.price).cls('discount', 'strike-through')
          ).cls('price', 'price-discount')
        : div(product.price).cls('price'),

      buyButton,

      div(h3('Description'), p(product.description)).cls('description')
    ).cls('information');
  };

  return blankLayout(
    main(
      asynchronous(renderSlider, () => spinner().cls('slider')),
      asynchronous(renderDescription, () => spinner().cls('information'))
    )
  ).cls('product-description-page');
});
