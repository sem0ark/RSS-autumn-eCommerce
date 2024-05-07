import { factories } from '../../src/framework/factories';

describe('Test functionality of HTML Component', () => {
  it('should copy itself any call to HTMLComponent method', () => {
    const button = factories.htmlConstructor('button');
    const buttonPrimary = button.cls('123', '234');
    const buttonPrimaryActive = buttonPrimary.cls('active');

    expect(buttonPrimary).not.toEqual(buttonPrimaryActive);
  });
});
