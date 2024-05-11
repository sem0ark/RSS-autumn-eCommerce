import './footer.css';

import { htmlComponents } from '../htmlComponents';

const { footer, div } = htmlComponents;

const footerContainer = () =>
  footer.cls('footer')(div('footer').cls('footer-container', '_container'));

export const footerComponents = {
  footerContainer,
};
