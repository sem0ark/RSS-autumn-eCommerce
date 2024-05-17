import './addressDataForm.css';

import { authContext } from '../../contexts/authContext';
import { Address, CustomerDataReceived } from '../../data/authConnector';
import { factories } from '../../framework/factories';
import { htmlComponents } from '../shared/htmlComponents';
import { inputComponents } from '../shared/inputComponents';
// import { textComponents } from '../shared/textComponents';
// import { inputComponents } from '../shared/inputComponents';

const { functional, pboolean } = factories;
const { div, form, p, hidden } = htmlComponents;
// const { labelled } = inputComponents;

const {
  buttonSecondary,
  // inputText,
  // inputDate,
  // inputPassword,
  // checkboxInput,
  // validated,
  // labelled,
} = inputComponents;
// const { textSubtext } = textComponents;

const addressDataFormEntry = (
  address: Address,
  userData: CustomerDataReceived
) => {
  const changing = pboolean(false, 'addressDataFormEntry_changing');

  // const isBillingAddress = !!userData.billingAddressIds?.includes(
  //   address.id || ''
  // );
  // const isShippingAddress = !!userData.shippingAddressIds?.includes(
  //   address.id || ''
  // );

  const isDefaultBillingAddress =
    userData.defaultBillingAddressId === address.id;
  const isDefaultShippingAddress =
    userData.defaultBillingAddressId === address.id;

  return form(
    functional(() =>
      changing.get()
        ? hidden()
        : div(
            p(address.postalCode, ', ', address.city, ', ', address.country),
            p(address.streetName),
            div(
              address.key ? p(address.key).cls('address-name') : hidden(),
              isDefaultBillingAddress ? p('Billing address') : hidden(),
              isDefaultShippingAddress ? p('Shipping address') : hidden()
            ).cls('tags'),
            div(
              buttonSecondary('Remove'),
              buttonSecondary('Edit'),
              isDefaultBillingAddress
                ? hidden()
                : buttonSecondary('Set Default for Billing'),
              isDefaultShippingAddress
                ? hidden()
                : buttonSecondary('Set Default for Shipping')
            ).cls('button-container')
          ).cls('address-description')
    )
  ).cls('address-entry');
};

export const addressDataForm = () => {
  return functional(() => {
    const data = authContext.userData.get();

    if (!data)
      return div(p('No address entries found')).cls('address-data-form');

    const addresses = data.addresses;

    return div(
      ...addresses.map(
        (address) =>
          addressDataFormEntry(address, data) || [p('No address entries found')]
      )
    ).cls('address-data-form');
  });
};
