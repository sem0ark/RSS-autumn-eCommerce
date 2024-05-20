let counter = 0;

/**
 * Will generate ID numbers, incrementally.
 * @param prefix Optional, add some string prefix to unique ID
 * @returns
 */
export const getId = (prefix: string = '') => `${prefix}_${counter++}`;
