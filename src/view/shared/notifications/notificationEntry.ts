import './notificationEntry.css';

import {
  Notification,
  notificationContext,
} from '../../../contexts/notificationContext';
import { factories } from '../../../framework/factories';
import { Property } from '../../../framework/reactive_properties/property';
import { htmlComponents } from '../htmlComponents';

const { div } = htmlComponents;

export const notificationEntry = (notificationProp: Property<Notification>) =>
  factories.functional(() =>
    div(notificationProp.get().message)
      .cls('notification-entry', 'block-selection')
      .propClass(notificationProp, (v) => {
        switch (v.type) {
          case 'ERROR':
            return ['error'];
          case 'SUCCESS':
            return ['success'];
          default:
            return [];
        }
      })
      .onClick(() =>
        notificationContext.notifications.removeByProperty(notificationProp)
      )
  );
