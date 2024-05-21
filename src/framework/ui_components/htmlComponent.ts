import { Component } from './component';
import { PBoolean, Property } from '../reactive_properties/property';
import { PropertyValueType } from '../reactive_properties/types';
import { getId } from '../utilities/id';

import { TextComponent } from './textComponent';
import { trace } from '../utilities/logging';
import { ListComponent } from './listComponent';
import { ObservableList } from '../reactive_properties/observable_list';

export type CC = (Component | string | number | boolean)[];

/**
 * HTML Component will represents the functionality of the actual DOM `HTMLElement`
 * with additional functionality for tackling reactivity. Will be rendered as plain HTMLElement with additional metadata.
 *
 */
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

  /**
   * Utility function for creating ListComponent with the container being the current HTML Component.
   *
   * @param listProperty ObservableList instance used in the component.
   * @param componentRenderer Function, which will receive current list's property attached to the current list component and additional arguments if provided.
   * @param additionalParameters Optional, add some other arguments to the function rendering the list item.
   * @param name Optional, name the component for debugging and logging purposes.
   * @returns new List Component instance
   */
  public list<
    T extends PropertyValueType,
    K extends (PropertyValueType | Property<PropertyValueType>)[],
  >(
    listProperty: ObservableList<T>,
    componentRenderer: (prop: Property<T>, ...args: K) => Component,
    additionalParameters?: K,
    name: string | null = null
  ) {
    return new ListComponent<T, K>(
      listProperty,
      componentRenderer,
      this,
      name,
      additionalParameters
    );
  }

  private _prevToggledClasses: Record<string, string[]> = {};

  /**
   * Update Component's `classList` in runtime based on current property value.
   * Note: to avoid undefined behavior, set some class for a specific component in only one call to this method.
   *
   * @param prop `Property<T>` some property, to listen to for updating a list of classes
   * @param resolver `(value: T) => string[]` function receiving current property value and returning, which classes to set
   * @returns The same instance to allow chaining operations.
   */
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

  /**
   * Update Component's HTML attribute value in runtime based on current property value.
   *
   * @param prop `Property<T>` some property, to listen to for updating a list of classes
   * @param resolver `(value: T) => string` function receiving current property value and returning a new attribute value
   * @returns The same instance to allow chaining operations.
   */
  public propAttr<T extends PropertyValueType>(
    prop: Property<T>,
    attributeName: string,
    resolver: (newValue: T) => string = (v) => `${v}`
  ) {
    prop.onChange((n) => {
      if (this._node) this._node.setAttribute(attributeName, resolver(n));
      else this.attr(attributeName, resolver(n));
    });

    const initial = resolver(prop.get());
    this.onRender(() => this._node?.setAttribute(attributeName, initial));

    return this;
  }

  /**
   * Utility function for adding branching in the chaining methods, based on the boolean value of `predicate` apply the given methods to the component.
   *
   * @param prop `Property<T>` some property, to listen to for updating a list of classes
   * @param resolver `(value: T) => string` function receiving current property value and returning a new attribute value
   * @param predicate Boolean value used to determine which values to use.
   * @param thenApply Callback applying additional methods to the component if `predicate` is `true`
   * @param otherwiseApply Optional, callback applying additional methods to the component if `predicate` is `false`
   * @returns The same instance to allow chaining operations.
   */
  public if(
    predicate: boolean,
    thenApply: (c: HTMLComponent) => void,
    otherwiseApply?: (c: HTMLComponent) => void
  ) {
    if (predicate) thenApply(this);
    else if (otherwiseApply) otherwiseApply(this);
    return this;
  }

  /**
   *
   * @param name name of HTMLElement event
   * @param handler callback handling the received Event
   * @param preventDefault = true Optional, add preventDefault() call to the addEventListener method
   * @param stopPropagation = true Optional, add stopPropagation() to the addEventListener method
   * @returns
   */
  public on(
    name: string,
    handler: (e: Event) => void,
    preventDefault = true,
    stopPropagation = true
  ) {
    const updatedHandler = (e: Event) => {
      if (preventDefault) e.preventDefault();
      if (stopPropagation) e.stopPropagation();

      handler(e);

      return preventDefault;
    };

    if (this._handlers[name] === undefined) this._handlers[name] = [];
    this._handlers[name].push(updatedHandler);

    return this;
  }

  /**
   * Add on click event listener
   * @param handler
   * @param preventDefault
   * @param stopPropagation
   * @returns
   */
  public onClick(
    handler: (e: Event) => void,
    preventDefault = true,
    stopPropagation = false
  ) {
    this.on('click', handler, preventDefault, stopPropagation);
    return this;
  }

  /**
   * Add on contextmenu event listener
   * @param handler
   * @param preventDefault
   * @param stopPropagation
   * @returns
   */
  public onRClick(
    handler: (e: Event) => void,
    preventDefault = true,
    stopPropagation = false
  ) {
    this.on('contextmenu', handler, preventDefault, stopPropagation);
    return this;
  }

  /**
   * Add on input event listener
   * @param handler
   * @param preventDefault
   * @param stopPropagation
   * @returns
   */
  public onInput(
    handler: (e: InputEvent) => void,
    preventDefault = false,
    stopPropagation = false
  ) {
    this.on(
      'input',
      handler as (e: Event) => void,
      preventDefault,
      stopPropagation
    );
    return this;
  }

  /**
   * Utility function, which will addEventListener on input event and call callback function with the actual full text value being entered
   *
   * @param handler `(string) => void` handling text input
   * @param preventDefault
   * @param stopPropagation
   * @returns
   */
  public onInputValue(
    handler: (data: string) => void,
    preventDefault = false,
    stopPropagation = false
  ) {
    this.on(
      'input',
      (e: Event) => handler((e.target as HTMLInputElement).value),
      preventDefault,
      stopPropagation
    );
    return this;
  }

  /**
   * Add on change event listener
   * @param handler
   * @param preventDefault
   * @param stopPropagation
   * @returns
   */
  public onChange(
    handler: (e: InputEvent) => void,
    preventDefault = false,
    stopPropagation = false
  ) {
    this.on(
      'change',
      handler as (e: Event) => void,
      preventDefault,
      stopPropagation
    );
    return this;
  }

  /**
   * Add on submit event listener
   * @param handler
   * @param preventDefault
   * @param stopPropagation
   * @returns
   */
  public onSubmit(
    handler: (e: SubmitEvent) => void,
    preventDefault = true,
    stopPropagation = false
  ) {
    this.on(
      'submit',
      handler as (e: Event) => void,
      preventDefault,
      stopPropagation
    );
    return this;
  }

  /**
   * Add on keydown event listener
   * @param handler
   * @param preventDefault
   * @param stopPropagation
   * @returns
   */
  public onKeypress(
    handler: (key: string) => void,
    preventDefault = false,
    stopPropagation = false
  ) {
    this.on(
      'keydown',
      (e: Event) => handler((e as KeyboardEvent).key),
      preventDefault,
      stopPropagation
    );
    return this;
  }

  /**
   * Add sub-components to the current HTML component
   * @param children Children components to be added to the HTML Component
   * @returns
   */
  public add(...children: Component[]) {
    this._children.push(...children);
    return this;
  }

  /**
   * Add sub-components to the start of the current HTML component
   * @param children Children components to be added to the HTML Component
   * @returns
   */
  public addBefore(...children: Component[]) {
    this._children.unshift(...children);
    return this;
  }

  /**
   * Sequentially (in the same order as the methods were called) add text entry inside the HTML component, will render it as an added TextNode.
   * @param txt Some text data
   * @returns
   */
  public text(txt: string) {
    this._children.push(new TextComponent(txt));
    return this;
  }

  /**
   * Add classes to the component's `classList`
   * @param classes List of classes to add to the HTML Component's classList on render.
   * @returns
   */
  public cls(...classes: string[]) {
    this._classList.push(...classes);
    return this;
  }

  /**
   * Set a new tag value for the component.
   * @param tag
   * @returns
   */
  public tag(tag: string) {
    this._tag = tag;
    return this;
  }

  /**
   * Add HTMLElement ID to the component. Set an `id=` value for the HTML component.
   * @param id
   * @returns
   */
  public id(id: string) {
    this._id = id;
    return this;
  }

  /**
   * Set attribute value to the component
   * @param name name of the attribute
   * @param value string value of the attribute
   * @returns
   */
  public attr(name: string, value: string = '') {
    this._attributes[name] = value;
    return this;
  }

  /**
   * Add inline styles to the component
   * @param name style type name
   * @param value style text value
   * @returns
   */
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

    // wait until the node appears in the DOM
    setTimeout(
      () =>
        this.renderListeners.forEach((l) => (this._node ? l(this._node) : '')),
      10
    );

    return result;
  }

  public clone(): HTMLComponent {
    const result = new HTMLComponent();

    if (this._id) result.id(this._id);
    if (this._classList) result.cls(...this._classList);
    if (this._attributes) result._attributes = { ...this._attributes };
    if (this._styles) result._styles = { ...this._styles };
    if (this._handlers) {
      result._handlers = {};
      Object.getOwnPropertyNames(this._handlers).forEach((k) => {
        result._handlers[k] = [...this._handlers[k]];
      });
    }

    return result;
  }

  public toString(): string {
    return `HTMLComponent tag[${this._tag}], class[${this._classList}]`;
  }

  // All Apply methods are used after the element was created already
  // it is useful because we won't need to use ID selection through DOM

  /**
   * Add a listener to the specified property to apply some callback to the rendered HTMLElement on any change of the property.
   * @param prop
   * @param resolver `(node: HTMLElement, newValue: T) => void`
   * @returns
   */
  public propNode<T extends PropertyValueType>(
    prop: Property<T>,
    resolver: (node: HTMLElement, newValue: T) => void
  ) {
    prop.onChange((n) => {
      if (this._node) resolver(this._node, n);
    });

    return this;
  }

  /**
   * Set style value to the already rendered HTML Element
   * @param name
   * @param value
   * @returns
   */
  public applyStyle(name: string, value: string = '') {
    if (this._node) this._node.style.setProperty(name, value);
    return this;
  }

  /**
   * Set attribute value to the already rendered HTML Element
   * @param name
   * @param value
   * @returns
   */
  public applyAttr(name: string, value: string = '') {
    if (this._node) this._node.setAttribute(name, value);
    return this;
  }

  /**
   * Apply style value to the already rendered HTML Element
   * @returns Rendered HTML Element Node if rendered, else null
   */
  public getNode() {
    return this._node;
  }

  private renderListeners: ((n: HTMLElement) => void)[] = [];

  /**
   * Apply a callback to the HTML Element, when component gets rendered.
   * @param handler Callback applied to the rendered HTMLElement, when it gets rendered.
   * @returns
   */
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

  /**
   * Apply some actions, when the rendered component changes its visibly in the viewport.
   * @param handler
   */
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

  /**
   * Apply some actions, when the rendered component becomes visible in the viewport.
   * @param handler
   */
  public onAppear(handler: () => void) {
    this.onVisibilityChange((visible) => {
      if (visible) handler();
    });
    return this;
  }

  /**
   * Apply some actions, when the rendered component disappears from the viewport (no longer visible).
   * @param handler
   */
  public onDisappear(handler: () => void) {
    this.onVisibilityChange((visible) => {
      if (!visible) handler();
    });
    return this;
  }
}
