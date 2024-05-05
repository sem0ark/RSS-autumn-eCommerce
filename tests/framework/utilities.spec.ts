import { getId } from '../../src/framework/utilities/id';

describe('Test utility functions - id function', () => {
  it('should have correct prefix', () => {
    const pref = 'prefix';
    const res = getId(pref);
    expect(res.startsWith(pref)).toBeTruthy();
  });

  it('should be increasing', () => {
    const pref = 'prefix';
    const res1 = getId(pref);
    const res2 = getId(pref);
    expect(res1 < res2).toBeTruthy();
  });
});
