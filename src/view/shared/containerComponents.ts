import { htmlComponents } from './htmlComponents';

const { div } = htmlComponents;

export const containerComponents = {
  modalContainerCenter: div.cls(
    'containerComponents',
    'container',
    'modal-container',
    'modal-container-center'
  ),
  modalContainerColumn: div.cls(
    'containerComponents',
    'container',
    'modal-container',
    'modal-container-column'
  ),
};
