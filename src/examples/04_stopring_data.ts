import { RegExpRoute, Router } from '../framework/routing/router';
import { Page } from '../framework/ui_components/page';
import { log } from '../framework/utilities/logging';

import { factories } from '../framework/factories';
import { PropertyValueType } from '../framework/reactive_properties/types';
import { Component } from '../framework/ui_components/component';

import './03_functional_components.css';
import { Storage } from '../framework/persistence/storage';

// just a shortcut
type ComponentChildren = (Component | PropertyValueType)[];
type CC = ComponentChildren;

// view/shared/htmlComponents.ts
// ...
// define just HTML tags, already implemented

export const htmlComponents = {
  // ...
  button: factories.html('button'),
  div: factories.html('div'),
  // ...
};

////////////////////// ACTUAL PART FOR US TO DO

// view/shared/inputComponents.ts
// ...

// import htmlComponents...
const { button } = htmlComponents;

export const inputComponents = {
  // the same standard button, but with some classes
  buttonPrimary: (...children: CC) =>
    button(...children).cls(
      'inputComponents-button',
      'inputComponents-button-primary'
    ),
};

// view/counterButton.ts
// import inputComponents...

const { buttonPrimary } = inputComponents;
const { text, functional, property } = factories;

const storage = new Storage('Counter');

export const counterButton = () => {
  const count = storage.registerProperty(property<number>(0));
  log('Making a button');

  return buttonPrimary(
    'Some counter: ',
    functional(() => text(count.get()))
  ).onClick(() => count.set(count.get() + 1));
};

// view/examplePage.ts

// import { counterButton } from view/components/counterButton.ts
const { div } = htmlComponents;
function examplePage() {
  return new Page(() =>
    div(counterButton(), counterButton(), counterButton(), counterButton())
  );
}

// loaders/loadApp.ts
// will load the application using specified routing
// works as a main entry for the application
function loadApp() {
  log('Loading the application');

  log('Initializing router');
  Router.getRouter(
    new RegExpRoute('/', examplePage()) // render example page on root
  );

  Router.getRouter().initNavigation();
}

export const exampleCounterApp = () => {
  loadApp();
};
