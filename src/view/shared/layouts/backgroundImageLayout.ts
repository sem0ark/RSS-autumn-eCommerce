import './backgroundImageLayout.css';

import { CC } from '../../../framework/ui_components/htmlComponent';
import { containerComponents } from '../containerComponents';
import { htmlComponents } from '../htmlComponents';
import { notificationModal } from '../notifications/notificationContainer';
import { footerComponent } from '../footer/footer';
import { navBar } from '../navBar/navBar';

const { main, div, img } = htmlComponents;
const { containerMaxWidth, containerOuter } = containerComponents;

export const backgroundImageLayout =
  (imageURL: string) =>
  (...children: CC) =>
    containerOuter(
      notificationModal(),
      navBar(),
      main.cls('background-image-layout')(
        div.cls('background-logo-img-container')(
          img(imageURL).cls('background-logo-img')
        ),
        containerMaxWidth.cls('login-page-container')(...children)
      ),
      footerComponent()
    );
