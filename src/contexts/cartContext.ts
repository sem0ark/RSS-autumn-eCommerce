import { cartConnector } from '../data/cartConnector';
import { factories } from '../framework/factories';
import { error, warn } from '../framework/utilities/logging';
import {
  Cart,
  CartDataExternal,
  getCartData,
} from '../utils/dataAndTyping/cartDTO';
import { authContext } from './authContext';
import { CartEditBuilder } from './cartUpdateBuilder';
import { notificationContext } from './notificationContext';

const cartFindItem = (cart: CartDataExternal, productId: string) =>
  cart.products.filter((p) => p.product.id === productId)[0];

class CartContext {
  private cartData?: Cart;

  public readonly cart = factories.property<CartDataExternal | null>(
    null,
    'cart-data'
  );

  public readonly cartEntriesCounter = factories.pfunc(
    () => {
      const cart = this.cart.get();
      if (!cart || cart === null) return 0;
      return Math.min(
        cart.products.reduce((acc, p) => acc + p.quantity, 0),
        9
      );
    },
    [],
    'cartEntriesCounter'
  );

  constructor() {
    authContext.userData.onChange((data) => {
      const userIsLoggingOut = data === null;
      if (userIsLoggingOut) {
        this.clearData();
        // wait a bit to allow clear the authentication data beforehand
        setTimeout(() => this.initCartData(), 500);
        return;
      }

      // overwrite the cart only if it already has something
      if (this.cartData?.lineItems.length)
        setTimeout(() => this.initCartData(!userIsLoggingOut), 500);
      else setTimeout(() => this.fetchCartData(), 500);
    });
  }

  private async clearData() {
    delete this.cartData;
    this.cart.set(null);
  }

  private async initCartData(synchronizeCarts = false) {
    const result = await cartConnector.requestCreateNewCart(
      synchronizeCarts ? this.cartData : undefined
    );

    if (result.ok) {
      this.cartData = result.body;
      this.cart.set(getCartData(result.body));
      return Promise.resolve(true);
    }

    result.errors.forEach(({ message }) =>
      notificationContext.addError(message)
    );
    return Promise.resolve(false);
  }

  public async fetchCartData() {
    const result = await cartConnector.requestActiveCart();

    if (result.ok) {
      this.cartData = result.body;
      this.cart.set(getCartData(result.body));
      return Promise.resolve(true);
    }

    result.errors.forEach(({ message }) =>
      notificationContext.addError(message)
    );
    return Promise.resolve(false);
  }

  public async clearCartData() {
    this.clearData();
    await this.initCartData();
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

  public async removeProduct(productId: string, quantity: number = 1) {
    if (!this.cart.get()) {
      const success = await this.fetchCartData();
      if (!success) error("Failed to receive a cart, can't remove a product.");
    }

    const cart = this.cart.get() as CartDataExternal;
    const item = cartFindItem(cart, productId);

    if (!item) {
      warn(
        'Something is potentially wrong, trying to remove a non-existent item!'
      );
      return Promise.resolve(false);
    }

    // we are updating quantity to the existing product

    const result = await cartConnector.requestUpdateCart(
      cart,
      CartEditBuilder.removeLineItem(
        item.id,
        // remove an item completely if the quantity of items to remove >= item.quantity
        quantity < item.quantity ? quantity : undefined
      )
    );

    if (result.ok) {
      this.cart.set(getCartData(result.body));
      return Promise.resolve(true);
    }

    result.errors.forEach(({ message }) =>
      notificationContext.addError(message)
    );
    return Promise.resolve(false);
  }

  public async applyPromoCode(code: string) {
    if (!this.cart.get()) {
      const success = await this.fetchCartData();
      if (!success) error("Failed to receive a cart, can't remove a product.");
    }

    const cart = this.cart.get() as CartDataExternal;

    // we are updating quantity to the existing product

    const result = await cartConnector.requestUpdateCart(
      cart,
      CartEditBuilder.addDiscountCode(code)
    );

    if (result.ok) {
      this.cart.set(getCartData(result.body));
      return Promise.resolve(true);
    }

    return Promise.resolve(false);
  }
}

export const cartContext = new CartContext();
