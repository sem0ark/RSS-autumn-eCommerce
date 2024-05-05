import { Property, PInteger } from './property';
import { PropertyValueType } from './types';

export type OListRemoveHandler = (index: number) => void;
export type OListInsertHandler<T extends PropertyValueType> = (
  property: Property<T>,
  index: number
) => void;

export type OListPushHandler<T extends PropertyValueType> = (
  property: Property<T>,
  index: number
) => void;

export class ObservableList<T extends PropertyValueType> {
  private insertHandlers: OListInsertHandler<T>[] = [];

  private pushHandlers: OListPushHandler<T>[] = [];

  private removeHandlers: OListRemoveHandler[] = [];

  private _properties: Property<T>[] = [];

  public readonly pLength: PInteger;

  constructor(
    private name: string,
    entries?: T[]
  ) {
    this.pLength = new PInteger('pLength', this._properties.length);
    if (entries) entries.forEach((v) => this.push(v));
  }

  public get length() {
    return this._properties.length;
  }

  public onInsert(handler: OListInsertHandler<T>) {
    this.insertHandlers.push(handler);
  }

  public onPush(handler: OListPushHandler<T>) {
    this.pushHandlers.push(handler);
  }

  public onRemove(handler: OListRemoveHandler) {
    this.removeHandlers.push(handler);
  }

  public getProp(index: number) {
    return this._properties[index];
  }

  public get(index: number) {
    return this._properties[index].get();
  }

  public setProp(index: number, prop: Property<T>) {
    this._properties[index] = prop;
  }

  public set(index: number, value: T) {
    this._properties[index].set(value);
  }

  public insert(index: number, value: T) {
    const property = new Property<T>('', value);

    this._properties.splice(index, 0, property);
    this.insertHandlers.forEach((h) => h(property, index));
    this.pLength.set(this._properties.length);

    return property;
  }

  public push(value: T) {
    const property = new Property<T>(`${this.name}_listProperty`, value);

    this._properties.push(property);
    this.pushHandlers.forEach((h) => h(property, this._properties.length - 1));
    this.pLength.set(this._properties.length);

    return property;
  }

  public remove(index: number) {
    this.removeHandlers.forEach((h) => h(index));
    this._properties.splice(index, 1);
    this.pLength.set(this._properties.length);
  }

  public removeByProperty(property: Property<T>) {
    const index = this._properties.indexOf(property);
    if (index !== -1) this.remove(index);
  }

  public removeByValue(value: T) {
    const index = this._properties.map((p) => p.get()).indexOf(value);
    if (index !== -1) this.remove(index);
  }

  public clear() {
    while (this.length > 0) this.remove(0);
  }

  public forEach(cb: (v: Property<T>, i: number, lst: Property<T>[]) => void) {
    this._properties.forEach(cb);
  }

  public map<K>(cb: (v: Property<T>, i: number) => K) {
    return this._properties.map(cb);
  }

  public toString(): string {
    return `ObservableList_${this.name}`;
  }

  public filter(filterFunction: (value: T, index: number) => boolean) {
    for (let i = 0; i < this._properties.length; i++) {
      if (filterFunction(this._properties[i].get(), i)) this.remove(i--);
    }
  }
}
