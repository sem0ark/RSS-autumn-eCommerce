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
