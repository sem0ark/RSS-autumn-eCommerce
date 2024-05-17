import './sidebarLayout.css';

import { containerComponents } from '../containerComponents';
import { htmlComponents } from '../htmlComponents';
import { notificationModal } from '../notifications/notificationContainer';
import { footerComponent } from '../footer/footer';
import { navBar } from '../navBar/navBar';
import { HTMLComponent } from '../../../framework/ui_components/htmlComponent';

const { h1 } = htmlComponents;
const { containerMaxWidth, containerOuter } = containerComponents;

export const sidebarLayout =
  (heading: string) => (sideBlock: HTMLComponent, mainBlock: HTMLComponent) =>
    containerOuter.cls('sidebar-layout-outer-container')(
      navBar(),
      h1(heading).cls('sidebar-layout-header'),
      containerMaxWidth.cls('sidebar-layout')(
        sideBlock.cls('sidebar-layout-aside'),
        mainBlock.cls('sidebar-layout-main')
      ),
      footerComponent(),
      notificationModal()
    );
