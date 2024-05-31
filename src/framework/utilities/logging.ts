type LoggingEntries = (object | string | number)[];

const DEVMODE = true;
const TRACEMODE = false;

const config = {
  logFunction: console.log,
};

export const disableLogging = () => {
  config.logFunction = () => {};
};

export const enableLogging = () => {
  config.logFunction = console.log;
};

export const info = (...str: LoggingEntries) => {
  config.logFunction('INF: ', ...str);
};

export const trace =
  DEVMODE && TRACEMODE
    ? (...str: LoggingEntries) => {
        config.logFunction('TRC: ', ...str);
      }
    : () => {};

export const log = DEVMODE
  ? (...str: LoggingEntries) => {
      config.logFunction('DBG: ', ...str);
    }
  : () => {};

export const debug = DEVMODE
  ? (...str: LoggingEntries) => {
      config.logFunction('DBG: ', ...str);
    }
  : () => {};

export const warn = (...str: LoggingEntries) => {
  config.logFunction('WRN: ', ...str);
};

export const error = (...str: LoggingEntries) => {
  console.error('ERR: ', ...str);
};
