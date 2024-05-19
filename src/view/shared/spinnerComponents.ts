import { htmlComponents } from './htmlComponents';

const { span, div } = htmlComponents;

export const spinnerComponents = {
  spinner: () => div(span().cls('loader-spinner')),
};
