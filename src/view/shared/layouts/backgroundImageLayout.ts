import { CC } from '../../../framework/ui_components/htmlComponent';
import { containerComponents } from '../containerComponents';
import { htmlComponents } from '../htmlComponents';
import { notificationModal } from '../notifications/notificationContainer';

const { main, div, img } = htmlComponents;
const { containerMaxWidth } = containerComponents;

export const backgroundImageLayout =
  (imageURL: string) =>
  (...children: CC) =>
    main.cls('login-page')(
      notificationModal(),
      div.cls('background-logo-img-container')(
        img(imageURL).cls('background-logo-img')
      ),
      containerMaxWidth.cls('login-page-container', '_container')(...children)
    );
