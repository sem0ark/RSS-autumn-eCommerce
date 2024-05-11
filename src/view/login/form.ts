import { CC } from '../../framework/ui_components/htmlComponent';
import { htmlComponents } from '../shared/htmlComponents';

const { div, h2, p, form, label, input, link } = htmlComponents;

const title = () => h2('Create your unique bouquet').cls('form-title');
const formTitle = () => p('Login').cls('form-title');

const labelEmail = () => label('Email').cls('email').attr('for', 'email');
const inputEmail = () =>
  input()
    .cls('input-email', 'input')
    .attr('type', 'email')
    .attr('name', 'email')
    .attr('id', 'email')
    .attr('required', '');

const labelPassword = () =>
  label('Password').cls('password').attr('for', 'password');

const inputPassword = () =>
  input()
    .cls('input-password', 'input')
    .attr('type', 'password')
    .attr('name', 'password')
    .attr('id', 'password')
    .attr('required', '');

const passwordClue = () =>
  p('Use 8 or more characters with a mix of letters, numbers & symbols').cls(
    'clue'
  );

const checkboxPassword = () =>
  input()
    .cls('checkbox-password')
    .attr('type', 'checkbox')
    .attr('name', 'show-password')
    .attr('id', 'show-password');
const labelShowPassword = () =>
  label('Show password').cls('show-password').attr('for', 'show-password');
const checkboxContainer = (...children: CC) =>
  div(...children).cls('checkbox-container');

const submitForm = () =>
  input()
    .cls('input-submit')
    .attr('type', 'submit')
    .attr('value', 'Submit')
    .attr('id', 'submit');

const linkToRegisterPage = () =>
  div('Not Registered Yet? ')
    .cls('subtext')
    .add(link('/singUp', 'Create an account').cls('link-subtext'));

const inputContainer = (...children: CC) =>
  div(...children).cls('input-container');

const loginForm = () =>
  form(
    inputContainer(labelEmail(), inputEmail()),
    inputContainer(labelPassword(), inputPassword(), passwordClue()),
    inputContainer(checkboxContainer(checkboxPassword(), labelShowPassword())),
    submitForm()
  ).cls('form');

const formContainer = () =>
  div(title(), formTitle(), loginForm(), linkToRegisterPage()).cls(
    'form-container'
  );

export const formComponents = {
  formContainer,
};
