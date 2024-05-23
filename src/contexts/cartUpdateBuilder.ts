import { Address } from '../utils/dataAndTyping/authDTO';

type ActionCode =
  | 'changeLineItemQuantity'
  | 'addLineItem'
  | 'removeLineItem'
  | 'addDiscountCode'
  | 'removeDiscountCode'
  | 'setBillingAddress'
  | 'setShippingAddress'
  | 'recalculate';

export type CartUpdateAction = Record<
  string,
  object | string | number | boolean | undefined
> & {
  action: ActionCode;
};

export class CartEditBuilder {
  public static changeLineItemQuantity(
    lineItemId: string,
    quantity: number
  ): CartUpdateAction {
    return {
      action: 'changeLineItemQuantity',
      lineItemId,
      quantity,
    };
  }

  public static addLineItem(
    productId: string,
    quantity: number
  ): CartUpdateAction {
    return {
      action: 'addLineItem',
      productId,
      quantity,
    };
  }

  public static removeLineItem(
    lineItemId: string,
    quantity?: number
  ): CartUpdateAction {
    return {
      action: 'removeLineItem',
      lineItemId,
      quantity,
    };
  }

  public static addDiscountCode(code: string): CartUpdateAction {
    return {
      action: 'addDiscountCode',
      code,
    };
  }

  public static removeDiscountCode(discountCodeId: string): CartUpdateAction {
    return {
      action: 'removeDiscountCode',
      discountCode: {
        typeId: 'discount-code',
        id: discountCodeId,
      },
    };
  }

  public static setBillingAddress(address: Address): CartUpdateAction {
    return {
      action: 'setBillingAddress',
      address,
    };
  }

  public static setShippingAddress(address: Address): CartUpdateAction {
    return {
      action: 'setShippingAddress',
      address,
    };
  }

  public static recalculate(updateProductData = false): CartUpdateAction {
    return {
      action: 'recalculate',
      updateProductData,
    };
  }
}
