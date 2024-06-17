import { catalogConnector } from '../data/catalogConnector';
import { factories } from '../framework/factories';
import { Storage } from '../framework/persistence/storage';
import { ObservableList } from '../framework/reactive_properties/observable_list';
import { debug, error } from '../framework/utilities/logging';
import { CATALOG_LIMIT_PER_PAGE } from '../utils/dataAndTyping/DTO';
import {
  CategoryExternal,
  FilterSelection,
  ProductDataExternal,
  constructCategoryTree,
  getCatalogCardProductData,
} from '../utils/dataAndTyping/catalogDTO';
import { notificationContext } from './notificationContext';

const { pinteger, pobject, pboolean } = factories;

class CatalogContext {
  private categoriesMap?: Map<string, CategoryExternal>;

  private rootCategories?: CategoryExternal[];

  constructor(
    public readonly canContinue = pboolean(false, 'CatalogContext_canContinue'),

    private readonly page = pinteger(0, 'CatalogContext_page'),

    public readonly products = new ObservableList<ProductDataExternal>(
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

  private async fetchCategories(): Promise<void> {
    if (this.rootCategories && this.categoriesMap) return;

    const result = await catalogConnector.requestCategoryList();

    if (result.ok) {
      debug('Received a new set of products');
      const [root, map] = constructCategoryTree(result.body.results);

      this.rootCategories = root;
      this.categoriesMap = map;
    } else {
      error('Failed to receive the next page.');
      notificationContext.addError(
        'Something went wrong: Failed to request the list of categories.'
      );
    }
  }

  public async getCategoryMap(): Promise<Map<string, CategoryExternal>> {
    await this.fetchCategories();
    return this.categoriesMap as Map<string, CategoryExternal>;
  }

  public async getCategoryById(
    categoryId: string
  ): Promise<CategoryExternal | undefined> {
    await this.fetchCategories();
    return this.categoriesMap?.get(categoryId);
  }

  public async getListOfCategories(): Promise<CategoryExternal[]> {
    await this.fetchCategories();
    return this.rootCategories as CategoryExternal[];
  }

  private async getProducts(): Promise<void> {
    const result = await catalogConnector.requestProductList(
      this.filters.get(),
      this.page.get()
    );

    if (result.ok) {
      debug('Received a new set of products');
      this.canContinue.set(
        result.body.total > CATALOG_LIMIT_PER_PAGE * (this.page.get() + 1)
      );

      for (const v of result.body.results)
        this.products.push(getCatalogCardProductData(v));
    } else {
      error('Failed to receive the next page.');
      notificationContext.addError(
        'Something went wrong: Failed to receive query results.'
      );
    }
  }

  public async newRequest(): Promise<void> {
    this.page.set(0);
    this.products.clear();

    await this.getProducts();
  }

  public async nextPage(): Promise<void> {
    this.page.inc();

    await this.getProducts();
  }
}

export const catalogContext = new CatalogContext();
