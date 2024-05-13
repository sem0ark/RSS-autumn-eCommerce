import './signupPage.css';

import { Page } from '../../framework/ui_components/page';

import { htmlComponents } from '../shared/htmlComponents';
// import { authContext } from '../../contexts/authContext';
// import { Router } from '../../framework/routing/router';
// import { notificationContext } from '../../contexts/notificationContext';
import { minimalLayout } from '../shared/layouts/minimalLayout';
import { inputComponents } from '../shared/inputComponents';
import { factories } from '../../framework/factories';

const { pboolean } = factories;
const { div, h2, span, form } = htmlComponents;
const { submitButton, inputEmail, inputText, labelled, checkboxInput } =
  inputComponents;

const formBlock = div.cls('form-block');

export const signupPage = new Page(() => {
  const showPassword = pboolean(false, 'show_password');

  const checkboxShowPasswordField = checkboxInput()
    .cls('checkbox-password')
    .onInput((e) => showPassword.set((e.target as HTMLInputElement).checked));

  return minimalLayout('Create an account')(
    form(
      formBlock(
        h2(span(), 'Main Information'),
        labelled('First Name *', inputText(), 'first-name', { required: true }),
        labelled('Last Name *', inputText(), 'last-name', { required: true }),

        labelled('Email *', inputEmail(), 'email', { required: true }),
        labelled('Show password', checkboxShowPasswordField, 'show-password', {
          name: 'show password',
          reverseOrder: true,
        }).cls('checkbox-container')
      ),
      formBlock(h2(span(), 'Billing Address')),
      submitButton('Submit')
    ).cls('signup-page')
  );
}, 'Login | True Colors');
