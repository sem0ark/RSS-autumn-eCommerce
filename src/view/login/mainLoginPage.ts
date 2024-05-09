import background from '../../../assets/background.jpg';

import { CC } from '../../framework/ui_components/htmlComponent';
import { htmlComponents } from '../shared/htmlComponents';
import { formComponents } from './form';

const { main, div, img } = htmlComponents;
const { formContainer } = formComponents;

const mainContainer = (...children: CC) =>
  main(...children)
    .cls('main', 'main-logo-page')
    .add(
      div()
        .cls('background-logo-img-container')
        .add(img(background).cls('background-logo-img'))
    )
    .add(
      div().cls('main-logo-page-container', '_container').add(formContainer())
    );

export const mainComponents = {
  mainContainer,
};
