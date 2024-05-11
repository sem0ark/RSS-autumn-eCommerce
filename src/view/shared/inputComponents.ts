import './inputComponents.css';

import { HTMLComponent } from '../../framework/ui_components/htmlComponent';

import { factories } from '../../framework/factories';
import { htmlComponents } from './htmlComponents';
import { PBoolean } from '../../framework/reactive_properties/property';
const { input, div, p, label } = htmlComponents;

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
): [HTMLComponent, PBoolean] => {
  const propValid = factories.pboolean(false);
  const validatedComponent = inputComponent
    .cls('input-components-validated')
    .propClass(propValid, (valid) => (valid ? ['success'] : ['error']))
    .onInput((e) => {
      const inputNode = e.target as HTMLInputElement;
      const entry = inputNode.value;

      const errors: string[] = validators
        .map((v) => v(entry, inputNode))
        .filter((err) => !!err) as string[];

      if (errors.length > 0) {
        inputNode.setCustomValidity(errors[0]);
        inputNode.reportValidity();
        propValid.disable();
      } else {
        inputNode.setCustomValidity('');
        propValid.enable();
      }
    });

  return [validatedComponent, propValid];
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
      inputComponent.id(id).attr('name', options?.name || id),
      label(labelText).attr('for', id)
    );
  } else {
    result = inputContainer(
      label(labelText).attr('for', id),
      inputComponent.id(id).attr('name', options?.name || id)
    );
  }

  if (options?.required) result.attr('required');
  if (options?.clue) result.add(inputClue(options?.clue));

  return result;
};

const inputText = input.cls('input-components-input-text').attr('type', 'text');

const inputEmail = input
  .cls('input-components-input-text', 'input-components-input-email')
  .attr('type', 'email');

const inputPassword = input
  .cls('input-components-input-text', 'input-components-input-password')
  .attr('type', 'password');

const checkboxInput = input
  .cls('input-components-input-checkbox')
  .attr('type', 'checkbox');

const submitButton = input
  .cls('input-components-input-submit')
  .attr('type', 'submit');

export const inputComponents = {
  labelled,
  validated,

  inputClue,
  inputContainer,

  inputText,
  inputEmail,
  inputPassword,
  checkboxInput,
  submitButton,
};
