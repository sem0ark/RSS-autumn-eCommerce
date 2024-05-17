import {
  authConnector,
  CustomerDataReceived,
  FormData,
} from '../data/authConnector';
import { ProfileUpdateAction } from '../data/fieldEditBuilder';
import { factories } from '../framework/factories';
import { Storage } from '../framework/persistence/storage';
import { debug } from '../framework/utilities/logging';
import { notificationContext } from './notificationContext';

const { pfunc, property } = factories;

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
      const data = this.userData.get();
      return this.formatName(data);
    },
    [],
    'userName'
  );

  constructor() {
    debug('Initiating AuthContext');
    const storage = new Storage('AuthContext');
    storage.registerProperty(this.userData);

    if (!authConnector.isLoggedIn()) {
      debug('!authConnector.isLoggedIn()');
      this.attemptLogout();
    }

    if (this.userIsLoggedIn.get() || authConnector.isLoggedIn()) {
      debug('this.userIsLoggedIn.get() || authConnector.isLoggedIn()');
      authConnector.runReSignInWorkflow().catch(() => {
        notificationContext.addError('Session expired');
        this.attemptLogout();
        return Promise.resolve();
      });
    } else {
      this.attemptLogout();
    }
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
    await authConnector.requestLogout();
    return Promise.resolve(true);
  }

  public async attemptSignUp(formData: FormData) {
    const result = await authConnector.runSignUpWorkflow(formData);

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

  private formatName(data: CustomerDataReceived | null) {
    if (data === null) return 'Unauthorized';
    if (data.firstName) return data.firstName;
    return data.email;
  }

  public async attemptFieldEdit(formData: FormData) {
    const result = await authConnector.runSignUpWorkflow(formData);

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

  public async attemptProfileUpdate(...actions: ProfileUpdateAction[]) {
    const userVersion = this.userData.get()?.version;
    if (userVersion === undefined) {
      notificationContext.addError('You are not logged in!');
      return Promise.resolve(false);
    }

    const result = await authConnector.runProfileUpdateWorkflow(
      userVersion,
      actions
    );

    if (result.ok) {
      this.userData.set(result.body);
      notificationContext.addSuccess(`Successfully updated profile!`);
      return Promise.resolve(true);
    }

    notificationContext.addSuccess(`Profile update failed`);
    result.errors.forEach(({ message }) =>
      notificationContext.addError(message)
    );
    return Promise.resolve(false);
  }

  public async attemptProfilePasswordUpdate(
    oldPassword: string,
    newPassword: string
  ) {
    const userVersion = this.userData.get()?.version;
    if (userVersion === undefined || !this.userIsLoggedIn.get()) {
      notificationContext.addError('You are not logged in!');
      return Promise.resolve(false);
    }

    const result = await authConnector.runPasswordUpdateWorkflow(
      userVersion,
      oldPassword,
      newPassword
    );

    if (result.ok) {
      this.userData.set(result.body);
      notificationContext.addSuccess(`Successfully updated profile!`);
      return Promise.resolve(true);
    }

    notificationContext.addSuccess(`Profile update failed`);
    result.errors.forEach(({ message }) =>
      notificationContext.addError(message)
    );
    return Promise.resolve(false);
  }
}

export const authContext = new AuthContext();
