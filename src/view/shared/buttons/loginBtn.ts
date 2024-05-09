import { htmlComponents } from '../htmlComponents';

const { button } = htmlComponents;

export const loginBtn = () => button('Login').cls('login-btn', 'btn', 'active');
