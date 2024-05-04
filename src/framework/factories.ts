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

function asynchronous(
  onComplete: () => Promise<Component>,
  onLoading: () => Component = defaultLoading,
  onError: (err: Error) => Component = defaultError,
  name: string = ''
) {
  return new AsynchronousComponent(onComplete, onLoading, onError, name);
}

function functional<
  K extends (
    ...args: (PropertyValueType | Property<PropertyValueType>)[]
  ) => Component,
>(renderer: K, args?: Parameters<K>, name?: string) {
  if (!name) name = getId('FunctionalComponent');
  return new FunctionalComponent(renderer, name, args);
}

function text(txt: unknown) {
  return new TextComponent(`${txt}`);
}

function html(tag: string) {
  return (...children: Component[]) => new HTMLComponent(...children).tag(tag);
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
};
