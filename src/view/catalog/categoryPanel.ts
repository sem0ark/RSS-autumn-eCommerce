import './categoryPanel.css';

import { catalogContext } from '../../contexts/catalogContext';
import { factories } from '../../framework/factories';
import { HTMLComponent } from '../../framework/ui_components/htmlComponent';
import { htmlComponents } from '../shared/htmlComponents';
import { spinnerComponents } from '../shared/spinnerComponents';
import { textComponents } from '../shared/textComponents';
import { inputComponents } from '../shared/inputComponents';
import { CategoryExternal } from '../../utils/dataAndTyping/catalogDTO';
import { Router } from '../../framework/routing/router';

const { asynchronous } = factories;
const { div, ul, li, link } = htmlComponents;
const { header3Orange } = textComponents;
const { spinner } = spinnerComponents;
const { checkboxInput } = inputComponents;

const categoryEntry = (category: CategoryExternal) => {
  const result = div().cls('category-entry');

  const checkboxSelectCategory = checkboxInput().onInput((e) => {
    const checked = (e.target as HTMLInputElement).checked;

    if (!checked) {
      catalogContext.filters.get().selectedCategoryIds = catalogContext.filters
        .get()
        ?.selectedCategoryIds?.filter((id) => id !== category.id);
    } else {
      catalogContext.filters.get().selectedCategoryIds = [
        ...(catalogContext.filters.get().selectedCategoryIds || []),
        category.id,
      ];
    }

    catalogContext.newRequest();
  });

  result.add(checkboxSelectCategory.onClick(() => {Router.navigateTo(`/catalog/${category.id}`)}, false, true));

  result.add(link(`/catalog/${category.id}`, category.name));

  return result;
};

export const categoryPanel = (rootCategoryId?: string) => {
  function recursiveRender(...categories: CategoryExternal[]): HTMLComponent {
    return ul(
      ...categories.map((c) =>
        li(
          categoryEntry(c),
          c.subcategories ? recursiveRender(...c.subcategories) : ''
        )
      )
    );
  }

  return div(
    header3Orange('Categories'),
    asynchronous(
      async () => {
        if (rootCategoryId) {
          const category = await catalogContext.getCategoryById(rootCategoryId);
          if (category)
            return recursiveRender(...category.subcategories).cls('categories');
        }

        const categories = await catalogContext.getListOfCategories();
        return recursiveRender(...categories).cls('categories');
      },
      () => spinner().cls('categories')
    )
  ).cls('categories-container', 'category-panel');
};
