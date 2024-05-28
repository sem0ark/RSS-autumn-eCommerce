import './addressDataForm.css';

import { authContext } from '../../contexts/authContext';
import { Address, CustomerDataReceived } from '../../data/authConnector';
import { factories } from '../../framework/factories';
import { htmlComponents } from '../shared/htmlComponents';
import { inputComponents } from '../shared/inputComponents';
import {
  cityValidators,
  countryData,
  postalCodeValidators,
  streetValidators,
} from '../../utils/validation/addressValidation';
import { FieldEditBuilder } from '../../contexts/fieldEditBuilder';
import { PBoolean } from '../../framework/reactive_properties/property';
import { getId } from '../../framework/utilities/id';
import { containerComponents } from '../shared/containerComponents';

const { functional, pboolean, pfunc } = factories;
const { div, form, p, hidden } = htmlComponents;
const { containerFlexRow } = containerComponents;

const {
  buttonPrimary,
  buttonSecondary,
  inputText,
  selectInput,
  validated,
  labelled,
} = inputComponents;

const addressDescription = (
  address: Address,
  userData: CustomerDataReceived,
  changing: PBoolean
) => {
  const isDefaultBillingAddress =
    userData.defaultBillingAddressId === address.id;
  const isDefaultShippingAddress =
    userData.defaultShippingAddressId === address.id;

  return div(
    p(
      address.postalCode,
      ', ',
      address.city,
      ', ',
      countryData.get(address.country)?.name || 'N/A'
    ),
    p('Street: ', address.streetName),
    div(
      address.key ? p(address.key).cls('address-name') : hidden(),
      isDefaultBillingAddress ? p('Billing address') : hidden(),
      isDefaultShippingAddress ? p('Shipping address') : hidden()
    ).cls('tags'),
    div(
      buttonSecondary('Remove').onClick(
        () =>
          authContext.attemptProfileUpdate(
            FieldEditBuilder.removeAddress(address.id || '')
          ),
        true
      ),
      buttonSecondary('Edit').onClick(() => changing.enable(), true),
      isDefaultBillingAddress
        ? hidden()
        : buttonSecondary('Set Default for Billing').onClick(
            () =>
              authContext.attemptProfileUpdate(
                FieldEditBuilder.setDefaultBillingAddress(address.id || '')
              ),
            true
          ),
      isDefaultShippingAddress
        ? hidden()
        : buttonSecondary('Set Default for Shipping').onClick(
            () =>
              authContext.attemptProfileUpdate(
                FieldEditBuilder.setDefaultShippingAddress(address.id || '')
              ),
            true
          )
    ).cls('button-container')
  ).cls('address-description');
};

const addressEditForm = (address: Address, changing: PBoolean) => {
  const [inputCityField, , cityValue] = validated(inputText(), cityValidators);

  const [inputCountryField, , countryValue] = validated(
    selectInput(
      [...countryData.entries()].map(([code, data]) => [code, data.name]),
      address.country
    ),
    cityValidators
  );

  const [inputPostalCodeField, postalCodeValid, postalCodeValue] = validated(
    inputText(),
    postalCodeValidators(countryValue)
  );

  countryValue.onChange(() => {
    (inputPostalCodeField.getNode() as HTMLInputElement).value = '';
    postalCodeValid.disable();
    postalCodeValue.set('');
  });

  const [inputStreetField, , streetValue] = validated(
    inputText(),
    streetValidators
  );

  const resultingData = pfunc(() => ({
    city: cityValue.get(),
    country: countryValue.get(),
    postalCode: postalCodeValue.get(),
    streetName: streetValue.get(),
  }));

  return form(
    labelled(
      'Town / City *',
      inputCityField.attr('value', address.city),
      getId('city'),
      {
        required: true,
      }
    ),
    labelled(
      'Country *',
      inputCountryField.attr('value', address.country),
      getId('country'),
      {
        required: true,
      }
    ),
    labelled(
      'Postal Code *',
      inputPostalCodeField.attr('value', address.postalCode),
      getId('postal-code'),
      {
        required: true,
      }
    ),
    labelled(
      'Street *',
      inputStreetField.attr('value', address.streetName),
      getId('street'),
      {
        required: true,
      }
    ),
    containerFlexRow({ gap: 10 })(
      buttonPrimary('Save changes').attr('type', 'submit'),
      buttonSecondary('Cancel').onClick(() => changing.disable(), true)
    )
  )
    .cls('address-form')
    .onSubmit(
      () =>
        authContext.attemptProfileUpdate(
          FieldEditBuilder.changeAddress(resultingData.get(), address.id || '')
        ),
      true
    );
};

const addressAddForm = (changing: PBoolean) => {
  const [inputCityField, , cityValue] = validated(inputText(), cityValidators);

  const [inputCountryField, , countryValue] = validated(
    selectInput(
      [...countryData.entries()].map(([code, data]) => [code, data.name])
    ),
    cityValidators
  );

  const [inputPostalCodeField, postalCodeValid, postalCodeValue] = validated(
    inputText(),
    postalCodeValidators(countryValue)
  );

  countryValue.onChange(() => {
    (inputPostalCodeField.getNode() as HTMLInputElement).value = '';
    postalCodeValid.disable();
    postalCodeValue.set('');
  });

  const [inputStreetField, , streetValue] = validated(
    inputText(),
    streetValidators
  );

  const resultingData = pfunc(() => ({
    city: cityValue.get(),
    country: countryValue.get(),
    postalCode: postalCodeValue.get(),
    streetName: streetValue.get(),
  }));

  return form(
    labelled('Town / City *', inputCityField, getId('city'), {
      required: true,
    }),
    labelled('Country *', inputCountryField, getId('country'), {
      required: true,
    }),
    labelled('Postal Code *', inputPostalCodeField, getId('postal-code'), {
      required: true,
    }),
    labelled('Street *', inputStreetField, getId('street'), {
      required: true,
    }),
    div(
      buttonPrimary('Add').attr('type', 'submit'),
      buttonSecondary('Cancel').onClick(() => changing.disable(), true)
    ).cls('button-container')
  )
    .cls('address-form')
    .onSubmit(() => {
      authContext
        .attemptProfileUpdate(FieldEditBuilder.addAddress(resultingData.get()))
        .then((success) => success && changing.disable());
    }, true);
};

const addressDataFormEntry = (
  address: Address,
  userData: CustomerDataReceived
) => {
  const changing = pboolean(false, 'addressDataFormEntry_changing');

  return form(
    functional(() =>
      changing.get()
        ? addressEditForm(address, changing)
        : addressDescription(address, userData, changing)
    )
  ).cls('address-entry');
};

export const addressDataForm = () => {
  const addingNewAddress = pboolean(false, 'addressDataForm_addingNewAddress');

  return functional(() => {
    const data = authContext.userData.get();

    if (!data)
      return div(p('No address entries found')).cls('address-data-form');

    const addresses = data.addresses;

    return div(
      ...addresses.map((address) => addressDataFormEntry(address, data)),

      functional(() =>
        !addingNewAddress.get() && addresses.length === 0
          ? p('No address entries found, please add a new one')
          : hidden()
      ),

      functional(() =>
        addingNewAddress.get()
          ? addressAddForm(addingNewAddress).cls('address-entry')
          : hidden()
      ),

      functional(() =>
        addingNewAddress.get()
          ? hidden()
          : buttonPrimary('New Address').onClick(() =>
              addingNewAddress.enable()
            )
      )
    ).cls('address-data-form');
  });
};
