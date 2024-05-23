import { LocalizedString, Price, TypedMoney } from './DTO';
import { ProductVariant } from './catalogDTO';

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
