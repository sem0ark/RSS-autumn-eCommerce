import { debug, error } from '../framework/utilities/logging';
import {
  CATALOG_LIMIT_PER_PAGE,
  Category,
  DEFAULT_LOCALE,
  FilterSelection,
  LanguageLocale,
  Product,
  ProductProjection,
} from '../utils/dataAndTyping/catalogDTO';
import { authConnector } from './authConnector';
import { PagedResponse, ServerConnector } from './serverConnector';

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

  static priceFilterQuery(ranges: [number, number][]): QueryElement {
    return QueryBuilder.filterQueryRanges('variants.price.centAmount', ranges);
  }

  static categoryFilterQuery(categoryIds: string[]): QueryElement[] {
    return categoryIds.map((v) =>
      QueryBuilder.filterQuerySelect('categories.id', `subtree("${v}")`)
    );
  }

  static filterQueryRanges(
    field: string,
    ranges: [number, number][]
  ): QueryElement {
    return {
      name: `filter`,
      value: `${field}:range ${ranges
        .map(([from, to]) => `(${from || '*'} to ${to || '*'})`)
        .join(', ')}`,
    };
  }

  static filterQuerySelect(
    field: string,
    ...values: (string | number | boolean)[]
  ): QueryElement {
    return {
      name: `filter`,
      value: `${field}:${values.map((v) => `${v}`).join(',')}`,
    };
  }

  static filterQuerySelectQuoted(
    field: string,
    ...values: (string | number | boolean)[]
  ): QueryElement {
    return {
      name: `filter`,
      value: `${field}:${values.map((v) => `"${v}"`).join(',')}`,
    };
  }

  static element(name: string, value: string | number | boolean): QueryElement {
    return { name, value: `${value}` };
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
    return queryEntries.length !== 0 ? '?' + queryEntries.join('&') : '';
  }

  public static buildQuery(
    filters: Partial<FilterSelection>,
    options: Partial<QueryOptions>
  ) {
    const elements = [];

    if (filters.searchString)
      elements.push(
        QueryBuilder.searchQuery(
          filters.searchString,
          options.locale || DEFAULT_LOCALE
        ),
        QueryBuilder.element('fuzzy', 'true'),
        QueryBuilder.element('fuzzyLevel', '0')
      );

    if (filters.selectedCategoryIds?.length)
      elements.push(
        ...QueryBuilder.categoryFilterQuery(filters.selectedCategoryIds)
      );

    if (filters.sort)
      elements.push(
        QueryBuilder.sortQuery(filters.sort.by, filters.sort.direction)
      );

    if (filters.filters) {
      if (filters.filters.price.length)
        elements.push(QueryBuilder.priceFilterQuery(filters.filters.price));

      if (filters.filters.color.length)
        elements.push(
          QueryBuilder.filterQuerySelectQuoted(
            'variants.attributes.color',
            ...filters.filters.color
          )
        );
    }

    if (options.limit)
      elements.push(QueryBuilder.element('limit', options.limit));

    if (options.offset)
      elements.push(QueryBuilder.element('offset', options.offset));

    return QueryBuilder.buildQueryString(...elements);
  }
}

export class CatalogConnector {
  public async requestCategoryList() {
    await authConnector.runGeneralAuthWorkflow();

    const result = await ServerConnector.get<PagedResponse<Category>>(
      ServerConnector.getAPIURL(
        'categories',
        QueryBuilder.buildQueryString({ name: 'limit', value: '100' })
      ),
      { ...authConnector.getAuthBearerHeaders() }
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
        'product-projections/search' +
          QueryBuilder.buildQuery(filters, {
            locale: DEFAULT_LOCALE,
            limit: CATALOG_LIMIT_PER_PAGE,
            offset: CATALOG_LIMIT_PER_PAGE * page,
          })
      ),
      { ...authConnector.getAuthBearerHeaders() }
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
      ServerConnector.getAPIURL(`products/${productId}`),
      { ...authConnector.getAuthBearerHeaders() }
    );

    if (result.ok) debug('Received product information', result.body);
    else error('Failed to load product information', result.errors);

    return result;
  }
}

export const catalogConnector = new CatalogConnector();
