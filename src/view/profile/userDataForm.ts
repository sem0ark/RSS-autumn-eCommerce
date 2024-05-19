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
import { FieldEditBuilder } from '../../contexts/fieldEditBuilder';

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
  )
    .cls('form-entry')
    .onSubmit(() => changing.disable());
};

export const userDataForm = () => {
  const showPassword = pboolean(false, 'show_password');

  const checkboxShowPasswordField = checkboxInput()
    .cls('checkbox-password')
    .onInput((e) => showPassword.set((e.target as HTMLInputElement).checked));

  const [inputFirstNameField, firstNameValid, firstName] = validated(
    inputText(),
    [
      ...nameValidators,
      (text) =>
        text === authContext.userData.get()?.firstName && 'Value is the same',
    ]
  );
  const [inputLastNameField, lastNameValid, lastName] = validated(inputText(), [
    ...nameValidators,
    (text) =>
      text === authContext.userData.get()?.lastName && 'Value is the same',
  ]);
  const [inputEmailField, emailValid, email] = validated(inputText(), [
    ...emailValidators,
    (text) => text === authContext.userData.get()?.email && 'Value is the same',
  ]);

  const [inputDateOfBirthField, dateOfBirthValid, dateOfBirth] = validated(
    inputDate(),
    [
      ...dateOfBirthValidators,
      (text) =>
        text === authContext.userData.get()?.dateOfBirth && 'Value is the same',
    ]
  );

  const [inputOldPasswordField, oldPasswordValid, oldPassword] = validated(
    inputPassword(),
    passwordValidators
  );

  const [inputNewPasswordField, newPasswordValid, newPassword] = validated(
    inputPassword(),
    [
      ...passwordValidators,
      (text) =>
        text === authContext.userData.get()?.password && 'Value is the same',
    ]
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
      () => authContext.userData.get()?.firstName,
      inputFirstNameField
    ).onSubmit(
      () =>
        firstNameValid.get() &&
        authContext.attemptProfileUpdate(
          FieldEditBuilder.setFirstName(firstName.get())
        ),
      true
    ),

    formChange(
      'Last Name',
      () => authContext.userData.get()?.lastName,
      inputLastNameField
    ).onSubmit(
      () =>
        lastNameValid.get() &&
        authContext.attemptProfileUpdate(
          FieldEditBuilder.setLastName(lastName.get())
        ),
      true
    ),

    formChange(
      'Date of Birth',
      () => authContext.userData.get()?.dateOfBirth,
      inputDateOfBirthField.attr(
        'value',
        authContext.userData.get()?.dateOfBirth
      )
    ).onSubmit(
      () =>
        dateOfBirthValid.get() &&
        authContext.attemptProfileUpdate(
          FieldEditBuilder.setDateOfBirth(dateOfBirth.get())
        ),
      true
    ),

    formChange(
      'Email Address',
      () => authContext.userData.get()?.email,
      inputEmailField
    ).onSubmit(
      () =>
        emailValid.get() &&
        authContext.attemptProfileUpdate(
          FieldEditBuilder.changeEmail(email.get())
        ),
      true
    ),

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
    ).onSubmit(
      () =>
        oldPasswordValid.get() &&
        newPasswordValid.get() &&
        authContext.attemptProfilePasswordUpdate(
          oldPassword.get(),
          newPassword.get()
        )
    )
  ).cls('user-data-form');
};
