import './sortPanel.css';

import { htmlComponents } from '../shared/htmlComponents';
import { textComponents } from '../shared/textComponents';
import { inputComponents } from '../shared/inputComponents';

const { div } = htmlComponents;
const { header3Orange } = textComponents;
const { selectInput } = inputComponents;

export const sortPanel = () => {
  return div(
    header3Orange('Sort'),
    selectInput([
      ['', ''],
      ['Name', 'name'],
    ])
  ).cls('sorting-container', 'sort-panel');
};
