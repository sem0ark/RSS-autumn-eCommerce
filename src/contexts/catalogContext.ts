import {
  CATALOG_LIMIT_PER_PAGE,
  Category,
  FilterSelection,
  LocalizedString,
  ProductProjection,
  TypedMoney,
  catalogConnector,
} from '../data/catalogConnector';
import { factories } from '../framework/factories';
import { Storage } from '../framework/persistence/storage';
import { ObservableList } from '../framework/reactive_properties/observable_list';
import { debug, error } from '../framework/utilities/logging';
import { notificationContext } from './notificationContext';

const { pinteger, pobject, pboolean } = factories;

export type CategoryExternal = {
  id: string;
  name: string;
  subcategories: CategoryExternal[];
  parent?: CategoryExternal;
};

export type ProductDataExternal = {
  id: string;
  name: string;
  shortDescription: string;

  price: string;
  discount?: string;

  imageUrl?: string;
};

function localizedToString(
  name: LocalizedString = {},
  otherwise: string = 'No name'
) {
  return name['en-GB'] || name['en-US'] || Object.values(name)[0] || otherwise;
}

function currencyString(price: TypedMoney) {
  const priceText = (
    price.centAmount / Math.pow(10, price.fractionDigits)
  ).toFixed(price.fractionDigits);
  switch (price.currencyCode) {
    case 'EUR':
      return `€${priceText}`;
    case 'USD':
      return `$${priceText}`;
    case 'GBP':
      return `£${priceText}`;
    case 'RUB':
      return `${priceText}₽`;
    default:
      return `${priceText} ${price.currencyCode}`;
  }
}

function constructCategoryTree(
  categories: Category[]
): [CategoryExternal[], Map<string, CategoryExternal>] {
  const map = new Map<string, CategoryExternal>();
  const result: CategoryExternal[] = [];

  for (const category of categories)
    map.set(category.id, {
      id: category.id,
      name: localizedToString(category.name),
      subcategories: [],
    });

  for (const category of categories) {
    const cur = map.get(category.id);
    if (!cur) continue;

    if (category.parent) {
      map.get(category.parent.id)?.subcategories.push(cur);
      cur.parent = map.get(category.parent.id);
    } else {
      result.push(cur);
    }
  }

  return [result, map];
}

function getProductData(initial: ProductProjection): ProductDataExternal {
  return {
    id: initial.id,
    name: localizedToString(initial.name),
    shortDescription: localizedToString(initial.description, 'No description'),

    price: currencyString(initial.masterVariant.prices[0].value),
    discount: initial.masterVariant.prices[0].discounted
      ? currencyString(initial.masterVariant.prices[0].discounted.value)
      : undefined,

    imageUrl: initial.masterVariant.images[0]?.url,
  };
}

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
        this.products.push(getProductData(v));
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
