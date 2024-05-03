import { disableLogging } from '../../src/framework/utilities/logging';
import {
  PInteger,
  Property,
} from '../../src/framework/reactive_properties/property';

describe('Test functionality of elementary property', () => {
  beforeEach(() => {
    disableLogging();
  });

  it('must be able set value', () => {
    const prop = new Property<string>('test property', 'initial');
    expect(prop.get()).toBe('initial');
  });

  it('must update set value', () => {
    const prop = new Property<string>('test property', 'initial');
    prop.set('new');
    expect(prop.get()).toBe('new');
  });

  it('must call listeners on value update', () => {
    const cb = jest.fn();

    const prop = new Property<string>('test property', 'initial');
    prop.onChange(cb);
    prop.set('new');

    expect(prop.get()).toBe('new');
    expect(cb.mock.calls).toStrictEqual([['new', 'initial', prop]]);
  });

  it('must not call listeners after value update', () => {
    const cb = jest.fn();

    const prop = new Property<string>('test property', 'initial');
    prop.set('new');
    prop.onChange(cb);

    expect(prop.get()).toBe('new');
    expect(cb.mock.calls).toStrictEqual([]);
  });
});

describe('Test functionality of PInteger', () => {
  beforeEach(() => {
    disableLogging();
  });

  it('must be able set value', () => {
    const prop = new PInteger('test property', 0);
    expect(prop.get()).toBe(0);
  });

  it('must update set value', () => {
    const prop = new PInteger('test property', 0);
    prop.set(10);
    expect(prop.get()).toBe(10);
  });

  it('must update set value on inc', () => {
    const prop = new PInteger('test property', 0);
    prop.inc();
    expect(prop.get()).toBe(1);
  });

  it('must update set value on dec', () => {
    const prop = new PInteger('test property', 0);
    prop.dec();
    expect(prop.get()).toBe(-1);
  });

  it('must update set value on inc with specified step', () => {
    const prop = new PInteger('test property', 0);
    prop.inc(2);
    expect(prop.get()).toBe(2);
  });

  it('must update set value on dec with specified step', () => {
    const prop = new PInteger('test property', 0);
    prop.dec(2);
    expect(prop.get()).toBe(-2);
  });

  it('must call listeners on value update', () => {
    const cb = jest.fn();

    const prop = new PInteger('test property', 0);
    prop.onChange(cb);
    prop.inc();

    expect(prop.get()).toBe(1);
    expect(cb.mock.calls).toStrictEqual([[1, 0, prop]]);
  });

  it('must not call listeners after value update', () => {
    const cb = jest.fn();

    const prop = new PInteger('test property', 0);
    prop.inc();
    prop.onChange(cb);

    expect(prop.get()).toBe(1);
    expect(cb.mock.calls).toStrictEqual([]);
  });

  it('must call listeners on value update dec', () => {
    const cb = jest.fn();

    const prop = new PInteger('test property', 0);
    prop.onChange(cb);
    prop.dec();

    expect(prop.get()).toBe(1);
    expect(cb.mock.calls).toStrictEqual([[1, 0, prop]]);
  });

  it('must not call listeners after value update dec', () => {
    const cb = jest.fn();

    const prop = new PInteger('test property', 0);
    prop.dec();
    prop.onChange(cb);

    expect(prop.get()).toBe(1);
    expect(cb.mock.calls).toStrictEqual([]);
  });
});
