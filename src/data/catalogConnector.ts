import { debug, error } from '../framework/utilities/logging';
import { authConnector } from './authConnector';
import { PagedResponse, ServerConnector } from './serverConnector';

const CATALOG_LIMIT = 20;

export interface FilterSelection {
  selectedCategoryId: string;
  searchString: string;

  sort: {
    by: string;
    direction?: 'asc' | 'desc';
  };
}

export const currencyString = (price: TypedMoney) => {
  return `${(price.centAmount / Math.pow(10, price.fractionDigits)).toFixed(price.fractionDigits)} ${{
    USD: '$',
    EUR: '€',
    RUB: '₽',
  }}`;
};

interface CategoryReference {
  id: string;
  name: LocalizedString;
}

interface Category {
  id: string;
  name: LocalizedString;
  description: LocalizedString;
  ancestors: CategoryReference[];
  parent?: CategoryReference;
}

interface Product {
  id: string;
  masterData: {
    current: ProductData;
  };
}

interface ProductProjection {
  id: string;
  name: LocalizedString;
  description?: LocalizedString;
  categories: CategoryReference[];

  masterVariant: ProductVariant;
  variants: ProductVariant;
}

interface ProductData {
  name: LocalizedString;
  description: LocalizedString;

  categories: CategoryReference[];

  masterVariant: ProductVariant;
  variants: ProductVariant;
}

interface ProductVariant {
  id: string;

  price: Price;
  prices: Price[];

  images: Image[];

  attributes: Attribute<object>[];
}

interface Attribute<T> {
  name: string;
  value: T;
}

interface Price {
  id: string;
  value: TypedMoney;

  discounted?: {
    value: TypedMoney;
  };
}

interface TypedMoney {
  centAmount: number;
  currencyCode: 'USD' | 'EUR' | 'RUB' | 'RSD' | 'GBP';
  fractionDigits: number;
}

interface Image {
  url: string;
}

interface LocalizedString {
  en: string;
  ru?: string;
  de?: string;
  rs?: string;
}

type LanguageLocale = 'en' | 'ru' | 'de' | 'rs';

type QueryElement = { name: string; value: string };
type QueryOptions = {
  limit: number;
  offset: number;
  locale: LanguageLocale;
};

class QueryBuilder {
  static searchQuery(text: string, locale: LanguageLocale): QueryElement {
    return { name: `text.${locale}`, value: `"${text}"` };
  }

  static priceFilterQuery(from: number = 0, to?: number): QueryElement {
    return QueryBuilder.filterQueryRange('variants.price.centAmount', from, to);
  }

  static categoryFilterQuery(categoryIds: string[]): QueryElement {
    return QueryBuilder.filterQuerySelect('categories.id', categoryIds);
  }

  static filterQueryRange(
    field: string,
    from?: number,
    to?: number
  ): QueryElement {
    return {
      name: `filter`,
      value: `${field}:range (${from || '*'} to ${to || '*'})`,
    };
  }

  static filterQuerySelect(
    field: string,
    values: (string | number | boolean)[]
  ): QueryElement {
    return {
      name: `filter`,
      value: `${field}:${values.map((v) => `"${v}"`).join(',')}`,
    };
  }

  static sortQuery(
    field: string,
    direction: 'asc' | 'desc' = 'asc'
  ): QueryElement {
    return { name: 'sort', value: `${field} ${direction}` };
  }

  static buildQueryString(...elements: QueryElement[]) {
    const queryEntries = (
      elements.filter((v) => v !== undefined) as QueryElement[]
    ).map(({ name, value }) => `${name}=${value}`);
    return queryEntries.join('&');
  }

  public static buildQuery(
    filters: Partial<FilterSelection>,
    options: Partial<QueryOptions>
  ) {
    const elements = [];
    if (filters.searchString)
      elements.push(
        QueryBuilder.searchQuery(filters.searchString, options.locale || 'en')
      );
    if (filters.selectedCategoryId)
      elements.push(
        QueryBuilder.categoryFilterQuery([filters.selectedCategoryId])
      );
    if (filters.sort)
      elements.push(
        QueryBuilder.sortQuery(filters.sort.by, filters.sort.direction)
      );

    return QueryBuilder.buildQueryString(...elements);
  }
}

export class CatalogConnector {
  private selectedLanguage: LanguageLocale = 'en';

  public async requestCategoryList() {
    await authConnector.runGeneralAuthWorkflow();

    const result = await ServerConnector.post<PagedResponse<Category>>(
      ServerConnector.getAPIURL('categories'),
      { ...authConnector.getAuthBasicHeaders() }
    );

    if (result.ok) {
      debug('Received a list of categories', result.body);
    } else {
      error('Failed to refresh token data', result.errors);
    }

    return result;
  }

  public async requestProductList(
    filters: Partial<FilterSelection> = {},
    page: number = 0
  ) {
    await authConnector.runGeneralAuthWorkflow();

    const result = await ServerConnector.get<PagedResponse<ProductProjection>>(
      ServerConnector.getAPIURL(
        'product-projections/search',
        QueryBuilder.buildQuery(filters, {
          locale: this.selectedLanguage,
          limit: CATALOG_LIMIT,
          offset: CATALOG_LIMIT * page,
        })
      )
    );

    if (result.ok) {
      debug('Received a list of products', result.body);
    } else {
      error(
        'Failed to request list of products with params',
        filters,
        page,
        result.errors
      );
    }

    return result;
  }

  public async requestProductInfo(productId: string) {
    await authConnector.runGeneralAuthWorkflow();

    const result = await ServerConnector.get<Product>(
      ServerConnector.getAPIURL(`products/${productId}`)
    );

    if (result.ok) {
      debug('Received product information', result.body);
    } else {
      error('Failed to load product information', result.errors);
    }

    return result;
  }
}

export const catalogConnector = new CatalogConnector();
