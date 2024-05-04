import { disableLogging } from '../../src/framework/utilities/logging';
import {
  DependentProperty,
  PBoolean,
  PInteger,
  PList,
  PObject,
  Property,
} from '../../src/framework/reactive_properties/property';
import { ObservableList } from '../../src/framework/reactive_properties/observable_list';

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
    expect(cb).toHaveBeenCalledTimes(1);
    expect(cb.mock.calls).toStrictEqual([['new', prop]]);
  });

  it('must not call listeners after value update', () => {
    const cb = jest.fn();

    const prop = new Property<string>('test property', 'initial');
    prop.set('new');
    prop.onChange(cb);

    expect(prop.get()).toBe('new');
    expect(cb).toHaveBeenCalledTimes(0);
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
    expect(cb).toHaveBeenCalledTimes(1);
    expect(cb.mock.calls).toStrictEqual([[1, prop]]);
  });

  it('must not call listeners after value update', () => {
    const cb = jest.fn();

    const prop = new PInteger('test property', 0);
    prop.inc();
    prop.onChange(cb);

    expect(prop.get()).toBe(1);
    expect(cb).toHaveBeenCalledTimes(0);
    expect(cb.mock.calls).toStrictEqual([]);
  });

  it('must call listeners on value update dec', () => {
    const cb = jest.fn();

    const prop = new PInteger('test property', 0);
    prop.onChange(cb);
    prop.dec();

    expect(prop.get()).toBe(-1);
    expect(cb).toHaveBeenCalledTimes(1);
    expect(cb.mock.calls).toStrictEqual([[-1, prop]]);
  });

  it('must not call listeners after value update dec', () => {
    const cb = jest.fn();

    const prop = new PInteger('test property', 0);
    prop.dec();
    prop.onChange(cb);

    expect(prop.get()).toBe(-1);
    expect(cb).toHaveBeenCalledTimes(0);
    expect(cb.mock.calls).toStrictEqual([]);
  });
});

describe('Test functionality of PBoolean', () => {
  beforeEach(() => {
    disableLogging();
  });

  it('must be able set value', () => {
    const prop = new PBoolean('test property', false);
    expect(prop.get()).toBe(false);
  });

  it('must update set value', () => {
    const prop = new PBoolean('test property', false);
    prop.set(true);
    expect(prop.get()).toBe(true);
  });

  it('must update set value on enable', () => {
    const prop = new PBoolean('test property', false);
    prop.enable();
    expect(prop.get()).toBe(true);
  });

  it('must update set value on disable', () => {
    const prop = new PBoolean('test property', false);
    prop.disable();
    expect(prop.get()).toBe(false);
  });

  it('must update set value on toggle', () => {
    const prop = new PBoolean('test property', false);
    prop.toggle();
    expect(prop.get()).toBe(true);
  });
});

describe('Test functionality of dependent property', () => {
  beforeEach(() => {
    disableLogging();
  });

  it('must be able set initial value', () => {
    const prop1 = new PInteger('', 0);
    const prop2 = new PInteger('', 0);

    const dprop = new DependentProperty(
      'test property',
      () => prop1.get() + prop2.get()
    );

    expect(dprop.get()).toBe(0);
  });

  it('must call listeners on value update', () => {
    const cb = jest.fn();

    const prop1 = new PInteger('', 0);
    const prop2 = new PInteger('', 0);

    const dprop = new DependentProperty<() => number>(
      'test property',
      () => prop1.get() + prop2.get()
    );

    dprop.onChange(cb);
    prop1.inc();

    expect(dprop.get()).toBe(1);
    expect(cb).toHaveBeenCalledTimes(1);
    expect(cb.mock.calls).toStrictEqual([[1, dprop]]);
  });

  it('must call listeners on value update', () => {
    const cb = jest.fn();

    const prop1 = new PInteger('', 0);
    const prop2 = new PInteger('', 0);

    const dprop = new DependentProperty<() => number>(
      'test property',
      () => prop1.get() + prop2.get()
    );

    dprop.onChange(cb);
    prop1.inc();

    expect(dprop.get()).toBe(1);
    expect(cb).toHaveBeenCalledTimes(1);
    expect(cb.mock.calls).toStrictEqual([[1, dprop]]);
  });

  it('must not call listeners after value update', () => {
    const cb = jest.fn();

    const prop1 = new PInteger('', 0);
    const prop2 = new PInteger('', 0);

    const dprop = new DependentProperty<() => number>(
      'test property',
      () => prop1.get() + prop2.get()
    );

    prop1.inc();
    dprop.onChange(cb);

    expect(dprop.get()).toBe(1);
    expect(cb).toHaveBeenCalledTimes(0);
    expect(cb.mock.calls).toStrictEqual([]);
  });

  it('must not call listeners with the same value', () => {
    const cb = jest.fn();

    const prop1 = new PInteger('', 0);
    const prop2 = new PInteger('', 0);

    const dprop = new DependentProperty<() => number>(
      'test property',
      () => prop1.get() + prop2.get()
    );

    dprop.onChange(cb);
    prop1.update();
    prop2.update();

    expect(dprop.get()).toBe(0);
    expect(cb).toHaveBeenCalledTimes(0);
    expect(cb.mock.calls).toStrictEqual([]);
  });
});

describe('Test functionality of object property', () => {
  beforeEach(() => {
    disableLogging();
  });

  it('must be able set value', () => {
    const prop = new PObject('test property', {});
    expect(prop.get()).toStrictEqual({});
  });

  it('must update set value', () => {
    const prop = new PObject('test property', {});
    prop.set({ test: 'data' });
    expect(prop.get()).toStrictEqual({ test: 'data' });
  });

  it('must call listeners on value update', () => {
    const cb = jest.fn();

    const prop = new PObject('test property', {});
    prop.onChange(cb);
    prop.set({ test: 'data' });

    expect(prop.get()).toStrictEqual({ test: 'data' });
    expect(cb).toHaveBeenCalledTimes(1);
    expect(cb.mock.calls).toStrictEqual([[{ test: 'data' }, prop]]);
  });

  it('must not call listeners after value update', () => {
    const cb = jest.fn();

    const prop = new PObject('test property', {});

    prop.set({ test: 'data' });
    prop.onChange(cb);

    expect(prop.get()).toStrictEqual({ test: 'data' });
    expect(cb).toHaveBeenCalledTimes(0);
    expect(cb.mock.calls).toStrictEqual([]);
  });

  it('must update set value as property', () => {
    const cb = jest.fn();
    const data = {
      test: 'data',
    };
    const prop = new PObject<Record<string, string>>('test property', data);
    prop.onChange(cb);
    prop.get().test = 'new-data';

    expect(prop.get()).toStrictEqual(data);
    expect(cb).toHaveBeenCalledTimes(1);
    expect(cb.mock.calls).toStrictEqual([[data, prop]]);
  });

  it('must update set value as property recursively', () => {
    const cb = jest.fn();
    const data = {
      test: {
        inner: 'data',
      },
    };

    const prop = new PObject<Record<string, Record<string, string>>>(
      'test property',
      data
    );
    prop.onChange(cb);
    prop.get().test.inner = 'new-data';

    expect(prop.get()).toStrictEqual(data);
    expect(cb).toHaveBeenCalledTimes(1);
    expect(cb.mock.calls).toStrictEqual([[data, prop]]);
  });
});

describe('Test functionality of list property', () => {
  beforeEach(() => {
    disableLogging();
  });

  it('must be able set value', () => {
    const prop = new PList('test property', []);
    expect(prop.get()).toStrictEqual([]);
  });

  it('must update set value', () => {
    const prop = new PList<string>('test property', []);
    prop.set(['new']);
    expect(prop.get()).toStrictEqual(['new']);
  });

  it('must call listeners on value update', () => {
    const cb = jest.fn();

    const prop = new PList<string>('test property', []);
    prop.onChange(cb);
    prop.set(['new']);

    expect(prop.get()).toStrictEqual(['new']);
    expect(cb).toHaveBeenCalledTimes(1);
    expect(cb.mock.calls).toStrictEqual([[['new'], prop]]);
  });

  it('must call listeners on value update', () => {
    const cb = jest.fn();

    const prop = new PList<string>('test property', []);
    prop.onChange(cb);
    prop.set(['new']);

    expect(prop.get()).toStrictEqual(['new']);
    expect(cb).toHaveBeenCalledTimes(1);
    expect(cb.mock.calls).toStrictEqual([[['new'], prop]]);
  });

  it('must update push value', () => {
    const cb = jest.fn();
    const prop = new PList<string>('test property', []);

    prop.onChange(cb);
    prop.push('new');

    expect(prop.get()).toStrictEqual(['new']);
    expect(cb).toHaveBeenCalledTimes(1);
    expect(cb.mock.calls).toStrictEqual([[['new'], prop]]);
  });

  it('must update pop value', () => {
    const cb = jest.fn();
    const prop = new PList<string>('test property', ['abc']);

    prop.onChange(cb);
    const result = prop.pop();

    expect(result).toBe('abc');
    expect(prop.get()).toStrictEqual([]);
    expect(cb).toHaveBeenCalledTimes(1);
    expect(cb.mock.calls).toStrictEqual([[[], prop]]);
  });

  it('must update set value', () => {
    const cb = jest.fn();
    const prop = new PList<string>('test property', ['abc']);

    prop.onChange(cb);
    prop.put(0, '123');

    expect(prop.get()).toStrictEqual(['123']);
    expect(cb).toHaveBeenCalledTimes(1);
    expect(cb.mock.calls).toStrictEqual([[['123'], prop]]);
  });
});

describe('Test functionality of observable list', () => {
  beforeEach(() => {
    disableLogging();
  });

  it('must be able set value', () => {
    const prop = new ObservableList('test property', []);
    expect(prop.length).toStrictEqual(0);
  });

  it('must update set value', () => {
    const prop = new ObservableList<string>('test property', []);
    prop.push('new');
    expect(prop.get(0)).toStrictEqual('new');
  });

  it('must call listeners on value push', () => {
    const cb = jest.fn();

    const prop = new ObservableList<string>('test property', []);
    prop.onPush(cb);
    prop.push('new');

    expect(prop.get(0)).toStrictEqual('new');
    expect(cb).toHaveBeenCalledTimes(1);
    expect(cb.mock.calls).toStrictEqual([[prop.getProp(0), 0]]);
  });

  it('must call listeners on value insert', () => {
    const cb = jest.fn();

    const prop = new ObservableList<string>('test property', []);
    prop.onInsert(cb);
    prop.insert(0, 'new');

    expect(prop.get(0)).toStrictEqual('new');
    expect(cb).toHaveBeenCalledTimes(1);
    expect(cb.mock.calls).toStrictEqual([[prop.getProp(0), 0]]);
  });

  it('must call listeners on value remove', () => {
    const cb = jest.fn();

    const prop = new ObservableList<string>('test property', ['new']);
    prop.onRemove(cb);
    prop.remove(0);

    expect(prop.length).toStrictEqual(0);
    expect(cb).toHaveBeenCalledTimes(1);
    expect(cb.mock.calls).toStrictEqual([[0]]);
  });
});
