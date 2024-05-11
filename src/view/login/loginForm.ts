import { authContext } from '../../contexts/authContext';
import { factories } from '../../framework/factories';
import { debug } from '../../framework/utilities/logging';
import { htmlComponents } from '../shared/htmlComponents';
import { inputComponents } from '../shared/inputComponents';

const { form } = htmlComponents;
const {
  validated,
  labelled,
  inputEmail,
  inputPassword,
  submitButton,
  checkboxInput,
} = inputComponents;

export const loginForm = () => {
  const showPassword = factories.pboolean(false, 'show_password');
  const checkboxShowPasswordField = checkboxInput()
    .cls('checkbox-password')
    .onInput((e) => showPassword.set((e.target as HTMLInputElement).checked));

  const [inputEmailField, emailValid] = validated(
    inputEmail(),
    authContext.emailValidators
  );

  const [inputPasswordField, passwordValid] = validated(
    inputPassword().propAttr(showPassword, 'type', (show) =>
      show ? 'text' : 'password'
    ),
    authContext.passwordValidators
  );

  const formValid = factories.pfunc(
    () => emailValid.get() && passwordValid.get()
  );

  return form
    .cls('login-form')(
      labelled('Email', inputEmailField, 'email', { required: true }),
      labelled('Password', inputPasswordField, 'password', {
        required: true,
        clue: 'Use 8 or more characters with a mix of letters, numbers & symbols',
      }),
      labelled('Show password', checkboxShowPasswordField, 'show-password', {
        name: 'show password',
        reverseOrder: true,
      }).cls('checkbox-container'),

      submitButton('Submit').cls('input-submit').attr('type', 'submit')
    )
    .onSubmit(() => {
      debug('Attempting to submit login form.');

      if (formValid.get()) {
        debug('Attempting to login.');
        authContext.attemptLogin(
          (inputEmailField.getNode() as HTMLInputElement).value,
          (inputPasswordField.getNode() as HTMLInputElement).value
        );
      } else {
        debug('Attempt failed, form is not valid.');
      }
    });
};
