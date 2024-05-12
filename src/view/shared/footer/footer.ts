import './footer.css';

import { htmlComponents } from '../htmlComponents';

const { div, footer } = htmlComponents;

const footerContainer = () => footer(div('Copyright 2024&copy;'));

export const footerComponents = {
  footerContainer,
};
