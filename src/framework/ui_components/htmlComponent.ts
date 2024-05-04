import { Component } from './component';
import { PBoolean, Property } from '../reactive_properties/property';
import { PropertyValueType } from '../reactive_properties/types';
import { getId } from '../utilities/id';

import { TextComponent } from './textComponent';
import { trace } from '../utilities/logging';

export class HTMLComponent extends Component {
  private _id?: string;

  private _tag: string = 'div';

  private _classList: string[] = [];

  private _attributes: Record<string, string> = {};

  private _styles: Record<string, string> = {};

  private _children: Component[] = [];

  private _handlers: Record<string, ((e: Event) => void)[]> = {};

  private _node?: HTMLElement;

  constructor(...children: Component[]) {
    super();
    this.add(...children);
  }

  private _prevToggledClasses: Record<string, string[]> = {};

  public propClass<T extends PropertyValueType>(
    prop: Property<T>,
    resolver: (v: T) => string[] | string
  ) {
    const id = getId(prop.name);

    prop.onChange((v) => {
      if (!this._node) return;
      const newClasses = resolver(v);

      this._node?.classList.remove(...this._prevToggledClasses[id]);
      this._node?.classList.add(...newClasses);
      this._prevToggledClasses[id] =
        typeof newClasses === 'string' ? [newClasses] : newClasses;
    });

    const newClasses = resolver(prop.get());
    this._prevToggledClasses[id] =
      typeof newClasses === 'string' ? [newClasses] : newClasses;
    this._classList.push(...newClasses);

    return this;
  }

  public propAttr<T extends PropertyValueType>(
    prop: Property<T>,
    attributeName: string,
    resolver: (newValue: T) => string
  ) {
    prop.onChange((n) => {
      if (this._node) this._node.setAttribute(attributeName, resolver(n));
      else this.attr(attributeName, resolver(n));
    });

    return this;
  }

  public if(
    predicate: boolean,
    thenApply: (c: HTMLComponent) => void,
    otherwiseApply?: (c: HTMLComponent) => void
  ) {
    if (predicate) thenApply(this);
    else if (otherwiseApply) otherwiseApply(this);
    return this;
  }

  public on(
    name: string,
    handler: (e: Event) => void,
    preventDefault = true,
    stopPropagation = true
  ) {
    const updatedHandler = (e: Event) => {
      if (preventDefault) e.preventDefault();
      else if (stopPropagation) e.stopPropagation();
      else handler(e);

      if (preventDefault) return false;
      return true;
    };

    if (this._handlers[name] === undefined) this._handlers[name] = [];
    this._handlers[name].push(updatedHandler);

    return this;
  }

  public onClick(
    handler: (e: Event) => void,
    preventDefault = true,
    stopPropagation = true
  ) {
    this.on('click', handler, preventDefault, stopPropagation);
    return this;
  }

  public onRClick(
    handler: (e: Event) => void,
    preventDefault = true,
    stopPropagation = true
  ) {
    this.on('contextmenu', handler, preventDefault, stopPropagation);
    return this;
  }

  public onInput(
    handler: (e: InputEvent) => void,
    preventDefault = true,
    stopPropagation = true
  ) {
    this.on(
      'input',
      handler as (e: Event) => void,
      preventDefault,
      stopPropagation
    );
    return this;
  }

  public onInputValue(
    handler: (data: string) => void,
    preventDefault = true,
    stopPropagation = true
  ) {
    this.on(
      'input',
      (e: Event) => handler((e.target as HTMLInputElement).value),
      preventDefault,
      stopPropagation
    );
    return this;
  }

  public onChange(
    handler: (e: InputEvent) => void,
    preventDefault = true,
    stopPropagation = true
  ) {
    this.on(
      'change',
      handler as (e: Event) => void,
      preventDefault,
      stopPropagation
    );
    return this;
  }

  public onSubmit(
    handler: (e: SubmitEvent) => void,
    preventDefault = true,
    stopPropagation = true
  ) {
    this.on(
      'submit',
      handler as (e: Event) => void,
      preventDefault,
      stopPropagation
    );
    return this;
  }

  public onKeypress(
    handler: (key: string) => void,
    preventDefault = false,
    stopPropagation = true
  ) {
    this.on(
      'keydown',
      (e: Event) => handler((e as KeyboardEvent).key),
      preventDefault,
      stopPropagation
    );
    return this;
  }

  public add(...children: Component[]) {
    this._children.push(...children);
    return this;
  }

  public text(txt: string) {
    this._children.push(new TextComponent(txt));
    return this;
  }

  public cls(...classes: string[]) {
    this._classList.push(...classes);
    return this;
  }

  public tag(tag: string) {
    this._tag = tag;
    return this;
  }

  public id(id: string) {
    this._id = id;
    return this;
  }

  public attr(name: string, value: string = '') {
    this._attributes[name] = value;
    return this;
  }

  public style(name: string, value: string = '') {
    this._styles[name] = value;
    return this;
  }

  public render(update: boolean = false, source?: Component): Node {
    trace(`Rendering ${this}`);

    const result = document.createElement(this._tag);

    if (this._id) result.id = this._id;

    if (this._classList.length) result.classList.add(...this._classList);

    if (this._attributes) {
      Object.entries(this._attributes).forEach(([k, v]) => {
        result.setAttribute(k, v);
      });
    }

    if (this._styles)
      Object.entries(this._styles).forEach(([k, v]) => {
        result.style.setProperty(k, v);
      });

    if (this._handlers)
      Object.entries(this._handlers).forEach(([k, v]) => {
        v.forEach((h) => result.addEventListener(k, h));
      });

    if (this._children)
      this._children.forEach((ch: Component) => {
        result.appendChild(ch.render(update, source));
      });

    this._node = result;

    setTimeout(
      () =>
        this.renderListeners.forEach((l) => (this._node ? l(this._node) : '')),
      0.01
    );

    return result;
  }

  public toString(): string {
    return `HTMLComponent tag[${this._tag}], class[${this._classList}]`;
  }

  // All Apply methods are used after the element was created already
  // it is useful because we won't need to use ID selection through DOM

  public propNode<T extends PropertyValueType>(
    prop: Property<T>,
    resolver: (node: HTMLElement, newValue: T) => void
  ) {
    prop.onChange((n) => {
      if (this._node) resolver(this._node, n);
    });

    return this;
  }

  public applyStyle(name: string, value: string = '') {
    if (this._node) this._node.style.setProperty(name, value);
    return this;
  }

  public applyAttr(name: string, value: string = '') {
    if (this._node) this._node.setAttribute(name, value);
    return this;
  }

  public getNode() {
    return this._node;
  }

  private renderListeners: ((n: HTMLElement) => void)[] = [];

  public onRender(handler: (n: HTMLElement) => void) {
    this.renderListeners.push(handler);
    return this;
  }

  private pVisible: PBoolean | null = null;

  private static isVisible(el: HTMLElement) {
    const rect = el.getBoundingClientRect();
    const docEl = document.documentElement;
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || docEl.clientHeight) &&
      rect.right <= (window.innerWidth || docEl.clientWidth)
    );
  }

  public onVisibilityChange(handler: (visible: boolean) => void) {
    if (!this.pVisible) {
      this.pVisible = new PBoolean((this._id || '') + 'pVisible', false);

      const updateVisibility = () => {
        const curNode = this.getNode();
        if (curNode) this.pVisible?.set(HTMLComponent.isVisible(curNode));
      };

      window.addEventListener('load', updateVisibility, false);
      window.addEventListener('scroll', updateVisibility, false);
      window.addEventListener('resize', updateVisibility, false);

      this.onRender((n) => {
        n.parentElement?.addEventListener('load', updateVisibility, false);
        n.parentElement?.addEventListener('scroll', updateVisibility, false);
        n.parentElement?.addEventListener('resize', updateVisibility, false);
        updateVisibility();
      });
    }

    this.pVisible.onChange(handler);
  }

  public onAppear(handler: () => void) {
    this.onVisibilityChange((visible) => {
      if (visible) handler();
    });
    return this;
  }

  public onDisappear(handler: () => void) {
    this.onVisibilityChange((visible) => {
      if (!visible) handler();
    });
    return this;
  }
}
