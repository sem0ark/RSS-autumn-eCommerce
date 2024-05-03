let counter = 0;
export const getId = (prefix: string = '') => `${prefix}_${counter++}`;
