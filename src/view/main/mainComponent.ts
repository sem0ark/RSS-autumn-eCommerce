import { htmlComponents } from '../shared/htmlComponents';
import { Component } from '../../framework/ui_components/component';
import { PropertyValueType } from '../../framework/reactive_properties/types';
import background from '../../../assets/background.jpg';

const { main, div, img, h1, p, button } = htmlComponents;

type CC = (Component | PropertyValueType)[];

const mainContainerMP = (...children: CC) =>
  main(...children)
    .cls('main', 'main-logo-page')
    .add(
      div()
        .cls('background-logo-img-container')
        .add(
          div().cls('background-shadow'),
          img(background).cls('background-logo-img')
        )
    )
    .add(
      div()
        .cls('main-page-container', '_container')
        .add(
          h1('Flower salon').cls('title-main-page'),
          p(
            'Choose one of the ready-made bouquets or order a unique one that will meet all your wishes'
          ).cls('subtitle-main-page'),
          button('Go to Catalog').cls('btn', 'active')
        )
    );

export const mainComponents = {
  mainContainerMP,
};
