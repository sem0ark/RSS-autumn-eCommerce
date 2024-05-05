# About the framework

This so called "framework" is a set of utility classes, used to implement main features of Single-Page application in a more declarative and reactive way.

Overall, main parts are:

1. `reactive_properties` -> set of observable values for different purposes.
2. `ui_components` -> set of classes for creating UI components in a declarative manner.
3. `routing` -> set of classes and `Router` class to enable routing in Single-Page Application.
4. `persistence` -> classes for automatically saving reactive properties in a persistent storage.
5. `event_handling` -> classes for creating event-driven behavior.
6. `asynchronous` -> structures for implementing asynchronous behavior.

## Main goal of the framework

Main goal of framework is to _divide business logic from UI_, business logic will work only with the reactive properties as if they were just variables, while UI will be _automatically updated_, without any intervention from business logic classes.

## Usage examples: Reactive properties

### Property

```typescript
const prop = new Property<string>('Property name', 'initial value');
/* or
import { factories } from 'factories';
const prop = factories.property<string>("initial value");
*/

prop.onChange((newValue, property) => {
  console.log(`Changed to ${newValue}`);
});

prop.set('new-value');
// will also log "Changed to new-value"
```

### PInteger

```typescript
const prop = new PInteger('Property name', 0);
/* or
import { factories } from 'factories';
const prop = factories.pinteger(0);
*/

prop.onChange((newValue, property) => {
  console.log(`Changed to ${newValue}`);
});

prop.set(12); //  "Changed to 12"
prop.inc(); //  "Changed to 13"
prop.dec(); //  "Changed to 12"
prop.dec(2); //  "Changed to 10"
```

### PBoolean

```typescript
const prop = new PBoolean('Property name', false);
/* or
import { factories } from 'factories';
const prop = factories.pboolean(false);
*/

prop.onChange((newValue, property) => {
  console.log(`Changed to ${newValue}`);
});

prop.set(true); //  "Changed to true"
prop.disable(); //  "Changed to false"
prop.enable(); //  "Changed to true"
prop.toggle(); //  "Changed to false"
```

### PList

```typescript
const prop = new PList<number>('Property name', []);
/* or
import { factories } from 'factories';
const prop = factories.plist<number>([]);
*/

prop.onChange((newValue, property) => {
  console.log(`Changed to ${newValue}`);
});

prop.set([1, 2, 3]); //  "Changed to [1, 2, 3]"
prop.pop(); //  "Changed to [1, 2]"
prop.push(4); //  "Changed to [1, 2, 4]"
prop.insert(0, 5); //  "Changed to [5, 1, 2, 4]"
prop.put(2, 5); //  "Changed to [5, 1, 5, 4]"
prop.clear(); //  "Changed to []"
```

### PObject

Used to make an observable object property, which will listen to changes in any of (sub-)fields.

```typescript
const prop = new PObject<Record<string, number>>('Property name', {});
/* or
import { factories } from 'factories';
const prop = factories.pobject([]);
*/

prop.onChange((newValue, property) => {
  console.log(`Changed to ${newValue}`);
});

prop.set({}); //  "Changed to {}"
prop.set({ data: 123 }); //  "Changed to { data: 123 }"
prop.get().data = 345; //  "Changed to { data: 345 }"
prop.get().anotherData = 123; //  "Changed to { data: 345, anotherData: 123 }"
```

### DependentProperty

Used to make an observable property, which will listen to changes in any of its dependencies and calculate a new value based on the provided function

```typescript
const prop1 = new PInteger('prop1', 0);
const prop2 = new PInteger('prop2', 0);

// to register property, use get on dependent properties
const prop = new DependentProperty(
  'dependent property',
  () => prop1.get() + prop2.get()
);
/* or
import { factories } from 'factories';
const prop = factories.pfunc(() => prop1.get() + prop2.get());
*/

// changes in the function result will
prop.onChange((newValue, property) => {
  console.log(`Changed to ${newValue}`);
});

prop1.inc(); // "Changed to 1"
prop2.inc(); // "Changed to 2"
prop1.dec(); // "Changed to 1"
```

### ObservableList

`ObservableList` - optimized version of `PList`, which is used in `ListComponent`, used for handling lists of different elements.

```typescript
const prop = new ObservableList('Property name', [1, 2, 3]);

prop.onPush((index, property) => {
  console.log(`Pushed value ${property.get()} to ${index}`);
});

prop.onInsert((index, property) => {
  console.log(`Inserted value ${property.get()} to ${index}`);
});

prop.onRemove((index) => {
  console.log(`Removed on ${index}`);
});

prop.removeByValue(2); // "Removed on 1"
prop.insert(2, 5); // "Inserted 5 on 2"
prop.push(5); // "Pushed 5 on 3"
```

## Usage examples: UI Components

### Text Component

Text Component represents the functionality of `TextNode` in DOM

```typescript
import { factories } from 'factories';
const { text, html } = factories;

const component = html('button')('some text');
```

### HTML Component

HTML Component will represent the functionality of the actual DOM `HTMLElement` used in JavaScript, but with additional functionality for tackling reactivity.

```typescript
import { factories } from 'factories';

const prop = factories.pinteger(0);

const component = factories
  .html('button')() // create a button component without any children
  // depending on the value of property
  // change the value of the CSS class
  .propClass(prop, (value) =>
    value > 5 ? ['counter-bigger-5', 'active'] : ['inactive']
  )
  .propAttr(prop, 'data-value', (v) => `${v}`)
  .onClick(() => prop.inc()); // add event listener to the component
```

### Functional Component

`FunctionalComponent` is the core of reactivity in the framework, which is just a component which will re-render when one of the properties, used in it, changes.

Note: you need to use `.get()` method of the property to get it automatically registered to the component.

```typescript
import { factories } from '...factories';
import { htmlComponents } from '...htmlComponents';

const { functional, text, pinteger } = factories;
const prop = pinteger(0);

const { button } = htmlComponents;

const component = button(functional(() => text(prop.get())));
```

### Asynchronous Component

`AsynchronousComponent` allows to place loadable data for the component. It is used to place `Promise`s into the component to be able to load some data, like images, etc.

```typescript
import { factories } from '...factories';
import { htmlComponents } from '...htmlComponents';

const { text, asynchronous } = factories;

const { p } = htmlComponents;

const component = asynchronous(
  // actual rendering function with some awaitable data
  async () => p(text(await fetchData('http://get-some-text'))),
  // optional, shown while all promises are loading
  () => p('data is loading...'),
  // optional, shown when some of the promises fails
  (err: Error) => p(`data is loading failed: ${err.message}`)
);
```

### List Component

Used to efficiently render lists of components. Useful on any list-like functionality (rendering TODO lists, product cards, etc.). It can be created from a class or used through `HTMLComponent` method as a shortcut.

```typescript
import { factories } from '...factories';
import { htmlComponents } from '...htmlComponents';
import { ObservableList } from '...ObservableList';

const { text, list } = factories;
const { button, div } = htmlComponents;

const todoList = new ObservableList<string>('todo_list');

// Create a list of buttons
const component = div(
  // create a div
  // add a button to it
  button('Add new entry').onClick(() => {
    list.push('Some new text entry');
  }) // when clicking on the button, add a new entry to the property
)
  // use that div as a container for the list items
  .list(todoList, (prop: Property<string>) =>
    functional(
      // it is better to use a functional component as an entry
      // then, if the value in the list change, UI will update automatically
      () =>
        // buttons with the list entry text
        button(`List Item [${prop.get()}]`).onClick(() => {
          todoList.removeByProperty(prop);
        })
      // when clicking on that button, remove the entry from the list
    )
  );
```

## How to use them?

The structure and usage is the same as MVC with added declarativity of UI and logic definition.

Overall the recommended approach of usage is specified in project structure:

1. Encapsulate business logic in context classes (often will work as singleton), which will contain main interaction points with the business logic and reactive properties, available for read for the UI components to listen to.
2. Use only properties and context methods in UI. That will allow to declaratively define the UI without mixing it with the business logic -> testable and modular UI.

Example of a context class:

```typescript
import { factories } from 'factories';
const { pboolean } = factories;

class LoginContext {
  // UI components will register changes in that property
  public readonly pIsActive = pboolean(false);

  private static instance?: LoginContext;
  public static getInstance() {
    if (this.instance) return this.instance;
    this.instance = new LoginContext();
    return this.instance;
  }

  public logIn(): void {
    pIsActive.enable(); // change the state
  }

  public logOut(): void {
    pIsActive.enable(); // change the state
  }
}
// export the context instance to avoid multiple copies
export const loginContext = LoginContext.getInstance();
```

Example of a UI component:

```typescript
import { factories } from 'factories';
const { functional } = factories;

export const LoginButton = () =>
  // actually a factory method used to fluently create components
  functional(
    () =>
      // functional component works like dependent property, but for UI
      loginContext.pIsActive.get() // UI component will automatically listen to changes in this property
        ? button('Log Out').onClick(() => loginConext.logOut()) // UI will trigger some state change
        : button('Log In').onClick(() => loginConext.logIn())
    // these are HTMLComponents, which represent HTML elements
    // with additional utility functions to add all interactivity
  );
```

In such way we will be able to separate the actual logic to be as standard variables, so we won't need to "think" about how the UI will update.

### Working with components

The overall idea of reusable components is to implement files, which will export an object, containing a list of functions, representing different components.

```typescript
// htmlComponents.ts

import { factories } from '...factories';
const { html } = factories;

// html factory function will return another function, which will create a component with
// specified tag after receiving a (maybe empty) list of children components
// or some other data, automatically transformed into text as TextComponent

export const htmlComponents = {
  button: html('button'), // create a function, which will return button component with specified children
};

// buttonComponents.ts
import { Component } from '...component';
import { htmlComponents } from '...htmlComponents';
const { button } = htmlComponents;

// simpler type as a shorthand for writing wrappers
type CC = (Component | string | number | boolean)[];

export const buttonComponents = {
  // a bit more specific element, used somewhere else
  buttonPrimary: (...children: CC) =>
    button(...children).cls('button', 'button-primary'),
  buttonSecondary: (...children: CC) =>
    button(...children).cls('button', 'button-secondary'),
};
// like that we will make a UI Kit for creating more sophisticated components
```

In case the component actually related to a single application, it is possible to export a single function for this component.

```typescript
import { factories } from '...factories';
import { buttonComponents } from '...buttonComponents';

const { functional, pinteger } = factories;
const { buttonPrimary } = buttonComponents;

// will create a button with a counter, which will update on clicking the button
export const Counter = () => {
  const count = pinteger(0);

  return functional(() =>
    buttonPrimary(text(`Current counter: ${count.get()}`)).onClick(() =>
      count.inc()
    )
  );
};
```

Compared to class-based approach, functional components are more declarative and readable.
