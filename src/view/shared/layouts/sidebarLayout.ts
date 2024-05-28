import './sidebarLayout.css';

import { containerComponents } from '../containerComponents';
import { htmlComponents } from '../htmlComponents';
import { notificationModal } from '../notifications/notificationContainer';
import { footerComponent } from '../footer/footer';
import { navBar } from '../navBar/navBar';
import { HTMLComponent } from '../../../framework/ui_components/htmlComponent';
import { factories } from '../../../framework/factories';
import { inputComponents } from '../inputComponents';
import { disconnectedPopup } from '../popups/disconnectedPopup';

const { h1 } = htmlComponents;
const { pboolean, functional, text } = factories;
const { containerMaxWidth, containerOuter } = containerComponents;
const { buttonSecondary } = inputComponents;

export const sidebarLayout =
  (heading: string) => (sideBlock: HTMLComponent, mainBlock: HTMLComponent) => {
    const active = pboolean(false, 'sidebar-active');

    return containerOuter.cls('sidebar-layout-outer-container')(
      navBar(),
      h1(heading).cls('sidebar-layout-header'),
      containerMaxWidth.cls('sidebar-layout')(
        sideBlock
          .addBefore(
            buttonSecondary(
              functional(() => (active.get() ? text('←') : text('→')))
            )
              .cls('sidebar-layout-toggle')
              .propClass(active, (a) => (a ? ['active'] : []))
              .onClick(() => active.toggle())
          )
          .cls('sidebar-layout-aside', 'hide-scrollbar')
          .propClass(active, (v) => (v ? ['active'] : [])),
        mainBlock.cls('sidebar-layout-main')
      ),
      footerComponent(),
      notificationModal(),
      disconnectedPopup()
    );
  };
