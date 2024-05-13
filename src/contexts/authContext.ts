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

  public readonly emailValidators = [
    (text: string) =>
      /^[A-Za-z0-9\-\@\.]+$/.test(text)
        ? false
        : 'Email must only contain letters (a-z), digits & symbols (@-.).',

    // Email address must not contain leading or trailing whitespace.
    (text: string) =>
      text.startsWith(' ') || text.endsWith(' ')
        ? 'Email must not contain leading/trailing whitespace'
        : false,
    // Email address must be properly formatted (e.g., user@example.com).
    (text: string) =>
      /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(text)
        ? false
        : 'Email address must be properly formatted (e.g., user@example.com)',
  ];

  public readonly passwordValidators = [
    // Password must be at least 8 characters long.
    (text: string) =>
      text.length < 8 ? 'Password must be at least 8 characters long.' : false,
    // Password must contain at least one uppercase letter (A-Z).
    (text: string) =>
      /[A-Z]/g.test(text)
        ? false
        : 'Password must contain at least one uppercase letter (A-Z).',
    // Password must contain at least one lowercase letter (a-z).
    (text: string) =>
      !/[a-z]/g.test(text) &&
      'Password must contain at least one lowercase letter (a-z).',
    // Password must contain at least one digit (0-9).
    (text: string) =>
      !/[0-9]/g.test(text) && 'Password must contain at least one digit (0-9).',
    // (Optional) Password must contain at least one special character (e.g., !@#$%^&*).
    // TODO: add later for debugging and testing simplicity
    // Password must not contain leading or trailing whitespace.
    (text: string) =>
      (text.startsWith(' ') || text.endsWith(' ')) &&
      'Password must not contain leading or trailing whitespace.',

    (text: string) =>
      /^[A-Za-z0-9\!\@\#\$\%\^\&\*]+$/.test(text)
        ? false
        : 'Password must only contain letters (a-z), digits and symbols (!@#$%^&*).',
  ];

  constructor() {
    debug('Initiating AuthContext');
  }

  public async attemptLogin(email: string, password: string) {
    const result = await authConnector.runSignInWorkflow(email, password);

    if (result.ok) {
      this.userData.set(result.body.customer);
      notificationContext.addSuccess(`Welcome, ${this.userName.get()}!`);
      return Promise.resolve(true);
    }

    result.errors.forEach(({ message }) =>
      notificationContext.addError(message)
    );
    return Promise.resolve(false);
  }

  public async attemptLogout() {
    notificationContext.addInformation(`Goodbye!`);
    this.userData.set(null);
    return Promise.resolve(true);
  }

  private formatName(data: CustomerDataReceived) {
    if (data.firstName) return data.firstName;
    return data.email;
  }
}

export const authContext = new AuthContext();
