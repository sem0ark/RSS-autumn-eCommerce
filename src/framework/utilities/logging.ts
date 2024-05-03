type LoggingEntries = (object | string | number)[];

const config = {
  DEVMODE: true,
  TRACEMODE: true,
  logFunction: console.log,
};

export const disableLogging = () => {
  config.logFunction = () => {};
};

export const info = (...str: LoggingEntries) => {
  config.logFunction('INF: ', ...str);
};

export const trace =
  config.DEVMODE && config.TRACEMODE
    ? (...str: LoggingEntries) => {
        config.logFunction('TRC: ', ...str);
      }
    : () => {};

export const log = config.DEVMODE
  ? (...str: LoggingEntries) => {
      config.logFunction('DBG: ', ...str);
    }
  : () => {};

export const debug = config.DEVMODE
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
