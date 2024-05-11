import { authConnector, CustomerDataReceived } from '../data/authConnector';
import { factories } from '../framework/factories';
import { debug } from '../framework/utilities/logging';
import { notificationContext } from './notificationContext';

const { property, pfunc } = factories;

class AuthContext {
  public readonly userData = property<CustomerDataReceived | null>(
    null,
    'customer_data'
  );

  public readonly userIsLoggedIn = pfunc(
    () => this.userData.get() !== null,
    [],
    'userIsLoggedIn'
  );

  public readonly userName = pfunc(
    () => {
      const userData = this.userData.get();
      return userData ? this.formatName(userData) : 'Unauthorized';
    },
    [],
    'userName'
  );

  constructor() {
    debug('Initiating AuthContext');

    this.userIsLoggedIn.onChange((isLoggedIn) => {
      if (isLoggedIn)
        notificationContext.addSuccess(`Welcome, ${this.userName.get()}!`);
      else notificationContext.addInformation(`Goodbye!`);
    });
  }

  public async attemptLogin() {
    const result = await authConnector.runSignInWorkflow(
      'test@gmail.com',
      'secret'
    );

    if (result.ok) {
      this.userData.set(result.body.customer);
    } else
      result.errors.forEach(({ message }) =>
        notificationContext.addError(message)
      );

    return Promise.resolve();
  }

  private formatName(data: CustomerDataReceived) {
    if (data.firstName) return data.firstName;
    return data.email;
  }
}

export const authContext = new AuthContext();
