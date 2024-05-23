import { CartUpdateAction } from '../contexts/cartUpdateBuilder';
import { error, info } from '../framework/utilities/logging';
import { Cart } from '../utils/dataAndTyping/cartDTO';

import { authConnector } from './authConnector';
import { ServerConnector } from './serverConnector';

class CartConnector {
  private async requestCreateNewCart() {
    await authConnector.runGeneralAuthWorkflow();

    const result = await ServerConnector.post<Cart>(
      ServerConnector.getAPIURL('me/carts'),
      {
        ...authConnector.getAuthBearerHeaders(),
        ...ServerConnector.formJSONHeaders,
      },
      {
        currency: 'EUR',
      }
    );

    if (result.ok) return result;
    error('Failed to create a new cart', result.errors);

    return result;
  }

  private async requestActiveCart() {
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

  private async requestUpdateCart(cart: Cart, actions: CartUpdateAction) {
    await authConnector.runGeneralAuthWorkflow();

    const result = await ServerConnector.post<Cart>(
      ServerConnector.getAPIURL(`me/carts/${cart.id}`),
      {
        ...authConnector.getAuthBearerHeaders(),
        ...ServerConnector.formJSONHeaders,
      },
      {
        version: cart.version,
        actions,
      }
    );

    if (result.ok) return result;
    else {
      error('Failed to update cart data', result.errors);
    }

    return result;
  }

  private async requestDeleteCart(cart: Cart) {
    await authConnector.runGeneralAuthWorkflow();

    const result = await ServerConnector.delete<Cart>(
      ServerConnector.getAPIURL(`me/carts/${cart.id}`),
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