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

const { pfunc, pboolean } = factories;
const { h2, span, div } = htmlComponents;
const { inputText, selectInput, validated, labelled, checkboxInput } =
  inputComponents;

const formBlock = div.cls('form-block');

export const addressForm = (
  headingText: string
): [
  HTMLComponent,
  DependentProperty<[], boolean>,
  DependentProperty<
    [],
    {
      country: string;
      city: string;
      postalCode: string;
      streetName: string;
      saveDefault: boolean;
    }
  >,
] => {
  const saveDefault = pboolean(true, 'save_default');
  const checkboxSaveDefaultField = checkboxInput()
    .attr('checked')
    .onInput((e) => saveDefault.set((e.target as HTMLInputElement).checked));

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
    postalCodeValid.disable();
    postalCodeValue.set('');
  });

  const [inputStreetField, streetValid, streetValue] = validated(
    inputText(),
    streetValidators
  );

  const resultingDataCorrect = pfunc(() => {
    const city = cityValid.get();
    const country = countryValid.get();
    const postal = postalCodeValid.get();
    const street = streetValid.get();

    return city && country && postal && street;
  });

  const resultingData = pfunc(() => ({
    city: cityValue.get(),
    country: countryValue.get(),
    postalCode: postalCodeValue.get(),
    streetName: streetValue.get(),
    saveDefault: saveDefault.get(),
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
      }),

      labelled(
        `Save as default ${headingText}`,
        checkboxSaveDefaultField,
        getId('save-default'),
        {
          name: 'save as default address',
          reverseOrder: true,
        }
      ).cls('checkbox-container')
    ),
    resultingDataCorrect,
    resultingData,
  ];
};
