import { Emitter } from '../../src/framework/event_handling/emitter';
import { disableLogging } from '../../src/framework/utilities/logging';

describe('Test Emitter functionality', () => {
  beforeEach(() => {
    disableLogging();
  });

  it('should call events', () => {
    const cb = jest.fn();
    const em = new Emitter();

    const payload = {
      data: 'some text data',
    };

    em.on('test event', cb);

    em.emit('test event', payload);

    expect(cb).toHaveBeenCalledTimes(1);
    expect(cb).toHaveBeenCalledWith(payload);
  });

  it('should call events in same number of times, the callback was added', () => {
    const cb = jest.fn();
    const em = new Emitter();

    const payload = {
      data: 'some text data',
    };

    em.on('test event', cb);
    em.on('test event', cb);

    em.emit('test event', payload);

    expect(cb).toHaveBeenCalledTimes(2);
    expect(cb).toHaveBeenCalledWith(payload);
  });
});
