import './blankLayout.css';

import { CC } from '../../../framework/ui_components/htmlComponent';
import { containerComponents } from '../containerComponents';
import { footerComponent } from '../footer/footer';
import { navBar } from '../navBar/navBar';
import { notificationModal } from '../notifications/notificationContainer';
import { htmlComponents } from '../htmlComponents';

const { div } = htmlComponents;
const { containerOuter, containerMaxWidth } = containerComponents;

export const blankLayout = (...contents: CC) => {
  return containerOuter.cls('blank-layout-outer-container')(
    navBar(),

    containerMaxWidth.cls('blank-layout')(...contents),

    div().cls('blank-layout-push'),
    footerComponent(),
    notificationModal()
  );
};
