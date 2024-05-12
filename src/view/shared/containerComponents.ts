import './containerComponents.css';

import { CC } from '../../framework/ui_components/htmlComponent';
import { htmlComponents } from './htmlComponents';

const { div } = htmlComponents;

const container = div.cls('container');

const containerCenter = container.cls('container-components-center');

const containerCenterRoundEdges = containerCenter.cls(
  'container-components-round-edges'
);

const containerModalCenter = container.cls(
  'container-components-modal',
  'container-components-modal-center'
);

const containerModalColumn = container.cls(
  'container-components-modal',
  'container-components-modal-column'
);

const containerOuter = container.cls('container-components-outer');
const containerMaxWidth = container.cls('container-components-max-width');

const containerFlexRow =
  (options?: { gap?: number; padding?: number }) =>
  (...children: CC) =>
    container
      .cls('container-components-flex-row')(...children)
      .if(!!(options && options.gap), (c) =>
        c.style('gap', `${options?.gap}px`)
      )
      .if(!!(options && options.padding), (c) =>
        c.style('padding', `${options?.padding}px`)
      );

const containerFlexColumn =
  (options?: { gap?: number; padding?: number }) =>
  (...children: CC) =>
    container
      .cls('container-components-flex-row')(...children)
      .if(!!(options && options.gap), (c) =>
        c.style('gap', `${options?.gap}px`)
      )
      .if(!!(options && options.padding), (c) =>
        c.style('padding', `${options?.padding}px`)
      );

export const containerComponents = {
  containerCenter,
  containerCenterRoundEdges,
  containerModalCenter,
  containerModalColumn,
  containerOuter,
  containerMaxWidth,
  containerFlexRow,
  containerFlexColumn,
};
