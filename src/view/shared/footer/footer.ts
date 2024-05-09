import './footer.css';
import { htmlComponents } from '../htmlComponents';
import { Component } from '../../../framework/ui_components/component';
import { PropertyValueType } from '../../../framework/reactive_properties/types';

const { footer, div } = htmlComponents;

type CC = (Component | PropertyValueType)[];

const footerContainer = (...children: CC) =>
  footer(...children)
    .cls('footer')
    .add(div('footer').cls('footer-container', '_container'));

export const footerComponents = {
  footerContainer,
};
