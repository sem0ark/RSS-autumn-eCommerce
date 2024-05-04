export abstract class Component {
  public abstract render(update: boolean, source?: Component): Node;

  public abstract toString(): string;
  public abstract getNode(): Node | undefined;
}
