export interface Attribute<T> {
  name: string;
  value: T;
}

export interface Price {
  id: string;
  value: TypedMoney;

  discounted?: {
    value: TypedMoney;
  };
}

export interface Image {
  url: string;
}

export interface TypedMoney {
  centAmount: number;
  currencyCode: 'USD' | 'EUR' | 'RUB' | 'RSD' | 'GBP';
  fractionDigits: number;
}

export type LanguageLocale = 'en-GB' | 'en-US' | 'ru' | 'de' | 'rs';

export const DEFAULT_LOCALE: LanguageLocale = 'en-GB';
export const CATALOG_LIMIT_PER_PAGE = 10;

export type LocalizedString = Partial<Record<LanguageLocale, string>>;
export function localizedToString(
  name: LocalizedString = {},
  otherwise: string = 'No name'
) {
  return name['en-GB'] || name['en-US'] || Object.values(name)[0] || otherwise;
}
