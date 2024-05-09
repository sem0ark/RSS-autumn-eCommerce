import { notificationContext } from '../../../contexts/notificationContext';
import { containerComponents } from '../containerComponents';
import { notificationEntry } from './notificationEntry';

const { modalContainerColumn } = containerComponents;

export const notificationModal = () =>
  modalContainerColumn()
    .cls('notification-container')
    .list(notificationContext.notifications, (prop) => notificationEntry(prop));
