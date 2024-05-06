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

function property<T extends PropertyValueType>(initial: T, name?: string) {
  if (!name) name = getId('Property');
  return new Property(name, initial);
}

function pinteger(initial: number, name?: string) {
  if (!name) name = getId('PInteger');
  return new PInteger(name, initial);
}

function pboolean(initial: boolean, name?: string) {
  if (!name) name = getId('PBoolean');
  return new PBoolean(name, initial);
}

function plist<T extends PropertyValueType>(initial?: T[], name?: string) {
  if (!initial) initial = [];
  if (!name) name = getId('PBoolean');
  return new PList(name, initial);
}

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
 *
 * @param txt some data to be changed into string
 * @returns
 */
function text(txt: unknown) {
  return new TextComponent(`${txt}`);
}

function html(tag: string) {
  return (...children: (Component | unknown)[]) =>
    new HTMLComponent(
      ...children.map((c) => (c instanceof Component ? c : text(c)))
    ).tag(tag);
}

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
