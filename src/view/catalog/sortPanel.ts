import './sortPanel.css';

import { htmlComponents } from '../shared/htmlComponents';
import { textComponents } from '../shared/textComponents';
import { inputComponents } from '../shared/inputComponents';
import { factories } from '../../framework/factories';
import { containerComponents } from '../shared/containerComponents';
import { catalogContext } from '../../contexts/catalogContext';

const { div } = htmlComponents;
const { header3Orange } = textComponents;
const { selectInput } = inputComponents;
const { containerFlexRow } = containerComponents;

const { property, pboolean, functional, text } = factories;
const { buttonSecondary } = inputComponents;

export const sortPanel = () => {
  const isAscending = pboolean(true);
  const sortBy = property<string>('');

  const updateData = () => {
    if (!sortBy.get()) return;

    catalogContext.filters.get().sort = {
      by: sortBy.get(),
      direction: isAscending.get() ? 'asc' : 'desc',
    };
    catalogContext.newRequest();
  };

  return div(
    header3Orange('Sort'),

    containerFlexRow({ gap: 5 })(
      buttonSecondary(
        functional(() => (isAscending.get() ? text('↑') : text('↓')))
      ).onClick(
        () => {
          isAscending.toggle();
          updateData();
        },
        true,
        true
      ),
      selectInput([
        ['', 'Sort by'],
        ['name.en-gb', 'Name'],
        ['price', 'Price'],
      ]).onInputValue((value) => {
        sortBy.set(value);
        updateData();
      })
    ).cls('input-container')
  ).cls('sort-panel');
};
