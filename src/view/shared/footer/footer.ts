import './footer.css';

import { CC } from '../../../framework/ui_components/htmlComponent';
import { htmlComponents } from '../htmlComponents';

const { footer, div } = htmlComponents;

const footerContainer = (...children: CC) =>
  footer(...children)
    .cls('footer')
    .add(div('footer').cls('footer-container', '_container'));

export const footerComponents = {
  footerContainer,
};
