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

const { functional, pboolean } = factories;
const { main, aside, p, hidden } = htmlComponents;
const { containerFlexRow } = containerComponents;
const { spinner } = spinnerComponents;
const { buttonSecondary } = inputComponents;

export const catalogPage = new Page(() => {
  const loading = pboolean(false);

  loading.enable();
  catalogContext.newRequest().then(() => {
    loading.disable();
  });

  return sidebarLayout('Catalog')(
    aside().cls('catalog-page'),
    main(
      containerFlexRow({
        gap: 10,
        padding: 10,
        wrap: true,
      })(
        functional(() =>
          catalogContext.products.pLength.get() === 0 && !loading.get()
            ? p('No products found.')
            : hidden()
        )
      )
        .cls('products-container')
        .list(catalogContext.products, productCard),

      functional(() => (loading.get() ? spinner() : hidden())),
      functional(() =>
        !loading.get() && catalogContext.canContinue.get()
          ? buttonSecondary('Load More')
              .cls('load-more')
              .onClick(() => {
                loading.enable();
                catalogContext
                  .nextPage()
                  .then(() => loading.disable())
                  .catch(() => loading.disable());
              })
          : hidden()
      )
    ).cls('catalog-page')
  );
}, 'Catalog | True Colors');
