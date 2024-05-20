import { trace } from '../utilities/logging';

import { Property } from '../reactive_properties/property';
import { Component } from './component';
import { FunctionalComponent } from './functionalComponent';

import { ObservableList } from '../reactive_properties/observable_list';
import { PropertyValueType } from '../reactive_properties/types';
import { getId } from '../utilities/id';

/**
 * Represents a component which will render a changing list of items.
 */
export class ListComponent<
  T extends PropertyValueType,
  K extends (PropertyValueType | Property<PropertyValueType>)[],
> extends Component {
  private _container: Node;

  private _components: Component[] = [];

  constructor(
    listProperty: ObservableList<T>,
    componentRenderer: (prop: Property<T>, ...args: K) => Component,
    private container: Component,
    private name: string | null = null,
    additionalParameters?: K
  ) {
    super();
    if (!this.name) this.name = getId('ListComponent');

    this._container = container.render(false);

    const createChild = (property: Property<T>) =>
      new FunctionalComponent(
        componentRenderer as (
          ...args: (PropertyValueType | Property<PropertyValueType>)[]
        ) => Component,
        name + '_element',
        [property, ...(additionalParameters || [])]
      );

    const pushChild = (property: Property<T>) => {
      trace(`Received Push ${property} on ${this}`);

      const component = createChild(property);
      this._components.push(component);
      this._container.appendChild(component.render(false));
    };

    listProperty.onInsert((property, index) => {
      trace(`Received Insert ${index} ${property} on ${this}`);

      if (index >= this._components.length) {
        pushChild(property);
        return;
      }

      const component = createChild(property);
      const newNode = component.render(false);
      const prevNode = this._components[index]?.getNode();

      if (prevNode !== undefined)
        this._container.insertBefore(newNode, prevNode);

      this._components.splice(index, 0, component);
    });

    listProperty.onRemove((index: number) => {
      trace(`Received Remove ${index} on ${this}`);
      const prevNode = this._components[index]?.getNode();

      if (prevNode) this._container.removeChild(prevNode);
      this._components.splice(index, 1);
    });

    listProperty.onPush(pushChild);
    listProperty.forEach(pushChild);
  }

  public render(): Node {
    return this._container;
  }

  public getNode(): Node | undefined {
    return this._container;
  }

  public toString(): string {
    return `ListComponent[${this.name}]`;
  }

  // used to still access methods for the container's functionality
  public getContainer() {
    return this.container;
  }
}
