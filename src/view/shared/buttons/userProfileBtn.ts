import { htmlComponents } from '../htmlComponents';
import { PropertyValueType } from '../../../framework/reactive_properties/types';
import { Component } from '../../../framework/ui_components/component';
import '../../../../assets/icon-user-profile.svg';

const { button, iconSvg } = htmlComponents;

type CC = (Component | PropertyValueType)[];

export const userProfileBtn = (...children: CC) =>
  button(...children)
    .cls('user-profile-btn', 'icon-btn')
    .add(iconSvg('../../../../assets/icon-user-profile.svg'));
