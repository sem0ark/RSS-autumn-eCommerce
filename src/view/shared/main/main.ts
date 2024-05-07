import { htmlComponents } from '../htmlComponents';
import { Component } from '../../../framework/ui_components/component';
import { PropertyValueType } from '../../../framework/reactive_properties/types';

const { main, div } = htmlComponents;

type CC = (Component | PropertyValueType)[];

const mainContainer = (...children: CC) =>
  main(...children)
    .cls('main')
    .add(div('main').cls('main-container', '_container'));

export const mainComponents = {
  mainContainer,
};
