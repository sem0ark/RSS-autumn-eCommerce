import { CartUpdateAction } from '../contexts/cartUpdateBuilder';
import { error, info } from '../framework/utilities/logging';
import { Cart } from '../utils/dataAndTyping/cartDTO';

import { authConnector } from './authConnector';
import { ServerConnector } from './serverConnector';

class CartConnector {
  /**
   * Call API to create a new cart.
   * @param initialCartData some cart data in case cart was already existing during anonymous session
   * @returns
   */
  public async requestCreateNewCart(initialCartData?: Cart) {
    await authConnector.runGeneralAuthWorkflow();

    const result = await ServerConnector.post<Cart>(
      ServerConnector.getAPIURL('me/carts'),
      {
        ...authConnector.getAuthBearerHeaders(),
        ...ServerConnector.formJSONHeaders,
      },
      {
        currency: 'EUR',
        ...initialCartData,
        discountCodes: undefined,
      }
    );

    if (result.ok) return result;
    error('Failed to create a new cart', result.errors);

    return result;
  }

  public async requestActiveCart() {
    await authConnector.runGeneralAuthWorkflow();

    const result = await ServerConnector.get<Cart>(
      ServerConnector.getAPIURL('me/active-cart'),
      { ...authConnector.getAuthBearerHeaders() }
    );

    if (result.ok) return result;

    if (ServerConnector.findErrorByCode(result.errors, 'ResourceNotFound')) {
      info(
        'Failed to request an active cart, active cart not found, creating a new one...'
      );

      return this.requestCreateNewCart();
    } else {
      error('Failed to request cart data', result.errors);
    }

    return result;
  }

  public async requestUpdateCart(
    cartData: { id: string; version: number },
    ...actions: CartUpdateAction[]
  ) {
    await authConnector.runGeneralAuthWorkflow();

    const result = await ServerConnector.post<Cart>(
      ServerConnector.getAPIURL(`me/carts/${cartData.id}`),
      {
        ...authConnector.getAuthBearerHeaders(),
        ...ServerConnector.formJSONHeaders,
      },
      {
        version: cartData.version,
        actions,
      }
    );

    if (result.ok) return result;
    else error('Failed to update cart data', result.errors);

    return result;
  }

  public async requestDeleteCart(cartData: { id: string; version: number }) {
    await authConnector.runGeneralAuthWorkflow();

    const result = await ServerConnector.delete<Cart>(
      ServerConnector.getAPIURL(`me/carts/${cartData.id}`),
      { ...authConnector.getAuthBearerHeaders() }
    );

    if (result.ok) return result;
    else {
      error('Failed to update cart data', result.errors);
    }

    return result;
  }
}

export const cartConnector = new CartConnector();
