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

/**
 * Class in change of implementing observable properties, which contain:
 * - `get` get current value of the property
 * - `set` set a new value of a property
 * - `onChange` - register a callback to be run on any new set value of the property
 */
export class Property<T extends PropertyValueType> {
  private listeners: PropertyHandler<T>[] = [];

  private value: T;

  constructor(
    public readonly name: string,
    private initial: T
  ) {
    this.value = initial;
  }

  /**
   * Get current value of the property, will be used to automatically register dependent properties and functional components.
   * @returns value of the property at the moment.
   */
  public get(): T {
    if (dependencies.length > 0) {
      // to add itself into the set
      const ref = this as unknown as Property<PropertyValueType>;
      if (dependencies.at(-1)?.indexOf(ref) === -1)
        dependencies.at(-1)?.push(ref);
    }

    return this.value;
  }

  /**
   * Set a new value for the property, if value is not the same as in the property, all registered callbacks will be called.
   * @param newValue new value of the property to set.
   */
  public set(newValue: T): void {
    if (newValue !== this.value || !Object.is(newValue, this.value)) {
      this.value = newValue;
      this.update();
    }
  }

  /**
   * Directly call all registered listeners.
   */
  public update() {
    debug(`Updating property ${this.toString()} to`, this.value as object);
    this.listeners.forEach((l) => l(this.value, this));
  }

  /**
   * Register a callback to be run on any new set value of the property.
   * @param handler - function of type `(newValue, property) => void`
   * @returns same instance of the property to allow chaining operations
   */
  public onChange(handler: PropertyHandler<T>) {
    this.listeners.push(handler);
    return this;
  }

  /**
   * Set the property value to initial value.
   */
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

/**
 * Wrapper for integer type property with additional methods:
 * - `inc(step = 1)` - increase property by some number (default 1)
 * - `dec(step = 1)` - decrease property by some number (default 1)
 */
export class PInteger extends Property<number> {
  /**
   * Works like `-=` decreasing the property value by some number
   * @param value - number, by which the value of the property will be decreased
   */
  public dec(value: number = 1) {
    this.set(this.get() - value);
  }

  /**
   * Works like `+=` increasing the property value by some number
   * @param value - number, by which the value of the property will be increased
   */
  public inc(value: number = 1) {
    this.set(this.get() + value);
  }
}

/**
 * Wrapper class for boolean type property with additional methods:
 * - `enable` set property value to `true`
 * - `disable` set property value to `false`
 * - `toggle` toggle current value of the property, works like `value = !value`
 */
export class PBoolean extends Property<boolean> {
  /**
   * set property value to `true`
   */
  public enable() {
    this.set(true);
  }

  /**
   * set property value to `false`
   */
  public disable() {
    this.set(false);
  }

  /**
   * toggle current value of the property, works like `value = !value`
   */
  public toggle() {
    this.set(!this.get());
  }
}

/**
 * Wrapper class for list type property with additional methods:
 * - `push(value)` add a new value to the end of the list and call all `onChange` callbacks
 * - `pop()` take last value to the end of the list and call all `onChange` callbacks
 * - `insert(index, value)` insert a new value at specified index and call all `onChange` callbacks
 * - `put(index, value)` set a new value for specified index and call all `onChange` callbacks
 * - `push` add a new value to the end of the list and call all `onChange` callbacks
 * - `clear` remove all entries from the list
 */
export class PList<T extends PropertyValueType> extends Property<T[]> {
  public readonly length: PInteger;

  constructor(
    public readonly name: string,
    initial: T[]
  ) {
    super(name, initial);
    this.length = new PInteger(name + '_length', initial.length);
  }

  /**
   * Set a new value for specified index and call all `onChange` callbacks
   *
   * @param index number
   * @param value T
   */
  public put(index: number, value: T) {
    this.get()[index] = value;
    this.update();
  }

  /**
   * add a new value to the end of the list and call all `onChange` callbacks
   * @param value
   */
  public push(value: T) {
    this.get().push(value);
    this.length.inc();
    this.update();
  }

  /**
   * take last value to the end of the list and call all `onChange` callbacks
   * @returns value remove from the end of the list
   */
  public pop() {
    if (this.length.get() > 0) {
      const value = this.get().pop();
      this.length.dec();
      this.update();
      return value;
    }
    return undefined;
  }

  /**
   * insert a new value at specified index and call all `onChange` callbacks
   *
   * @param index
   * @param value
   */
  public insert(index: number, value: T) {
    this.get().splice(index, 0, value);
    this.length.inc();
    this.update();
  }

  /**
   * remove all entries from the list
   */
  public clear() {
    this.get().length = 0;
    this.length.set(0);
  }
}

/**
 * Property class, which will create a new observable property as a function of some other properties,
 * which will work as a function using some properties and returning a new value.
 *
 * new DependentProperty("property_name_sum_of_two_properties", (other_param) => prop1.get() + prop2.get(), [2])
 * Note: need to use `.get()` to get properties registered.
 */
export class DependentProperty<
  T extends PropertyValueType[],
  R extends PropertyValueType,
> extends Property<PropertyValueType> {
  /**
   *
   * @param name Name of the property, useful for logging and debugging.
   * @param updater Function, which will update the value of the property, such as
   * @param args Optional, to pass some additional arguments to the updater function.
   */
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

  /**
   * Run update on property value. Triggered automatically on any used property update.
   */
  public set() {
    const newValue = this.updater(...((this.args || []) as T));
    debug(
      `Updating dependent property ${this.toString()} to`,
      newValue as object
    );
    super.set(newValue);
  }

  public get(): R {
    super.get();
    return this.updater(...((this.args || []) as T));
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

/**
 * Wrapper for object type property with additional functionality.
 * Property will contain an object and adding/changes to any of its fields will automatically trigger `onChange` callbacks
 */
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
