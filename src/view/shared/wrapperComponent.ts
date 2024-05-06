import { PropertyValueType } from '../../framework/reactive_properties/types';
import { Component } from '../../framework/ui_components/component';
import { htmlComponents } from './htmlComponents';

const { div } = htmlComponents;

type CC = (Component | PropertyValueType)[];

const wrapper = (...children: CC) => div(...children).cls('wrapper');

export const containerComponents = {
  wrapper,
};
