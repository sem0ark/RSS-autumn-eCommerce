import './signupPage.css';

import { htmlComponents } from '../shared/htmlComponents';
import { inputComponents } from '../shared/inputComponents';
import { factories } from '../../framework/factories';
import {
  dateOfBirthValidators,
  emailValidators,
  nameValidators,
  passwordValidators,
} from '../../utils/validation/userDataValidation';
import { HTMLComponent } from '../../framework/ui_components/htmlComponent';
import { DependentProperty } from '../../framework/reactive_properties/property';

const { pboolean, pfunc } = factories;
const { h2, span, div } = htmlComponents;
const {
  inputDate,
  inputText,
  inputPassword,
  labelled,
  validated,
  checkboxInput,
} = inputComponents;

const formBlock = div.cls('form-block');

export const userDataForm = (
  headingText: string
): [
  HTMLComponent,
  DependentProperty<[], boolean>,
  DependentProperty<
    [],
    {
      first: string;
      last: string;
      email: string;
      password: string;
      dateOfBirth: string;
    }
  >,
] => {
  const showPassword = pboolean(false, 'show_password');

  const [inputFirstNameField, firstNameValid, firstNameValue] = validated(
    inputText(),
    nameValidators
  );

  const [inputLastNameField, lastNameValid, lastNameValue] = validated(
    inputText(),
    nameValidators
  );

  const [inputEmailField, emailValid, emailValue] = validated(
    inputText(),
    emailValidators
  );

  const [inputPasswordField, passwordValid, passwordValue] = validated(
    inputPassword().propAttr(showPassword, 'type', (show) =>
      show ? 'text' : 'password'
    ),
    passwordValidators
  );

  const [inputDateOfBirthField, dateOfBirthValid, dateOfBirthValue] = validated(
    inputDate(),
    dateOfBirthValidators
  );

  const checkboxShowPasswordField = checkboxInput()
    .cls('checkbox-password')
    .onInput((e) => showPassword.set((e.target as HTMLInputElement).checked));

  const resultingDataCorrect = pfunc(
    () =>
      firstNameValid.get() &&
      lastNameValid.get() &&
      emailValid.get() &&
      passwordValid.get() &&
      dateOfBirthValid.get()
  );

  const resultingData = pfunc(() => ({
    first: firstNameValue.get(),
    last: lastNameValue.get(),
    email: emailValue.get(),
    password: passwordValue.get(),
    dateOfBirth: dateOfBirthValue.get(),
  }));

  return [
    formBlock(
      h2(span(), headingText),
      labelled('First Name *', inputFirstNameField, 'first-name', {
        required: true,
      }),
      labelled('Last Name *', inputLastNameField, 'last-name', {
        required: true,
      }),
      labelled('Date Of Birth *', inputDateOfBirthField, 'date', {
        required: true,
      }),
      labelled('Email *', inputEmailField, 'email', { required: true }),
      labelled('Password *', inputPasswordField, 'password', {
        required: true,
      }),
      labelled('Show password', checkboxShowPasswordField, 'show-password', {
        name: 'show password',
        reverseOrder: true,
      }).cls('checkbox-container')
    ),
    resultingDataCorrect,
    resultingData,
  ];
};