import './catalogPage.css';

import { catalogContext } from '../../contexts/catalogContext';
import { factories } from '../../framework/factories';
import { Page } from '../../framework/ui_components/page';
import { containerComponents } from '../shared/containerComponents';
import { htmlComponents } from '../shared/htmlComponents';
import { inputComponents } from '../shared/inputComponents';
import { sidebarLayout } from '../shared/layouts/sidebarLayout';
import { spinnerComponents } from '../shared/spinnerComponents';
import { productCard } from './productCard';
import { categoryPanel } from './categoryPanel';
import { categoryBreadcrumps } from './categoryBreadcrumps';
import { sortPanel } from './sortPanel';
import { searchPanel } from './searchPanel';

const { functional, pboolean } = factories;
const { main, aside, p, hidden } = htmlComponents;
const { containerFlexRow } = containerComponents;
const { spinner } = spinnerComponents;
const { buttonSecondary } = inputComponents;

export const catalogPage = new Page((categoryId?: string) => {
  if (categoryId) {
    catalogContext.filters.get().selectedCategoryIds = [categoryId];
  } else {
    catalogContext.filters.get().selectedCategoryIds = [];
  }

  catalogContext.filters.get().searchString = undefined;
  // clear search string on moving to the new category

  const loadingProducts = pboolean(false);

  loadingProducts.enable();
  catalogContext.newRequest().then(() => {
    loadingProducts.disable();
  });

  return sidebarLayout('Catalog')(
    aside(searchPanel(), sortPanel(), categoryPanel(categoryId)).cls(
      'catalog-page'
    ),
    main(
      categoryBreadcrumps(categoryId || ''),

      containerFlexRow({
        gap: 10,
        padding: 10,
        wrap: true,
      })(
        functional(() =>
          catalogContext.products.pLength.get() === 0 && !loadingProducts.get()
            ? p('No products found.')
            : hidden()
        )
      )
        .cls('products-container')
        .list(catalogContext.products, productCard),

      functional(() => (loadingProducts.get() ? spinner() : hidden())),
      functional(() => {
        const canContinue = catalogContext.canContinue.get();
        const loading = loadingProducts.get();
        return !loading && canContinue
          ? buttonSecondary('Load More')
              .cls('load-more')
              .onClick(() => {
                loadingProducts.enable();
                catalogContext
                  .nextPage()
                  .then(() => loadingProducts.disable())
                  .catch(() => loadingProducts.disable());
              })
          : hidden();
      })
    ).cls('catalog-page')
  );
}, 'Catalog | True Colors');
