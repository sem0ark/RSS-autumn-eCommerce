import cartSVG from '../../../assets/shopping-cart.svg';
import { ProductData } from '../../contexts/catalogContext';

import { htmlComponents } from '../shared/htmlComponents';
import { inputComponents } from '../shared/inputComponents';

const { div, span, img, iconSvg } = htmlComponents;
const { buttonPrimary } = inputComponents;

export const productCard = (product: ProductData) => {
  return div(
    product.imageUrl
      ? img(product.imageUrl).cls('image')
      : div('Image not found').cls('image'),

    span(product.name).cls('name'),
    span(product.shortDescription).cls('description'),

    product.discount
      ? div(product.discount, span(product.price).cls('discount')).cls('price')
      : div(product.price).cls('price'),

    buttonPrimary(iconSvg(cartSVG), 'Buy').cls('buy-button')
  ).cls('product-card');
};
