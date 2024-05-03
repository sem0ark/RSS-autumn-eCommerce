import { PropertyValueType } from './types';
import { debug } from '../utilities/logging';

export type PropertyHandler<T extends PropertyValueType> = (
  newValue: T,
  oldValue: T | null,
  property: Property<T>
) => void;

// used to declaratively implement dependent reactive properties
const dependencies: Property<PropertyValueType>[] = [];
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
    if (creatingDependentProperty)
      dependencies.push(this as unknown as Property<PropertyValueType>);
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
  T extends PropertyValueType,
  K extends (...args: PropertyValueType[]) => T,
> extends Property<T> {
  constructor(
    name: string,
    initial: T,
    private updater: K,
    private args: Parameters<K>
  ) {
    super(name, initial);

    creatingDependentProperty = true;

    this.set();

    creatingDependentProperty = false;
    dependencies.forEach((dep) => dep.onChange(() => this.set()));
    dependencies.length = 0;
  }

  public set() {
    const newValue = this.updater(...this.args);
    debug(
      `Updating dependent property ${this.toString()} to`,
      newValue as object
    );
    super.set(newValue);
  }
}

export class PList<T extends PropertyValueType> extends Property<T[]> {
  public readonly length: PInteger;

  constructor(
    public readonly name: string,
    initial: T[]
  ) {
    super(name, initial);
    this.length = new PInteger(name + 'length', initial.length);
  }

  public push(value: T) {
    this.get().push(value);
    this.length.inc();
    this.update();
  }

  public pop() {
    if (this.length.get() > 0) {
      this.get().pop();
      this.length.dec();
      this.update();
    }
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
