import './footer.css';

import { htmlComponents } from '../htmlComponents';

const { footer } = htmlComponents;

const footerContainer = () => footer();

export const footerComponent = footerContainer;

export const footerComponents = {
  footerContainer,
};
