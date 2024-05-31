import { log } from '../utilities/logging';
import { PropertyValueType } from '../reactive_properties/types';
import { Property } from '../reactive_properties/property';

export class Storage {
  constructor(private prefix: string = '') {}

  public registerProperty<T extends PropertyValueType>(property: Property<T>) {
    this.loadProperty(property);
    property.onChange(() => this.saveProperty(property));
    return property;
  }

  private saveProperty<T extends PropertyValueType>(property: Property<T>) {
    log(`Saving property ${property} to LocalStorage`);

    if (property.get() === null || property.get() === undefined) {
      localStorage.removeItem(this.getPropertyName(property));
    } else {
      localStorage.setItem(
        this.getPropertyName(property),
        JSON.stringify(property.get())
      );
    }
  }

  private loadProperty<T extends PropertyValueType>(property: Property<T>) {
    const loaded = this.getProperty(property);
    if (loaded === null) return;
    property.set(loaded);
  }

  private getProperty<T extends PropertyValueType>(
    property: Property<T>
  ): T | null {
    log(`Trying to load property ${property} from LocalStorage`);

    const existing = localStorage.getItem(this.getPropertyName(property));

    if (existing === null || existing === 'undefined') return null;

    log(`Found value for ${property.name} = ${existing}`);
    return JSON.parse(existing);
  }

  private getPropertyName<T extends PropertyValueType>(property: Property<T>) {
    return `${this.prefix}:${property.name}`;
  }
}
