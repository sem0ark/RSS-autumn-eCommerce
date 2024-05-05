import {
  DefaultRoute,
  RegExpRoute,
  Route,
} from '../../src/framework/routing/router';

describe('Test router pattern matching functionality', () => {
  const pageMock = new Page(jest.fn());

  type RegExEntry = [string, string, string[] | null];
  type DefaultEntry = [string, string[] | null];

  beforeEach(() => {
    disableLogging();
  });

  it.each<RegExEntry>([
    ['/some/string', '/some/string', []],
    ['/some/other/string', '/some/other/string', []],
    ['//string', '//string', []],
    ['//string', '/string', null],
    ['/', '/string', null],
  ])('should match standard routes', (pattern, url, value) => {
    const route = new RegExpRoute(pattern, pageMock) as Route;
    const result = route.match(url);
    expect(result).toStrictEqual(value);
  });

  it.each<RegExEntry>([
    ['/some/[int]/string', '/some/12/string', ['12']],
    ['/some/other/[int]', '/some/other/234', ['234']],
    ['/[int]/[int]/string', '/2/3/string', ['2', '3']],
    ['/[int]/[int]/string', '/2/string', null],
    ['/[int]/[int]/string', '/string', null],
    ['/[int]/[int]/string', '/sd/fe/string', null],
  ])('should match integer params', (pattern, url, value) => {
    const route = new RegExpRoute(pattern, pageMock) as Route;
    const result = route.match(url);
    expect(result).toStrictEqual(value);
  });

  it.each<RegExEntry>([
    ['/some/[word]/string', '/some/12/string', null],
    ['/some/other/[word]', '/some/other/234', null],
    ['/[word]/[word]/string', '/2/3/string', null],
    ['/[word]/[word]/string', '/2/string', null],
    ['/[word]/[word]/string', '/string', null],
    ['/[word]/[word]/string', '/sd/fe/string', ['sd', 'fe']],
    ['/[word]/[word]/string', '/SD/fe/string', ['SD', 'fe']],
    ['/[word]/[word]/string', '/sd/FE/string', ['sd', 'FE']],
  ])('should match word params', (pattern, url, value) => {
    const route = new RegExpRoute(pattern, pageMock) as Route;
    const result = route.match(url);
    expect(result).toStrictEqual(value);
  });

  it.each<RegExEntry>([
    ['/some/[string]/string', '/some/12/string', ['12']],
    ['/some/other/[string]', '/some/other/234', ['234']],
    ['/[string]/[string]/string', '/2/3/string', ['2', '3']],
    ['/[string]/[string]/string', '/2/string', null],
    ['/[string]/[string]/string', '/string', null],
    ['/[string]/[string]/string', '/sd/fe/string', ['sd', 'fe']],
    ['/[string]/[string]/string', '/SD/fe/string', ['SD', 'fe']],
    ['/[string]/[string]/string', '/sd/FE/string', ['sd', 'FE']],
    ['/[string]/[string]/string', '/sd-501/fe/string', ['sd-501', 'fe']],
    [
      '/[string]/[string]/string',
      '/S-123-2D/fe-234/string',
      ['S-123-2D', 'fe-234'],
    ],
    ['/[string]/[string]/string', '/sd/FE/string', ['sd', 'FE']],
  ])('should match word params', (pattern, url, value) => {
    const route = new RegExpRoute(pattern, pageMock) as Route;
    const result = route.match(url);
    expect(result).toStrictEqual(value);
  });

  it.each<RegExEntry>([
    ['/some/[string]/[path]', '/some/12', null],
    ['/some/[string]/[path]', '/some/12/string', ['12', 'string']],
    ['/some/other/[path]', '/some/other/234/34/dshj', ['234', '34', 'dshj']],
    [
      '/[string]/[string]/[path]',
      '/2/3/string/another-string/hello/123',
      ['2', '3', 'string', 'another-string', 'hello', '123'],
    ],
  ])('should match path params', (pattern, url, value) => {
    const route = new RegExpRoute(pattern, pageMock) as Route;
    const result = route.match(url);
    expect(result).toStrictEqual(value);
  });

  it.each<DefaultEntry>([
    ['/sd-501/fe/string', []],
    ['/S-123-2D/fe-234/string', []],
    ['/sd/FE/string', []],
  ])('should always match in default route', (url, value) => {
    const route = new DefaultRoute(pageMock) as Route;
    const result = route.match(url);
    expect(result).toStrictEqual(value);
  });
});
