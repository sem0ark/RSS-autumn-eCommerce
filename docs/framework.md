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

### PList

`ObservableList` - optimized version of `PList`, which is used in `ListComponent`, used for handling lists.

```typescript
const prop = new ObservableList('Property name', []);

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
