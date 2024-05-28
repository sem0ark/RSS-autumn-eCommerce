import { LocalizedString, Price, TypedMoney, localizedToString } from './DTO';
import {
  ProductDataExternal,
  ProductVariant,
  currencyString,
} from './catalogDTO';

export interface Cart {
  id: string;
  version: number;

  customerId?: string;
  anonymousId?: string;

  lineItems: LineItem[];

  totalPrice: TypedMoney;
}

export interface LineItem {
  id: string;
  productId: string;

  name: LocalizedString;
  variant: ProductVariant;

  quantity: number;

  price: Price;
  totalPrice: TypedMoney;
}

export interface CartEntryExternal {
  id: string;
  product: ProductDataExternal;
  quantity: number;
  totalPrice: string;
}

export interface CartDataExternal {
  id: string;
  version: number;

  products: CartEntryExternal[];

  price: string;
  discount?: string;
}

export function getCartEntryData(item: LineItem): CartEntryExternal {
  return {
    product: {
      id: item.productId,
      name: localizedToString(item.name),
      shortDescription: '',

      price: currencyString(item.price.value),
      discount: item.price.discounted
        ? currencyString(item.price.discounted.value)
        : undefined,

      imageUrl: item.variant.images[0].url,
    },

    id: item.id,
    quantity: item.quantity,
    totalPrice: currencyString(item.totalPrice),
  };
}

export function getCartData(cart: Cart): CartDataExternal {
  return {
    id: cart.id,
    version: cart.version,

    products: cart.lineItems.map(getCartEntryData),
    price: currencyString(cart.totalPrice),
  };
}
