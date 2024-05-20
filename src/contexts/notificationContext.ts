import { emitter } from '../framework/event_handling/emitter';
import { ObservableList } from '../framework/reactive_properties/observable_list';

export interface Notification {
  type: 'INFO' | 'ERROR' | 'SUCCESS';
  message: string;
}

class NotificationContext {
  public readonly notifications: ObservableList<Notification>;

  constructor() {
    this.notifications = new ObservableList<Notification>('notifications');

    emitter.on('ERROR', (data) => {
      this.addError((data as { message: string }).message);
    });
    emitter.on('INFO', (data) => {
      this.addInformation((data as { message: string }).message);
    });
    emitter.on('SUCCESS', (data) => {
      this.addSuccess((data as { message: string }).message);
    });

    this.notifications.onPush(() => {
      // don't add a new notification if it is the same as already existing one
      // if (this.notifications.includes(prop.get())) {
      //   this.notifications.removeByProperty(prop);
      //   return;
      // }

      if (this.notifications.length > 5) this.removeLastNotification();
      else
        setTimeout(() => {
          this.removeLastNotification();
        }, 10000);
    });
  }

  private static instance?: NotificationContext;

  public static getInstance() {
    if (this.instance) return this.instance;
    this.instance = new NotificationContext();
    return this.instance;
  }

  /**
   * Add a new notification entry about some error.
   *
   * @param message some notification text
   */
  public addError(message: string) {
    this.notifications.push({ type: 'ERROR', message });
  }

  /**
   * Add a new notification entry about some general information.
   *
   * @param message some notification text
   */
  public addInformation(message: string) {
    this.notifications.push({ type: 'INFO', message });
  }

  /**
   * Add a new notification entry about some successful even happening.
   *
   * @param message some notification text
   */
  public addSuccess(message: string) {
    this.notifications.push({ type: 'SUCCESS', message });
  }

  private removeLastNotification() {
    if (this.notifications.length !== 0) this.notifications.remove(0);
  }

  /**
   * Clear all shown notifications.
   */
  public removeAllNotifications() {
    while (this.notifications.length !== 0) this.notifications.remove(0);
  }
}

export const notificationContext = NotificationContext.getInstance();
