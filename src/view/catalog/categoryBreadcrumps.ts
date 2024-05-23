import { catalogContext } from '../../contexts/catalogContext';
import { factories } from '../../framework/factories';
import { CategoryExternal } from '../../utils/dataAndTyping/catalogDTO';
import { htmlComponents } from '../shared/htmlComponents';

const { link, div } = htmlComponents;
const { asynchronous } = factories;

export const categoryBreadcrumps = (categoryId: string) => {
  return asynchronous(async () => {
    const category = await catalogContext.getCategoryById(categoryId);
    if (!category) return div().cls('category-breadcrumps');

    let cur: CategoryExternal | undefined = category;
    const categories = [];

    while (cur) {
      categories.unshift(cur);
      cur = cur.parent;
    }

    return div(
      link(`/catalog`, 'All products > '),
      ...categories.map((c) =>
        link(`/catalog/${c.id}`, c === category ? c.name : `${c.name} > `)
      )
    ).cls('category-breadcrumps');
  });
};
