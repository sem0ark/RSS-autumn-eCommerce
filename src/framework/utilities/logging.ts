import { DEVMODE, TRACEMODE } from './config';

type LoggingEntries = (object | string | number)[];

export const info = (...str: LoggingEntries) => {
  console.log('INF: ', ...str);
};

export const trace =
  DEVMODE && TRACEMODE
    ? (...str: LoggingEntries) => {
        console.log('TRC: ', ...str);
      }
    : () => {};

export const log = DEVMODE
  ? (...str: LoggingEntries) => {
      console.log('DBG: ', ...str);
    }
  : () => {};

export const debug = DEVMODE
  ? (...str: LoggingEntries) => {
      console.log('DBG: ', ...str);
    }
  : () => {};

export const warn = (...str: LoggingEntries) => {
  console.log('WRN: ', ...str);
};

export const error = (...str: LoggingEntries) => {
  console.error('ERR: ', ...str);
};
