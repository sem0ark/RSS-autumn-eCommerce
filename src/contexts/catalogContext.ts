import {
  CATALOG_LIMIT_PER_PAGE,
  Category,
  FilterSelection,
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
};

export type ProductDataExternal = {
  id: string;
  name: string;
  shortDescription: string;

  price: string;
  discount?: string;

  imageUrl?: string;
};

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

function constructCategoryTree(categories: Category[]): CategoryExternal[] {
  const map = new Map<string, CategoryExternal>();
  const result: CategoryExternal[] = [];

  for (const category of categories)
    map.set(category.id, {
      id: category.id,
      name: category.name.en,
      subcategories: [],
    });

  for (const category of categories) {
    const cur = map.get(category.id);
    if (!cur) continue;

    if (category.parent) map.get(category.parent.id)?.subcategories.push(cur);
    else result.push(cur);
  }

  return result;
}

function getProductData(initial: ProductProjection): ProductDataExternal {
  return {
    id: initial.id,
    name: initial.name.en,
    shortDescription: initial.description?.en || 'No description',

    price: currencyString(initial.masterVariant.price.value),
    discount: initial.masterVariant.price.discounted
      ? currencyString(initial.masterVariant.price.discounted.value)
      : undefined,

    imageUrl: initial.masterVariant.images[0]?.url,
  };
}

export class CatalogContext {
  constructor(
    private readonly canContinue = pboolean(
      false,
      'CatalogContext_canContinue'
    ),

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

  public async getListOfCategories(): Promise<CategoryExternal[]> {
    const result = await catalogConnector.requestCategoryList();

    if (result.ok) {
      debug('Received a new set of products');
      return constructCategoryTree(result.body.results);
    } else {
      error('Failed to receive the next page.');
      notificationContext.addError(
        'Something went wrong: Failed to request the list of categories.'
      );
    }

    return [];
  }

  public async newRequest(): Promise<void> {
    this.page.set(0);
    this.products.clear();

    const result = await catalogConnector.requestProductList(
      this.filters.get(),
      this.page.get()
    );

    if (result.ok) {
      debug('Received a new set of products');
      this.canContinue.set(result.body.count < CATALOG_LIMIT_PER_PAGE);

      for (const v of result.body.results)
        this.products.push(getProductData(v));
    } else {
      error('Failed to receive the next page.');
      notificationContext.addError(
        'Something went wrong: Failed to receive query results.'
      );
    }
  }

  public async nextPage(): Promise<void> {
    this.page.inc();

    const result = await catalogConnector.requestProductList(
      this.filters.get(),
      this.page.get()
    );

    if (result.ok) {
      debug('Received a new set of products');
      this.canContinue.set(result.body.count < CATALOG_LIMIT_PER_PAGE);

      for (const v of result.body.results)
        this.products.push(getProductData(v));
    } else {
      error('Failed to receive the next page.');
      notificationContext.addError(
        'Something went wrong: Failed to receive the next page.'
      );
    }
  }
}
