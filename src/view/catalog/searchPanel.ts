import './searchPanel.css';

import { htmlComponents } from '../shared/htmlComponents';
import { inputComponents } from '../shared/inputComponents';
import { textComponents } from '../shared/textComponents';
import { catalogContext } from '../../contexts/catalogContext';

const { form } = htmlComponents;
const { validated, inputText, buttonSecondary } = inputComponents;
const { header3Orange } = textComponents;

export const searchPanel = () => {
  const [search, searchValid, searchValue] = validated(
    inputText()
      .attr('placeholder', 'Enter a search query')
      .attr('value', catalogContext.filters.get().searchString)
      .cls(),
    [
      (text: string) =>
        text.length !== 0 &&
        text.length < 3 &&
        'Please, enter at least 3 letters',
    ]
  );

  const searchButton = buttonSecondary('Search')
    .propClass(searchValid, (v) => (v ? ['active'] : []))
    .attr('type', 'submit');

  return form(header3Orange('Search'), search, searchButton)
    .cls('search-panel')
    .onSubmit(() => {
      if (!searchValid || searchValue.get()?.length === 0) {
        catalogContext.filters.get().searchString = undefined;
        return;
      }

      catalogContext.filters.get().searchString = searchValue.get();
      catalogContext.newRequest();
    });
};
