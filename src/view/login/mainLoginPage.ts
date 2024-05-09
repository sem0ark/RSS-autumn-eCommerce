import { htmlComponents } from '../shared/htmlComponents';
import { Component } from '../../framework/ui_components/component';
import { PropertyValueType } from '../../framework/reactive_properties/types';
import background from '../../../assets/background.jpg';
import { formComponents } from './form';

const { main, div, img } = htmlComponents;
const { formContainer } = formComponents;

type CC = (Component | PropertyValueType)[];

const mainContainer = (...children: CC) =>
  main(...children)
    .cls('main', 'main-logo-page')
    .add(
      div()
        .cls('background-logo-img-container')
        .add(img(background).cls('background-logo-img'))
    )
    .add(
      div().cls('main-logo-page-container', '_container').add(formContainer())
    );

export const mainComponents = {
  mainContainer,
};
