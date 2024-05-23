import { cartConnector } from '../data/cartConnector';
import { factories } from '../framework/factories';
import { error } from '../framework/utilities/logging';
import { CartDataExternal, getCartData } from '../utils/dataAndTyping/cartDTO';
import { CartEditBuilder } from './cartUpdateBuilder';
import { notificationContext } from './notificationContext';

const cartFindItem = (cart: CartDataExternal, productId: string) =>
  cart.products.filter((p) => p.product.id === productId)[0];

class CartContext {
  constructor(
    public readonly cartEntriesCounter = factories.pfunc<[], number>(
      () => {
        const cart = this.cart.get();
        if (!cart) return 0;
        return Math.min(
          cart.products.reduce((acc, p) => acc + p.quantity, 0),
          9
        );
      },
      [],
      'cartEntriesCounter'
    ),

    public readonly cart = factories.property<CartDataExternal | null>(
      null,
      'cart-data'
    )
  ) {}

  public async clearData() {
    this.cart.set(null);
  }

  public async fetchCartData() {
    const result = await cartConnector.requestActiveCart();

    if (result.ok) {
      this.cart.set(getCartData(result.body));
      return Promise.resolve(true);
    }

    result.errors.forEach(({ message }) =>
      notificationContext.addError(message)
    );
    return Promise.resolve(false);
  }

  public async addProduct(productId: string, quantity: number = 1) {
    if (!this.cart.get()) {
      const success = await this.fetchCartData();
      if (!success) error("Failed to receive a cart, can't add a product.");
    }

    const cart = this.cart.get() as CartDataExternal;

    const item = cartFindItem(cart, productId);

    let result;
    if (item) {
      // we are updating quantity to the existing product

      result = await cartConnector.requestUpdateCart(
        cart,
        CartEditBuilder.changeLineItemQuantity(
          item.id,
          quantity + item.quantity
        )
      );
    } else {
      // we are adding a new product

      result = await cartConnector.requestUpdateCart(
        cart,
        CartEditBuilder.addLineItem(productId, quantity)
      );
    }

    if (result.ok) {
      this.cart.set(getCartData(result.body));
      return Promise.resolve(true);
    }

    result.errors.forEach(({ message }) =>
      notificationContext.addError(message)
    );
    return Promise.resolve(false);
  }
}

export const cartContext = new CartContext();
