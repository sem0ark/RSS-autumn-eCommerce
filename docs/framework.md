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

prop.onChange((newValue, property) => {
  console.log(`Changed to ${newValue}`);
});

prop.set('new-value');
// will also log "Changed to new-value"
```

### PInteger

```typescript
const prop = new PInteger('Property name', 0);

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

## How to use them?

The structure and usage is the same as MVC with added declarativity of UI and logic definition.

Overall the recommended approach of usage is specified in project structure:

1. Encapsulate business logic in context classes (often will work as singleton), which will contain main interaction points with the business logic and reactive properties, available for read for the UI components to listen to.
2. Use only properties and context methods in UI. That will allow to declaratively define the UI without mixing it with the business logic -> testable and modular UI.

Example of a context class:

```typescript
import { PBoolean } from 'reactive_properties/property';

class LoginContext {
  // UI components will register changes in that property
  public readonly pIsActive: PBoolean;

  constructor() {
    this.pIsActive = new PBoolean('user_is_active', false);
  }

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
export const LoginButton = () =>
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
