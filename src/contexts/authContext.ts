import { authConnector, CustomerDataReceived } from '../data/authConnector';
import { factories } from '../framework/factories';
import { Property } from '../framework/reactive_properties/property';
import { debug } from '../framework/utilities/logging';
import { notificationContext } from './notificationContext';

const { property } = factories;

class AuthContext {
  public readonly userData: Property<CustomerDataReceived | null>;

  constructor() {
    debug('Initiating AuthContext');

    this.userData = property<CustomerDataReceived | null>(
      null,
      'customer_data'
    );
  }

  public async attemptLogin() {
    const result = await authConnector.runSignInWorkflow(
      'test@gmail.com',
      'secret'
    );

    if (result.ok) this.userData.set(result.body);
    else
      result.errors.forEach(({ message }) =>
        notificationContext.addError(message)
      );

    return Promise.resolve();
  }
}

export const authContext = new AuthContext();
