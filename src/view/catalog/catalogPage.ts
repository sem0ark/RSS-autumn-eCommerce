import { Page } from '../../framework/ui_components/page';
import { htmlComponents } from '../shared/htmlComponents';
import { sidebarLayout } from '../shared/layouts/sidebarLayout';

const { main, aside } = htmlComponents;

export const catalogPage = new Page(() => {
  return sidebarLayout('Catalog')(
    aside().cls('catalog-page'),
    main().cls('catalog-page')
  );
}, 'Catalog | True Colors');
