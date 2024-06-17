import './minimalLayout.css';

import { CC } from '../../../framework/ui_components/htmlComponent';
import { containerComponents } from '../containerComponents';
import { htmlComponents } from '../htmlComponents';
import { notificationModal } from '../notifications/notificationContainer';
import { footerComponent } from '../footer/footer';
import { navBar } from '../navBar/navBar';
import { disconnectedPopup } from '../popups/disconnectedPopup';

const { main, h1, div } = htmlComponents;
const { containerMaxWidth, containerOuter } = containerComponents;

export const minimalLayout =
  (heading: string) =>
  (...children: CC) =>
    containerOuter.cls('minimal-layout-outer-container')(
      navBar(),
      h1(heading).cls('minimal-layout-header'),
      main(containerMaxWidth.cls('minimal-layout')(...children)),

      div().cls('minimal-layout-push'),
      footerComponent(),
      notificationModal(),
      disconnectedPopup()
    );
