import {
  popDependenciesInitializer,
  pushDependenciesInitializer,
} from '../reactive_properties/property';
import { PropertyValueType } from '../reactive_properties/types';
import { getId } from '../utilities/id';
import { trace } from '../utilities/logging';
import { Component } from './component';

export class FunctionalComponent<
  K extends (...args: PropertyValueType[]) => Component,
> extends Component {
  private _node?: Node;

  constructor(
    private renderer: K,
    private name: string | null = null,
    private args?: Parameters<K>
  ) {
    super();
    if (!this.name) this.name = getId('FunctionalComponent');

    pushDependenciesInitializer();

    trace(`Creating component ${this}`);
    this._node = this.render();

    const collected = popDependenciesInitializer();
    collected?.forEach((dep) =>
      dep.onChange(() => {
        this.render(true, this);
      })
    );
  }

  public render(update: boolean = false, source?: Component): Node {
    if (this !== source && update && this._node) {
      trace(`Updating component ${this}, no re-creating.`);
      return this._node;
    }

    trace(`Recreating component ${this}`);
    const newNode = this.renderer(...(this.args || [])).render(update, source); // create a new element

    if (this._node) {
      this._node.parentElement?.replaceChild(newNode, this._node);
    }

    this._node = newNode;
    return this._node;
  }

  public toString(): string {
    return `FunctionalComponent[${this.name}]`;
  }

  public getNode() {
    return this._node;
  }
}
