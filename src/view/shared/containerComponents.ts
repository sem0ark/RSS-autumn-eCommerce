import './containerComponents.css';

import { htmlComponents } from './htmlComponents';

const { div } = htmlComponents;

export const containerComponents = {
  outerContainer: div.cls(
    'container-components',
    'container',
    'container-outer'
  ),
  modalContainerCenter: div.cls(
    'container-components',
    'container',
    'container-modal',
    'modal-container-center'
  ),
  modalContainerColumn: div.cls(
    'container-components',
    'container',
    'container-modal',
    'container-modal-column'
  ),
};
