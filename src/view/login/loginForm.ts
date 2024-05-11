import { htmlComponents } from '../shared/htmlComponents';
import { inputComponents } from '../shared/inputComponents';

const { form } = htmlComponents;
const { labelled, inputEmail, inputPassword, submitButton, checkboxInput } =
  inputComponents;

export const loginForm = () => {
  const checkboxShowPasswordField = checkboxInput().cls('checkbox-password');
  const inputEmailField = inputEmail();
  const inputPasswordField = inputPassword();

  return form.cls('login-form')(
    labelled('Email', inputEmailField, 'email', { required: true }),
    labelled('Password', inputPasswordField, 'password', {
      required: true,
      clue: 'Use 8 or more characters with a mix of letters, numbers & symbols',
    }),
    labelled('Show password', checkboxShowPasswordField, 'show-password', {
      name: 'show password',
      reverseOrder: true,
    }).cls('checkbox-container'),
    submitButton.cls('input-submit').attr('type', 'submit')('Submit')
  );
};
