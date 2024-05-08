import { htmlComponents } from '../htmlComponents';

const { button } = htmlComponents;

export const registerBtn = () => button('Sing up').cls('register-btn', 'btn');
