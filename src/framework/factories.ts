import { getId } from './utilities/id';

import { PropertyValueType } from './reactive_properties/types';
import {
  DependentProperty,
  PBoolean,
  PInteger,
  PList,
  PObject,
  Property,
} from './reactive_properties/property';

import { Component } from './ui_components/component';
import { AsynchronousComponent } from './ui_components/asynchronousComponent';
import { HTMLComponent } from './ui_components/htmlComponent';
import { FunctionalComponent } from './ui_components/functionalComponent';
import { TextComponent } from './ui_components/textComponent';

// Property Factories

/**
 * Class in change of implementing observable properties, which contain:
 * - `get` get current value of the property
 * - `set` set a new value of a property
 * - `onChange` - register a callback to be run on any new set value of the property
 *
 * @param initial Set initial (default) value of the property
 * @param name Optional, set a name for the property, useful for logging and debugging
 * @returns New `Property` instance.
 *
 * ```typescript
 * import { factories } from 'factories';
 * const prop = factories.property<string>("initial value");
 *
 * prop.onChange((newValue, property) => {
 *   console.log(`Changed to ${newValue}`);
 * });
 *
 * prop.set('new-value');
 * // will also log "Changed to new-value"
 * ```
 *
 */
function property<T extends PropertyValueType>(initial: T, name?: string) {
  if (!name) name = getId('Property');
  return new Property(name, initial);
}

/**
 * Wrapper for integer type property with additional methods:
 * - `inc(step = 1)` - increase property by some number (default 1)
 * - `dec(step = 1)` - decrease property by some number (default 1)
 *
 * @param initial Set initial (default) value of the property
 * @param name Optional, set a name for the property, useful for logging and debugging
 * @returns New `PInteger` instance.
 *
 * ```typescript
 * import { factories } from '...factories';
 * const prop = factories.pinteger(0);
 *
 * prop.onChange((newValue, property) => {
 *   console.log(`Changed to ${newValue}`);
 * });
 *
 * prop.set(12); //  "Changed to 12"
 * prop.inc(); //  "Changed to 13"
 * prop.dec(); //  "Changed to 12"
 * prop.dec(2); //  "Changed to 10"
 * ```
 */
function pinteger(initial: number, name?: string) {
  if (!name) name = getId('PInteger');
  return new PInteger(name, initial);
}

/**
 * Wrapper class for boolean type property with additional methods:
 * - `enable` set property value to `true`
 * - `disable` set property value to `false`
 * - `toggle` toggle current value of the property, works like `value = !value`
 *
 * @param initial Set initial (default) value of the property
 * @param name Optional, set a name for the property, useful for logging and debugging
 * @returns New `PBoolean` instance.
 *
 * ```typescript
 * import { factories } from 'factories';
 * const prop = factories.pboolean(false);
 *
 * prop.onChange((newValue, property) => {
 *   console.log(`Changed to ${newValue}`);
 * });
 *
 * prop.set(true); //  "Changed to true"
 * prop.disable(); //  "Changed to false"
 * prop.enable(); //  "Changed to true"
 * prop.toggle(); //  "Changed to false"
 * ```
 */
function pboolean(initial: boolean, name?: string) {
  if (!name) name = getId('PBoolean');
  return new PBoolean(name, initial);
}

/**
 * Wrapper class for list type property with additional methods:
 * - `push(value)` add a new value to the end of the list and call all `onChange` callbacks
 * - `pop()` take last value to the end of the list and call all `onChange` callbacks
 * - `insert(index, value)` insert a new value at specified index and call all `onChange` callbacks
 * - `put(index, value)` set a new value for specified index and call all `onChange` callbacks
 * - `push` add a new value to the end of the list and call all `onChange` callbacks
 * - `clear` remove all entries from the list
 *
 * @param initial Initial value for a list
 * @param name Optional, set name for a property, useful for logging and debugging
 * @returns
 *
 * ```typescript
 * import { factories } from 'factories';
 * const prop = factories.plist<number>([]);
 *
 * prop.onChange((newValue, property) => {
 *   console.log(`Changed to ${newValue}`);
 * });
 *
 * prop.set([1, 2, 3]); //  "Changed to [1, 2, 3]"
 * prop.pop(); //  "Changed to [1, 2]"
 * prop.push(4); //  "Changed to [1, 2, 4]"
 * prop.insert(0, 5); //  "Changed to [5, 1, 2, 4]"
 * prop.put(2, 5); //  "Changed to [5, 1, 5, 4]"
 * prop.clear(); //  "Changed to []"
 * ```
 */
function plist<T extends PropertyValueType>(initial?: T[], name?: string) {
  if (!initial) initial = [];
  if (!name) name = getId('PBoolean');
  return new PList(name, initial);
}

/**
 * Property class, which will create a new observable property as a function of some other properties,
 * which will work as a function using some properties and returning a new value.
 *
 * ```typescript
 * pfunc((other_param) => prop1.get() + prop2.get(), [2], "sum_of_two_properties")
 * ```
 * Note: need to use `.get()` to get properties registered.
 *
 * @param updater Function, which will update the value of the property, such as
 * @param args Optional, to pass some additional arguments to the updater function.
 * @param name Name of the property, useful for logging and debugging.
 * @returns
 */
function pfunc<K extends (...args: PropertyValueType[]) => PropertyValueType>(
  updater: K,
  args?: Parameters<K>,
  name?: string
) {
  if (!name) name = getId('DependentProperty');
  return new DependentProperty(name, updater, args);
}

interface RecObj {
  [key: string]: PropertyValueType | RecObj;
}

/**
 * Wrapper for object type property with additional functionality.
 * Property will contain an object and adding/changes to any of its fields will automatically trigger `onChange` callbacks.
 *
 * ```typescript
 * import { factories } from 'factories';
 * const prop = factories.pobject([]);
 *
 * prop.onChange((newValue, property) => {
 *   console.log(`Changed to ${newValue}`);
 * });
 *
 * prop.set({}); //  "Changed to {}"
 * prop.set({ data: 123 }); //  "Changed to { data: 123 }"
 * prop.get().data = 345; //  "Changed to { data: 345 }"
 * prop.get().anotherData = 123; //  "Changed to { data: 345, anotherData: 123 }"
 * ```
 *
 * @param initial: object - Initial value for the property
 * @param name Optional, set name of the property, useful for logging and debugging
 * @returns
 */
function pobject<T extends RecObj>(initial: T, name?: string) {
  if (!name) name = getId('PObject');
  return new PObject<T>(name, initial);
}

// Component Factories

const defaultLoading = () => new HTMLComponent().tag('div');
const defaultError = (err: Error) =>
  new HTMLComponent().tag('div').text(`${err.name}: ${err.message}`);

/**
 * `AsynchronousComponent` allows to place loadable data for the component. It is used to place `Promise`s into the component to be able to load some data, like images, etc.
 * It receives during the creation:
 * - `onComplete: () => Promise<Component>` - asynchronous function returning some component after waiting for some data to be loaded.
 * - optional: `onLoading: () => Component` - function returning some component shown while the `onComplete` function is still loading, useful to show a loader state. (default - blank component)
 * - optional: `onError: (err: Error) => Component` - function returning some component shown when the `onComplete` function fails to load due to some exception, useful to show an error state. (default - error message text)
 * - optional: `name = ''` - name the component, for debugging purposes.
 *
 */
function asynchronous(
  onComplete: () => Promise<Component>,
  onLoading: () => Component = defaultLoading,
  onError: (err: Error) => Component = defaultError,
  name: string = ''
) {
  return new AsynchronousComponent(onComplete, onLoading, onError, name);
}

/**
 * `FunctionalComponent` is the core of reactivity in the framework, which is just a component which will re-render when one of the properties, used in it, changes.
 * Note: you need to use `.get()` method of properties to get them automatically registered to the component.
 *
 * @param renderer  - function, creating a new component, which will be re-rendered, when any of the properties used inside that component changes.
 * @param args - optional: list of arguments, passed to the render function, useful for customizing component's behavior.
 * @param name
 * @returns
 */
function functional<
  K extends (
    ...args: (PropertyValueType | Property<PropertyValueType>)[]
  ) => Component,
>(renderer: K, args?: Parameters<K>, name?: string) {
  if (!name) name = getId('FunctionalComponent');
  return new FunctionalComponent(renderer, name, args);
}

/**
 * Will create a TextComponent, to place some text into components (will be rendered as TextNode == plain text).
 *
 * @param txt Some data to be changed into string
 * @returns
 */
function text(txt: unknown) {
  return new TextComponent(`${txt}`);
}

/**
 * Create a builder for HTMLComponents with specified tag.
 *
 * HTML Component will represents the functionality of the actual DOM `HTMLElement`
 * with additional functionality for tackling reactivity. Will be rendered as plain HTMLElement with additional metadata.
 *
 * @param tag Tag to create HTML Elements with
 * @returns Function to create a new HTMLComponent with specified children.
 *
 * ```typescript
 * const buttonElement = factories.html('button');
 * const p = factories.html('button');
 *
 * const component =
 *  buttonElement("Click me", p("it is a paragraph"))
 *   // create a button HTML Element with some text and paragraph element
 *   // depending on the value of property
 *   // change the value of the CSS class
 *   .propClass(prop, (value) =>
 *     value > 5 ? ['counter-bigger-5', 'active'] : ['inactive']
 *   )
 *   .propAttr(prop, 'data-value', (v) => `${v}`)
 *   .onClick(() => prop.inc()); // add event listener to the component
 * ```
 *
 */
function html(tag: string) {
  return (...children: (Component | unknown)[]) =>
    new HTMLComponent(
      ...children.map((c) => (c instanceof Component ? c : text(c)))
    ).tag(tag);
}

/**
 * Create a new HTMLComponent with specified tag.
 *
 * @param tag Tag to set for the HTMLComponent
 * @returns new HTML component with specified tag
 */
function htmlTag(tag: string) {
  return new HTMLComponent().tag(tag);
}

export const factories = {
  property,
  pinteger,
  pboolean,
  plist,
  pfunc,
  pobject,
  asynchronous,
  functional,
  text,
  html,
  htmlTag,
};
