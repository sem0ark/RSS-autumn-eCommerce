export type LanguageLocale = 'en-GB' | 'en-US' | 'ru' | 'de' | 'rs';

export const DEFAULT_LOCALE: LanguageLocale = 'en-GB';
export const CATALOG_LIMIT_PER_PAGE = 20;

export interface FilterSelection {
  selectedCategoryIds: string[];
  searchString: string;

  filters: {
    color: string[];
    price: [number, number][];
  };

  sort: {
    by: string;
    direction?: 'asc' | 'desc';
  };
}

interface CategoryReference {
  id: string;
  name: LocalizedString;
}

export interface Category {
  id: string;
  name: LocalizedString;
  description: LocalizedString;
  ancestors: CategoryReference[];
  parent?: CategoryReference;
}

export interface Product {
  id: string;
  masterData: {
    current: ProductData;
  };
}

export interface ProductProjection {
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

export interface TypedMoney {
  centAmount: number;
  currencyCode: 'USD' | 'EUR' | 'RUB' | 'RSD' | 'GBP';
  fractionDigits: number;
}

interface Image {
  url: string;
}

export type LocalizedString = Partial<Record<LanguageLocale, string>>;
export function localizedToString(
  name: LocalizedString = {},
  otherwise: string = 'No name'
) {
  return name['en-GB'] || name['en-US'] || Object.values(name)[0] || otherwise;
}

export type CategoryExternal = {
  id: string;
  name: string;
  subcategories: CategoryExternal[];
  parent?: CategoryExternal;
};

export function constructCategoryTree(
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

export type ProductDataExternal = {
  id: string;
  name: string;
  shortDescription: string;

  price: string;
  discount?: string;

  imageUrl?: string;
};

export function currencyString(price: TypedMoney) {
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

export function getCatalogCardProductData(
  initial: ProductProjection
): ProductDataExternal {
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

export type ProductFullDataExternal = {
  id: string;
  name: string;
  description: string;

  price: string;
  discount?: string;

  imageUrls?: string[];
  categories: CategoryExternal[];

  attributes: {
    color?: string;
  };
};

export function getFullProductData(
  initial: ProductProjection,
  categories: Map<string, CategoryExternal>
): ProductFullDataExternal {
  return {
    id: initial.id,
    name: localizedToString(initial.name),
    description: localizedToString(initial.description, 'No description'),

    price: currencyString(initial.masterVariant.prices[0].value),
    discount: initial.masterVariant.prices[0].discounted
      ? currencyString(initial.masterVariant.prices[0].discounted.value)
      : undefined,

    imageUrls: initial.masterVariant.images?.map((v) => v.url) || [],

    categories: initial.categories
      .map((v) => categories.get(v.id))
      .filter((v) => v !== undefined) as CategoryExternal[],

    attributes: Object.fromEntries(
      initial.masterVariant.attributes.map((v) => [v.name, v.value])
    ),
  };
}
