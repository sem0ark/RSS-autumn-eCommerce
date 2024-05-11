import { CC } from '../../../framework/ui_components/htmlComponent';
import { htmlComponents } from '../htmlComponents';

const { main, div, img } = htmlComponents;

export const backgroundImageLayout =
  (imageURL: string) =>
  (...children: CC) =>
    main.cls('login-page')(
      div.cls('background-logo-img-container')(
        img(imageURL).cls('background-logo-img')
      ),
      div.cls('login-page-container', '_container')(...children)
    );
