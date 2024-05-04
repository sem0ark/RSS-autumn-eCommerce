import { debug } from '../utilities/logging';

type EventPayload = object;
export type EventHandler = (payload: EventPayload) => void;

export class Emitter {
  private listeners = new Map<string, EventHandler[]>();

  public emit(name: string, payload: object) {
    debug(`Emitting event "${name}: `, payload);

    if (!this.listeners.has(name)) return;

    this.listeners.get(name)?.forEach((handler) => {
      handler(payload);
    });
  }

  public on(name: string, handler: EventHandler) {
    debug(`Adding new event listener on "${name}"`);

    if (!this.listeners.has(name)) this.listeners.set(name, []);
    this.listeners.get(name)?.push(handler);
  }

  public clearListeners(name: string) {
    debug(`Removing all connected listeners from ${name}`);
    this.listeners.set(name, []);
  }

  public clearAllListeners() {
    debug(`Removing all connected listeners`);
    this.listeners.clear();
  }
}

export const emitter = new Emitter();
