import './inputComponents.css';

import { CC, HTMLComponent } from '../../framework/ui_components/htmlComponent';

import { factories } from '../../framework/factories';
import { htmlComponents } from './htmlComponents';
import {
  PBoolean,
  Property,
} from '../../framework/reactive_properties/property';

const { input, div, p, label, button, iconSvg, link, select, option } =
  htmlComponents;

const inputClue = p.cls('input-components-clue');
const inputContainer = div.cls('input-components-input-container');

/**
 * Add standard validation functionality to the given  HTMLComponent.
 *
 * @param inputComponent input field to be validated
 * @param validators a list of validators which will return an error in case a field is incorrect in some way.
 * Recommended form of a validator will be `(text) => `
 * @returns same HTMLComponent with added standard validation functionality.
 */
const validated = (
  inputComponent: HTMLComponent,
  validators: ((
    input_string: string,
    input: HTMLInputElement
  ) => string | boolean)[]
): [HTMLComponent, PBoolean, Property<string>] => {
  const propValid = factories.pboolean(false);
  const propValue = factories.property<string>('');

  const updateValidity = (n: EventTarget | null) => {
    if (n === null) return;

    const inputNode = n as HTMLInputElement;
    const entry = inputNode.value;
    propValue.set(entry);

    for (const validator of validators) {
      const error = validator(entry, inputNode);

      if (error && typeof error === 'string') {
        inputNode.setCustomValidity(error);
        inputNode.reportValidity();
        propValid.disable();
        return;
      }
    }

    inputNode.setCustomValidity('');
    propValid.enable();
  };

  const validatedComponent = inputComponent
    .cls('input-components-validated')
    .propClass(propValid, (valid) => (valid ? ['success'] : ['error']))
    .onRender(updateValidity)
    .onInput((e) => updateValidity(e.target));

  return [validatedComponent, propValid, propValue];
};

/**
 * Create a form entry with some input element and a label attached to it.
 *
 * @param labelText text for the label
 * @param inputComponent input field to be labelled
 * @param id of the element
 * @param options - name for the component and clue for the input
 * @returns
 */
const labelled = (
  labelText: string,
  inputComponent: HTMLComponent,
  id: string,
  options?: {
    required?: boolean;
    name?: string;
    clue?: string;
    reverseOrder?: boolean;
  }
) => {
  let result;
  if (options?.reverseOrder) {
    result = inputContainer(
      inputComponent
        .id(id)
        .attr('name', options?.name || id)
        .if(!!options?.required, (c) => c.attr('required')),
      label(labelText).attr('for', id)
    );
  } else {
    result = inputContainer(
      label(labelText).attr('for', id),
      inputComponent
        .id(id)
        .attr('name', options?.name || id)
        .if(!!options?.required, (c) => c.attr('required'))
    );
  }

  if (options?.clue) result.add(inputClue(options?.clue));

  return result;
};

const inputText = input.cls('input-components-input-text').attr('type', 'text');

const inputEmail = input
  .cls('input-components-input-text', 'input-components-input-email')
  .attr('type', 'email');

const inputDate = input
  .cls('input-components-input-text', 'input-components-input-date')
  .attr('type', 'date');

const inputPassword = input
  .cls('input-components-input-text', 'input-components-input-password')
  .attr('type', 'password');

const checkboxInput = input
  .cls('input-components-input-checkbox')
  .attr('type', 'checkbox');

const selectInput = (entries: [string, string][], selected?: string) =>
  select.cls('input-components-input-select')(
    ...entries.map(([k, v]) =>
      selected === k
        ? option(v).attr('value', k).attr('selected')
        : option(v).attr('value', k)
    )
  );

const submitButton = button
  .cls('block-selection', 'input-components-input-submit')
  .attr('type', 'submit');

const buttonPrimary = button.cls(
  'block-selection',
  'input-components-button',
  'input-components-button-primary',
  'button',
  'button-primary'
);

const buttonSecondary = button.cls(
  'block-selection',
  'input-components-button',
  'input-components-button-secondary',
  'button',
  'button-secondary'
);

const buttonPrimaryLink = (url: string, ...children: CC) =>
  link(url, ...children).cls(
    'input-components-button',
    'input-components-button-primary',
    'button',
    'button-primary'
  );

const buttonSecondaryLink = (url: string, ...children: CC) =>
  link(url, ...children).cls(
    'input-components-button',
    'input-components-button-secondary',
    'button',
    'button-secondary'
  );

const buttonIcon = (svgPath: string) =>
  button(iconSvg(svgPath)).cls(
    'block-selection',
    'input-components-button-icon',
    'button',
    'button-icon'
  );

export const inputComponents = {
  labelled,
  validated,

  inputClue,
  inputContainer,

  inputText,
  inputDate,
  inputEmail,
  inputPassword,
  checkboxInput,
  selectInput,

  submitButton,
  buttonPrimary,
  buttonSecondary,
  buttonIcon,
  buttonPrimaryLink,
  buttonSecondaryLink,
};
