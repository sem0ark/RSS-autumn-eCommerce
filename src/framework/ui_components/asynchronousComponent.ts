import { getId } from '../utilities/id';
import { trace, warn } from '../utilities/logging';
import { Component } from './component';

/**
 * `AsynchronousComponent` allows to place loadable data for the component. It is used to place `Promise`s into the component to be able to load some data, like images, etc.
 * It receives during the creation:
 * - `onComplete: () => Promise<Component>` - asynchronous function returning some component after waiting for some data to be loaded.
 * - optional: `onLoading: () => Component` - function returning some component shown while the `onComplete` function is still loading, useful to show a loader state. (default - blank component)
 * - optional: `onError: (err: Error) => Component` - function returning some component shown when the `onComplete` function fails to load due to some exception, useful to show an error state. (default - error message text)
 * - optional: `name = ''` - name the component, for debugging purposes.
 *
 */
export class AsynchronousComponent extends Component {
  private _node?: Node;

  private _state: string = 'loading';

  constructor(
    onComplete: () => Promise<Component>,
    private onLoading: () => Component,
    onError: (err: Error) => Component,
    private name: string = ''
  ) {
    super();
    if (!this.name) this.name = getId('AsynchronousComponent');

    onComplete()
      .then((component) => {
        this._state = 'complete';
        trace(`Completed loading component ${this}.`);
        const newNode = component.render(false);
        if (this._node)
          this._node.parentElement?.replaceChild(newNode, this._node);
        this._node = newNode;
      })
      .catch((e) => {
        this._state = 'error';
        warn(`Failed load component ${this}.`);
        const newNode = onError(e).render(false);
        if (this._node)
          this._node.parentElement?.replaceChild(newNode, this._node);
        this._node = newNode;
      });
  }

  public render(): Node {
    if (this._node) {
      trace(`Updating component ${this}, no re-creating.`);
      return this._node;
    }

    trace(`Recreating component ${this}`);
    const newNode = this.onLoading().render(false);

    this._node = newNode;
    return this._node;
  }

  public toString(): string {
    return `AsynchronousComponent[${this.name}][${this._state}]`;
  }

  public getNode() {
    return this._node;
  }
}
