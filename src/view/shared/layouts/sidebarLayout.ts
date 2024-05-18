import './sidebarLayout.css';

import { containerComponents } from '../containerComponents';
import { htmlComponents } from '../htmlComponents';
import { notificationModal } from '../notifications/notificationContainer';
import { footerComponent } from '../footer/footer';
import { navBar } from '../navBar/navBar';
import { HTMLComponent } from '../../../framework/ui_components/htmlComponent';
import { factories } from '../../../framework/factories';

const { h1 } = htmlComponents;
const { pboolean } = factories;
const { containerMaxWidth, containerOuter } = containerComponents;

export const sidebarLayout =
  (heading: string) => (sideBlock: HTMLComponent, mainBlock: HTMLComponent) => {
    const active = pboolean(false, 'sidebar-active');

    return containerOuter.cls('sidebar-layout-outer-container')(
      navBar(),
      h1(heading).cls('sidebar-layout-header'),
      containerMaxWidth.cls('sidebar-layout')(
        sideBlock
          .cls('sidebar-layout-aside')
          .onClick(() => active.toggle(), true, true)
          .propClass(active, (v) => (v ? ['active'] : [])),
        mainBlock.cls('sidebar-layout-main')
      ),
      footerComponent(),
      notificationModal()
    );
  };
