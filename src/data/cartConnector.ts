import { CartUpdateAction } from '../contexts/cartUpdateBuilder';
import { error, info } from '../framework/utilities/logging';
import { Cart, LineItem } from '../utils/dataAndTyping/cartDTO';

import { authConnector } from './authConnector';
import { ServerConnector } from './serverConnector';

class CartConnector {
  /**
   * Call API to create a new empty cart.
   * @returns
   */
  public async requestCreateEmptyCart() {
    await authConnector.runGeneralAuthWorkflow();

    const result = await ServerConnector.post<Cart>(
      ServerConnector.getAPIURL('me/carts'),
      {
        ...authConnector.getAuthBearerHeaders(),
        ...ServerConnector.formJSONHeaders,
      },
      { currency: 'EUR' }
    );

    if (result.ok) return result;
    error('Failed to create a new cart', result.errors);

    return result;
  }

  /**
   * Call API to create a new cart with the contents of the provided cart and fetched card merged by max value.
   * @param initialCartData some cart data in case cart was already existing during anonymous session
   * @returns
   */
  public async requestCreateSynchronizedCart(initialCartData?: Cart) {
    const fetchedCartResult = await this.requestActiveCart();
    if (!fetchedCartResult.ok) {
      error('Failed to fetch cart data from the server.');
      return fetchedCartResult;
    }

    if (!initialCartData || !initialCartData.lineItems.length) {
      // in case the initialization body is empty
      // there is no need to make a new POST request to override the cart.
      return fetchedCartResult;
    }

    const fetchedCart = fetchedCartResult.body;

    const synchronizedCart: Cart = {
      ...fetchedCart,
      ...initialCartData, // override the ID values with current cart data
    };

    const productMap: Map<string, LineItem> = new Map(); // <productId, LineItem>
    const processItem = (item: LineItem) => {
      const existing = productMap.get(item.productId);
      if (existing)
        existing.quantity = Math.max(item.quantity, existing.quantity);
      else productMap.set(item.productId, item);
    };

    fetchedCart?.lineItems.forEach(processItem);
    initialCartData?.lineItems.forEach(processItem);

    synchronizedCart.lineItems = [...productMap.values()];

    return this.requestCreateOverridenCart(synchronizedCart);
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

      return this.requestCreateEmptyCart();
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

  /**
   * Call API to create a new cart with the specified contents.
   * @param initialCartData cart data to override the potetially existing one.
   * @returns
   */
  private async requestCreateOverridenCart(initialCartData: Cart) {
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
        // used because the POST sructure for discount differs from GET result
      }
    );

    if (result.ok) return result;
    error('Failed to create a new cart', result.errors);

    return result;
  }
}

export const cartConnector = new CartConnector();
