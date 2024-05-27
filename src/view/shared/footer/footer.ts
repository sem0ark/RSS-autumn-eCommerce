import rssSVG from '../../../../assets/rs_school_small.svg';
import './footer.css';

import { htmlComponents } from '../htmlComponents';

const { footer, iconSvg, a } = htmlComponents;

const footerContainer = () =>
  footer(
    a(
      'https://rollingscopes.com/',
      iconSvg(rssSVG).cls('rss', 'block-selection')
    ),
    'JavaScript/Front-end 2023Q4 ©'
  );

export const footerComponent = footerContainer;

export const footerComponents = {
  footerContainer,
};
