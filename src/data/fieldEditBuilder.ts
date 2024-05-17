export type ActionCode =
  | 'setFirstName'
  | 'setLastName'
  | 'changeEmail'
  | 'addAddress'
  | 'changeAddress'
  | 'removeAddress'
  | 'setDateOfBirth'
  | 'setDefaultBillingAddress'
  | 'setDefaultShippingAddress'
  | 'addShippingAddressId'
  | 'addBillingAddressId'
  | 'removeShippingAddressId'
  | 'removeBillingAddressId';

export type ProfileChangeAction = Record<string, string | object> & {
  action: ActionCode;
};

export class FieldEditBuilder {
  public static changeFirstName(name: string): ProfileChangeAction {
    return {
      action: 'setFirstName',
      firstName: name,
    };
  }

  public static changeLastName(name: string): ProfileChangeAction {
    return {
      action: 'setLastName',
      lastName: name,
    };
  }
}
