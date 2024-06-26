import './signupPage.css';

import { Page } from '../../framework/ui_components/page';
import { htmlComponents } from '../shared/htmlComponents';
import { minimalLayout } from '../shared/layouts/minimalLayout';
import { inputComponents } from '../shared/inputComponents';
import { userDataForm } from './userDataForm';
import { addressForm } from './addressForm';
import { factories } from '../../framework/factories';
import { authContext } from '../../contexts/authContext';
import { Router } from '../../framework/routing/router';
import { debug } from '../../framework/utilities/logging';

const { pboolean, functional } = factories;
const { link, form, div, h3, p, hidden } = htmlComponents;
const { submitButton, checkboxInput, labelled } = inputComponents;

const formBlock = div.cls('form-block');

export const signupPage = new Page(() => {
  const sameShippingAddress = pboolean(true, 'same_shipping_address');
  const checkboxSameShippingAddress = checkboxInput()
    .attr('checked')
    .cls('checkbox-password')
    .onInput((e) =>
      sameShippingAddress.set((e.target as HTMLInputElement).checked)
    );

  const [userForm, userFormValid, userFormValue] =
    userDataForm('Main Information');
  const [billingAddressForm, billingAddressFormValid, billingAddressValue] =
    addressForm('Billing Address');
  const [shippingAddressForm, shippingAddressFormValid, shippingAddressValue] =
    addressForm('Shipping Address');

  return minimalLayout('Create an account')(
    form(
      userForm,
      billingAddressForm,
      formBlock(
        h3('Shipping Address'),
        p('Select the address that matches your payment method'),
        labelled(
          'Same as billing address',
          checkboxSameShippingAddress,
          'same-shipping-address',
          {
            name: 'shipping address is the same as the billing address',
            reverseOrder: true,
          }
        ).cls('checkbox-container')
      ),
      functional(() =>
        sameShippingAddress.get() ? hidden() : shippingAddressForm
      ),
      submitButton('Submit')
    )
      .cls('signup-page')
      .onSubmit(() => {
        debug('Attempting to sign up.');

        if (
          userFormValid.get() &&
          billingAddressFormValid.get() &&
          (shippingAddressFormValid.get() || sameShippingAddress.get())
        ) {
          authContext
            .attemptSignUp({
              user: userFormValue.get(),

              billingAddress: billingAddressValue.get(),

              sameShippingAddress: sameShippingAddress.get(),
              shippingAddress: shippingAddressValue.get(),

              billingAddressSaveDefault: billingAddressValue.get().saveDefault,
              shippingAddressSaveDefault:
                shippingAddressValue.get().saveDefault,
            })
            .then((success) => {
              if (success) Router.navigateTo('/');
            });
        } else {
          debug('Attempt failed, form is not valid.');
        }
      }),
    div(
      'Already have an account? ',
      link('/login', 'Log in').cls('link-subtext')
    ).cls('subtext')
  );
}, 'Sign Up | True Colors');
