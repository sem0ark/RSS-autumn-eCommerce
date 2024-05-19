import './categoryPanel.css';

import {
  CategoryExternal,
  catalogContext,
} from '../../contexts/catalogContext';
import { factories } from '../../framework/factories';
import { HTMLComponent } from '../../framework/ui_components/htmlComponent';
import { htmlComponents } from '../shared/htmlComponents';
import { spinnerComponents } from '../shared/spinnerComponents';
import { textComponents } from '../shared/textComponents';

const { asynchronous } = factories;
const { div, ul, li, link } = htmlComponents;
const { header3Orange } = textComponents;
const { spinner } = spinnerComponents;

export const categoryPanel = (rootCategoryId?: string) => {
  function recursiveRender(...categories: CategoryExternal[]): HTMLComponent {
    return ul(
      ...categories.map((c) =>
        li(
          link(`/catalog/${c.id}`, c.name),
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
          if (category) return recursiveRender(category).cls('categories');
        }

        const categories = await catalogContext.getListOfCategories();
        return recursiveRender(...categories).cls('categories');
      },
      () => spinner().cls('categories')
    )
  ).cls('categories-container', 'category-panel');
};
