import './searchPanel.css';

import { htmlComponents } from '../shared/htmlComponents';
import { inputComponents } from '../shared/inputComponents';
import { textComponents } from '../shared/textComponents';
import { catalogContext } from '../../contexts/catalogContext';

const { div } = htmlComponents;
const { validated, inputText } = inputComponents;
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

  search.onInput(() => {
    if (searchValue.get()?.length === 0) {
      catalogContext.filters.get().searchString = undefined;
      catalogContext.newRequest();
    }

    if (!searchValid || searchValue.get()?.length === 0) {
      catalogContext.filters.get().searchString = undefined;
      return;
    }

    catalogContext.filters.get().searchString = searchValue.get();
    catalogContext.newRequest();
  });

  return div(header3Orange('Search'), search).cls('search-panel');
};
