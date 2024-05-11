import './containerComponents.css';

import { htmlComponents } from './htmlComponents';
const { div } = htmlComponents;

const container = div.cls('container-components', 'container');

const containerCenter = container.cls('container-center');

const containerCenterRoundEdges = containerCenter.cls('container-round-edges');

const containerOuter = container.cls('container-outer');

const containerModalCenter = container.cls(
  'container-modal',
  'modal-container-center'
);

const containerModalColumn = container.cls(
  'container-modal',
  'container-modal-column'
);

const wrapper = div.cls('wrapper');

export const containerComponents = {
  containerCenter,
  containerCenterRoundEdges,
  containerOuter,
  containerModalCenter,
  containerModalColumn,
  wrapper,
};
