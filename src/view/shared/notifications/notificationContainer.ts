import './notificationContainer.css';

import { notificationContext } from '../../../contexts/notificationContext';
import { containerComponents } from '../containerComponents';
import { notificationEntry } from './notificationEntry';

const { containerModalColumn } = containerComponents;

export const notificationModal = () =>
  containerModalColumn()
    .cls('notification-container')
    .list(notificationContext.notifications, (prop) => notificationEntry(prop));
