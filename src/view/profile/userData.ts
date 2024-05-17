import './userData.css';

import { authContext } from '../../contexts/authContext';
import { factories } from '../../framework/factories';
import { htmlComponents } from '../shared/htmlComponents';
import { inputComponents } from '../shared/inputComponents';
import { textComponents } from '../shared/textComponents';
import { HTMLComponent } from '../../framework/ui_components/htmlComponent';
import {
  dateOfBirthValidators,
  emailValidators,
  nameValidators,
  passwordValidators,
} from '../../utils/validation/userDataValidation';

const { form, div, p } = htmlComponents;
const { functional, pboolean } = factories;
const {
  buttonSecondary,
  inputText,
  inputDate,
  inputPassword,
  checkboxInput,
  validated,
  labelled,
} = inputComponents;
const { textSubtext } = textComponents;

const formChange = (
  heading: string,
  valueResolver: () => string | undefined,
  inputField: HTMLComponent
) => {
  const changing = pboolean(false, 'formEntry_edit_enabled');

  return form(
    textSubtext(heading).cls('form-heading'),

    functional(() =>
      !changing.get()
        ? p(valueResolver() || 'N/A').cls('form-value')
        : inputField.cls('form-value')
    ),

    functional(() =>
      !changing.get()
        ? div(
            buttonSecondary('Edit')
              .cls('edit-button')
              .onClick(() => changing.enable(), true)
          ).cls('button-container')
        : div(
            buttonSecondary('Submit').attr('type', 'submit').cls('edit-button'),
            buttonSecondary('Cancel')
              .cls('cancel-button')
              .onClick(() => changing.disable())
          ).cls('button-container')
    )
  ).cls('form-entry');
};

export const userData = () => {
  const showPassword = pboolean(false, 'show_password');

  const checkboxShowPasswordField = checkboxInput()
    .cls('checkbox-password')
    .onInput((e) => showPassword.set((e.target as HTMLInputElement).checked));

  const [inputFirstNameField] = validated(inputText(), nameValidators);
  const [inputLastNameField] = validated(inputText(), nameValidators);
  const [inputEmailField] = validated(inputText(), emailValidators);

  const [inputDateOfBirthField] = validated(inputDate(), dateOfBirthValidators);

  const [inputOldPasswordField] = validated(
    inputPassword(),
    passwordValidators
  );

  const [inputNewPasswordField, , newPassword] = validated(
    inputPassword(),
    passwordValidators
  );

  const [inputReconfirmPasswordField] = validated(inputPassword(), [
    ...passwordValidators,
    (text) =>
      newPassword.get() !== text &&
      "New password and confirmation doesn't match.",
  ]);

  return div(
    formChange(
      'First Name',
      () => authContext.userData.get().firstName,
      inputFirstNameField.attr('value', authContext.userData.get().firstName)
    ).onSubmit(() => {}, true),
    formChange(
      'Last Name',
      () => authContext.userData.get().lastName,
      inputLastNameField.attr('value', authContext.userData.get().lastName)
    ).onSubmit(() => {}, true),
    formChange(
      'Date of Birth',
      () => authContext.userData.get().dateOfBirth,
      inputDateOfBirthField.attr(
        'value',
        authContext.userData.get().dateOfBirth
      )
    ).onSubmit(() => {}, true),
    formChange(
      'Email Address',
      () => authContext.userData.get().email,
      inputEmailField.attr('value', authContext.userData.get().email)
    ).onSubmit(() => {}, true),
    formChange(
      'Password',
      () => '********',
      div(
        labelled(
          'Old Password',
          inputOldPasswordField.propAttr(showPassword, 'type', (show) =>
            show ? 'text' : 'password'
          ),
          'old-password',
          {
            required: true,
          }
        ),
        labelled(
          'New Password',
          inputNewPasswordField.propAttr(showPassword, 'type', (show) =>
            show ? 'text' : 'password'
          ),
          'new-password',
          {
            required: true,
          }
        ),
        labelled(
          'Confirm Password',
          inputReconfirmPasswordField.propAttr(showPassword, 'type', (show) =>
            show ? 'text' : 'password'
          ),
          'confirm-password',
          {
            required: true,
          }
        ),
        labelled('Show password', checkboxShowPasswordField, 'show-password', {
          name: 'show password',
          reverseOrder: true,
        }).cls('checkbox-container')
      ).cls('password-entry')
    )
  ).cls('user-data-form');
};
