/**
 * General Component interface, any component is some object, with `render` method, which will return a new DOM element.
 */
export abstract class Component {
  public abstract render(update: boolean, source?: Component): Node;

  public abstract toString(): string;
  public abstract getNode(): Node | undefined;
}
