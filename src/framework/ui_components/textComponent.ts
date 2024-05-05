import { Component } from './component';

export class TextComponent extends Component {
  private _node: Node;

  constructor(private text: string) {
    super();
    this._node = document.createTextNode(this.text);
  }

  public render(): Node {
    return this._node;
  }

  public toString(): string {
    return `TextComponent[${this.text}]`;
  }

  public getNode() {
    return this._node;
  }
}
