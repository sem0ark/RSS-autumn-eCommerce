import './signupPage.css';

import { Page } from '../../framework/ui_components/page';
import { htmlComponents } from '../shared/htmlComponents';
import { minimalLayout } from '../shared/layouts/minimalLayout';
import { inputComponents } from '../shared/inputComponents';
import { userDataForm } from './userDataForm';
import { addressForm } from './addressForm';
import { factories } from '../../framework/factories';

const { pboolean, functional } = factories;
const { form, div, h3, p, hidden } = htmlComponents;
const { submitButton, checkboxInput, labelled } = inputComponents;

const formBlock = div.cls('form-block');

export const signupPage = new Page(() => {
  const sameShippingAddress = pboolean(false, 'same_shipping_address');
  const checkboxSameShippingAddress = checkboxInput()
    .cls('checkbox-password')
    .onInput((e) =>
      sameShippingAddress.set((e.target as HTMLInputElement).checked)
    );

  const [userForm] = userDataForm('Main Information');
  const [billingAddressForm] = addressForm('Billing Address');
  const [shippingAddressForm] = addressForm('Shipping Address');

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
      .onSubmit(() => {})
  );
}, 'Login | True Colors');
