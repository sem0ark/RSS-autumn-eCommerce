import { notificationContext } from './contexts/notificationContext';
import { DefaultRoute, Router } from './framework/routing/router';
import { Page } from './framework/ui_components/page';
import { containerComponents } from './view/shared/containerComponents';
import { htmlComponents } from './view/shared/htmlComponents';
import { notificationModal } from './view/shared/notifications/notificationContainer';
// import { loadApp } from './loaders/appLoader';

let i = 0;

export const loadApp = () => {
  Router.getRouter(
    new DefaultRoute(
      new Page(() => {
        return containerComponents.outerContainer(
          notificationModal(),
          htmlComponents
            .button('click')
            .onClick(() => notificationContext.addInformation(`Hellow ${i++}`))
        );
      })
    )
  );

  Router.getRouter().initNavigation();
};

loadApp();
