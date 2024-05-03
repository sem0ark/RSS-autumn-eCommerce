import { disableLogging } from '../../src/framework/utilities/logging';
import { Property } from '../../src/framework/reactive_properties/property';

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
