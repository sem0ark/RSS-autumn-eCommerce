import { notificationContext } from '../../../contexts/notificationContext';
import { htmlComponents } from '../htmlComponents';
import { notificationEntry } from './notificationEntry';

const { div } = htmlComponents;

export const notificationContainer = () =>
  div()
    .cls('notification-container')
    .list(notificationContext.notifications, (prop) => notificationEntry(prop));
