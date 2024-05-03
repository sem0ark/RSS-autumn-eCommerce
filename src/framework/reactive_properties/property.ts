import { PropertyValueType } from './types';
import { debug } from '../utilities/logging';

export type PropertyHandler<T extends PropertyValueType> = (
  newValue: T,
  oldValue: T | null,
  property: Property<T>
) => void;

// used to declaratively implement dependent reactive properties
const dependencies: Set<Property<PropertyValueType>> = new Set();
let creatingDependentProperty: boolean = false;

export class Property<T extends PropertyValueType> {
  private listeners: PropertyHandler<T>[] = [];

  private previousValue: T | null = null;

  private value: T;

  constructor(
    public readonly name: string,
    private initial: T
  ) {
    this.value = initial;
  }

  public get(): T {
    if (creatingDependentProperty) {
      // to add itself into the set
      const ref = this as unknown as Property<PropertyValueType>;
      if (!dependencies.has(ref)) dependencies.add(ref);
    }

    return this.value;
  }

  public set(newValue: T): void {
    if (newValue !== this.value || !Object.is(newValue, this.value)) {
      this.previousValue = this.value;
      this.value = newValue;
      this.update();
    }
  }

  public update() {
    debug(`Updating property ${this.toString()} to`, this.value as object);
    this.listeners.forEach((l) => l(this.value, this.previousValue, this));
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

export class DependentProperty<
  K extends (...args: PropertyValueType[]) => PropertyValueType,
> extends Property<PropertyValueType> {
  constructor(
    name: string,
    private updater: K,
    private args?: Parameters<K>
  ) {
    creatingDependentProperty = true;

    super(name, updater(...(args || [])));

    creatingDependentProperty = false;
    dependencies.forEach((dep) => dep.onChange(() => this.set()));
    dependencies.clear();
  }

  public set() {
    const newValue = this.updater(...(this.args || []));
    debug(
      `Updating dependent property ${this.toString()} to`,
      newValue as object
    );
    super.set(newValue);
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

export class PObject extends Property<object> {
  constructor(
    public readonly name: string,
    initial: object
  ) {
    super(name, initial);
    this.set(createRecursiveProxy(this.get(), () => this.update()));
  }
}
