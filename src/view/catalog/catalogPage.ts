import { catalogContext } from '../../contexts/catalogContext';
import { factories } from '../../framework/factories';
import { Page } from '../../framework/ui_components/page';
import { containerComponents } from '../shared/containerComponents';
import { htmlComponents } from '../shared/htmlComponents';
import { sidebarLayout } from '../shared/layouts/sidebarLayout';
import { productCard } from './productCard';

const { functional } = factories;
const { main, aside, p, hidden } = htmlComponents;
const { containerFlexRow } = containerComponents;

export const catalogPage = new Page(() => {
  catalogContext.newRequest();

  return sidebarLayout('Catalog')(
    aside().cls('catalog-page'),
    main(
      containerFlexRow({
        gap: 10,
        padding: 10,
        wrap: true,
      })(
        functional(() =>
          catalogContext.products.pLength.get() === 0
            ? p('No products found.')
            : hidden()
        )
      )
        .cls('products-container')
        .list(catalogContext.products, productCard)
    ).cls('catalog-page')
  );
}, 'Catalog | True Colors');
