import './signupPage.css';

import { htmlComponents } from '../shared/htmlComponents';
import { inputComponents } from '../shared/inputComponents';
import { factories } from '../../framework/factories';
import { HTMLComponent } from '../../framework/ui_components/htmlComponent';
import { DependentProperty } from '../../framework/reactive_properties/property';
import {
  cityValidators,
  countryData,
  postalCodeValidators,
  streetValidators,
} from '../../utils/validation/addressValidation';
import { getId } from '../../framework/utilities/id';

const { pfunc } = factories;
const { h2, span, div } = htmlComponents;
const { inputText, selectInput, validated, labelled } = inputComponents;

const formBlock = div.cls('form-block');

export const addressForm = (
  headingText: string
): [
  HTMLComponent,
  DependentProperty<[], boolean>,
  DependentProperty<[], object>,
] => {
  const [inputCityField, cityValid, cityValue] = validated(
    inputText(),
    cityValidators
  );

  const [inputCountryField, countryValid, countryValue] = validated(
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
  });

  const [inputStreetField, streetValid, streetValue] = validated(
    inputText(),
    streetValidators
  );

  const resultingDataCorrect = pfunc(
    () =>
      cityValid.get() &&
      countryValid.get() &&
      postalCodeValid.get() &&
      streetValid.get()
  );
  const resultingData = pfunc(() => ({
    city: cityValue.get(),
    country: countryValue.get(),
    postalCode: postalCodeValue.get(),
    street: streetValue.get(),
  }));

  return [
    formBlock(
      h2(span(), headingText),
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
      })
    ),
    resultingDataCorrect,
    resultingData,
  ];
};
