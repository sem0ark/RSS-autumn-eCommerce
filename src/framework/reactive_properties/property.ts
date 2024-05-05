import { PropertyValueType } from './types';
import { debug } from '../utilities/logging';

export type PropertyHandler<T extends PropertyValueType> = (
  newValue: T,
  property: Property<T>
) => void;

// used to declaratively implement dependent reactive properties
const dependencies: Property<PropertyValueType>[][] = [];
export const pushDependenciesInitializer = () => dependencies.push([]);
export const popDependenciesInitializer = () => dependencies.pop();

export class Property<T extends PropertyValueType> {
  private listeners: PropertyHandler<T>[] = [];

  private value: T;

  constructor(
    public readonly name: string,
    private initial: T
  ) {
    this.value = initial;
  }

  public get(): T {
    if (dependencies.length > 0) {
      // to add itself into the set
      const ref = this as unknown as Property<PropertyValueType>;
      if (dependencies.at(-1)?.indexOf(ref) === -1)
        dependencies.at(-1)?.push(ref);
    }

    return this.value;
  }

  public set(newValue: T): void {
    if (newValue !== this.value || !Object.is(newValue, this.value)) {
      this.value = newValue;
      this.update();
    }
  }

  public update() {
    debug(`Updating property ${this.toString()} to`, this.value as object);
    this.listeners.forEach((l) => l(this.value, this));
  }

  public onChange(handler: PropertyHandler<T>) {
    this.listeners.push(handler);
    return this;
  }

  public reload() {
    this.set(this.initial);
  }

  public toString() {
    return `${this.name}{${this.value}}`;
  }

  public valueOf() {
    return this.get();
  }
}

export class PInteger extends Property<number> {
  public dec(v: number = 1) {
    this.set(this.get() - v);
  }

  public inc(v: number = 1) {
    this.set(this.get() + v);
  }
}

export class PBoolean extends Property<boolean> {
  public enable() {
    this.set(true);
  }

  public disable() {
    this.set(false);
  }

  public toggle() {
    this.set(!this.get());
  }
}

export class PList<T extends PropertyValueType> extends Property<T[]> {
  public readonly length: PInteger;

  constructor(
    public readonly name: string,
    initial: T[]
  ) {
    super(name, initial);
    this.length = new PInteger(name + '_length', initial.length);
  }

  public put(index: number, value: T) {
    this.get()[index] = value;
    this.update();
  }

  public push(value: T) {
    this.get().push(value);
    this.length.inc();
    this.update();
  }

  public pop() {
    if (this.length.get() > 0) {
      const value = this.get().pop();
      this.length.dec();
      this.update();
      return value;
    }
    return undefined;
  }

  public insert(index: number, value: T) {
    this.get().splice(index, 0, value);
    this.length.inc();
    this.update();
  }

  public clear() {
    this.get().length = 0;
    this.length.set(0);
  }
}

export class DependentProperty<
  T extends PropertyValueType[],
  R extends PropertyValueType,
> extends Property<PropertyValueType> {
  constructor(
    name: string,
    private updater: (...args: T) => R,
    private args?: T
  ) {
    pushDependenciesInitializer();

    super(name, updater(...((args || []) as T)));

    const collected = popDependenciesInitializer();
    collected?.forEach((dep) => dep.onChange(() => this.set()));
  }

  public set() {

    const newValue = this.updater(...((this.args || []) as T));
    debug(
      `Updating dependent property ${this.toString()} to`,
      newValue as object
    );
    super.set(newValue);
  }

  public get(): R {
    return super.get() as R;
  }
}

type RecursiveProxy<T> = T extends object
  ? {
      [K in keyof T]: RecursiveProxy<T[K]>;
    }
  : T;

function createRecursiveProxy<T extends object>(
  target: T,
  onChange: () => void
): RecursiveProxy<T> {
  const handler: ProxyHandler<T> = {
    get(_, prop: string) {
      const value = target[prop as keyof T];
      if (typeof value === 'object' && value !== null) {
        return createRecursiveProxy(value, onChange);
      }
      return value;
    },

    set(o, prop, value) {
      if (typeof value === 'object' && value !== null) {
        o[prop as keyof T] = createRecursiveProxy(value, onChange);
      } else {
        o[prop as keyof T] = value;
      }
      onChange();
      return true; // Indicates success
    },
  };

  return new Proxy(target, handler) as RecursiveProxy<T>;
}

export class PObject<T extends object> extends Property<object> {
  constructor(
    public readonly name: string,
    initial: object
  ) {
    super(
      name,
      createRecursiveProxy(initial, () => this.update())
    );
  }

  public get() {
    return super.get() as T;
  }
}
