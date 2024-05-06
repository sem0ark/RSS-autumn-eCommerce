import './nav.css';
import { htmlComponents } from '../htmlComponents';
import { Component } from '../../../framework/ui_components/component';
import { PropertyValueType } from '../../../framework/reactive_properties/types';
import { registerBtn } from '../buttons/registerBtn';
import { loginBtn } from '../buttons/loginBtn';
import { userProfileBtn } from '../buttons/userProfileBtn';
import { shoppingCartBtn } from '../buttons/shoppingCartBtn';

const { div, header, nav, ul, li, a } = htmlComponents;

type CC = (Component | PropertyValueType)[];

const navElement = (...children: CC) =>
  header(...children)
    .cls('header')
    .add(
      div()
        .cls('header-container', '_container')
        .add(div().cls('logo'))
        .add(
          div()
            .cls('header-nav-container')
            .add(
              nav()
                .cls('header-nav')
                .add(
                  ul()
                    .cls('header-list')
                    .add(
                      li()
                        .cls('header-item')
                        .add(a('/', 'Home').cls('header-link', 'active-link')),
                      li()
                        .cls('header-item')
                        .add(
                          a('/catalog', 'Catalog product').cls('header-link')
                        ),
                      li()
                        .cls('header-item')
                        .add(a('/about', 'About us').cls('header-link'))
                    )
                )
            )
            .add(
              div()
                .cls('header-btn-container')
                .add(registerBtn())
                .add(loginBtn())
            )
        )
        .add(
          div()
            .cls('header-btn-container')
            .add(userProfileBtn())
            .add(shoppingCartBtn())
        )
    );
export const navContainer = {
  navElement,
};
