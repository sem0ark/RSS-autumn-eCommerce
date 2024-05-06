import { htmlComponents } from '../htmlComponents';

const { button } = htmlComponents;

export const registerBtn = () => button('Register').cls('register-btn', 'btn');
