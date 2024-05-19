import { FilterSelection, catalogConnector } from '../data/catalogConnector';
import { factories } from '../framework/factories';
import { Storage } from '../framework/persistence/storage';
import { ObservableList } from '../framework/reactive_properties/observable_list';
import { debug, error } from '../framework/utilities/logging';

const { pinteger, pobject } = factories;

export type Category = {
  id: string;
  name: string;
  subcategories?: Category[];
};

export type ProductData = {
  id: string;
  name: string;
  shortDescription: string;

  price: string;
  discount?: string;

  currency: string;
  imageUrl?: string;
};

export class CatalogContext {
  constructor(
    private readonly page = pinteger(0, 'CatalogContext_page'),

    public readonly products = new ObservableList<ProductData>(
      'CatalogContext_products'
    ),

    public readonly filters = pobject<Partial<FilterSelection>>(
      {},
      'CatalogContext_filters'
    )
  ) {
    const storage = new Storage('CatalogContext');
    storage.registerProperty(filters);
    storage.registerProperty(page);
  }

  public async getListOfCategories(): Promise<Category[]> {
    return [];
  }

  public async nextPage(): Promise<void> {
    this.page.inc();

    const result = await catalogConnector.requestProductList(
      this.filters.get(),
      this.page.get()
    );

    if (result.ok) {
      debug('Received a new set of products');
      // for (const v of result.body.results) {
      // }
    } else {
      error('Failed to receive the next page.');
    }
  }
}
