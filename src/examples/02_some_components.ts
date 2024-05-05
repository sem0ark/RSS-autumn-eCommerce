import { RegExpRoute, Router } from '../framework/routing/router';
import { Page } from '../framework/ui_components/page';
import { log } from '../framework/utilities/logging';

import { factories } from '../framework/factories';
import { PropertyValueType } from '../framework/reactive_properties/types';
import { Component } from '../framework/ui_components/component';

import './02_some_components.css';

// just a shortcut
type ComponentChildren = (Component | PropertyValueType)[];
type CC = ComponentChildren;

// view/shared/htmlComponents.ts
// ...
// define just HTML tags, already implemented

export const htmlComponents = {
  // ...
  button: factories.html('button'),
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

// view/examplePage.ts
// import inputComponents...

const { buttonPrimary } = inputComponents;

function examplePage() {
  return new Page(() => {
    return buttonPrimary('Some text');
  });
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
