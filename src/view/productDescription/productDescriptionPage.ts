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

const { asynchronous } = factories;
const { main, div, span, h2, h3, p } = htmlComponents;
const { spinner } = spinnerComponents;
const { buttonPrimary } = inputComponents;

export const productDescriptionPage = new Page((productId: string) => {
  const renderSlider = async () => {
    const product = await productInfoContext.getProductData(productId);
    return sliderComponent(product.imageUrls || []).cls('slider');
  };

  const buyButton = buttonPrimary('Add To Cart');
  buyButton.onClick(() => {
    const prom = cartContext.addProduct(productId, 1);
    buyButton.asyncApplyAttr(
      prom.then((success) => {
        if (success) notificationContext.addSuccess('Added to the cart');
      }),
      'disabled'
    );
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
