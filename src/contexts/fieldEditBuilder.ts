import { Address } from '../utils/dataAndTyping/authDTO';

type ActionCode =
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

export type ProfileUpdateAction = Record<string, string | object> & {
  action: ActionCode;
};

export class FieldEditBuilder {
  public static setFirstName(name: string): ProfileUpdateAction {
    return {
      action: 'setFirstName',
      firstName: name,
    };
  }

  public static setLastName(name: string): ProfileUpdateAction {
    return {
      action: 'setLastName',
      lastName: name,
    };
  }

  public static changeEmail(value: string): ProfileUpdateAction {
    return {
      action: 'changeEmail',
      email: value,
    };
  }

  public static addAddress(address: Address): ProfileUpdateAction {
    return {
      action: 'addAddress',
      address,
    };
  }

  public static changeAddress(
    address: Address,
    addressId: string
  ): ProfileUpdateAction {
    return {
      action: 'changeAddress',
      addressId,
      address,
    };
  }

  public static removeAddress(addressId: string): ProfileUpdateAction {
    return {
      action: 'removeAddress',
      addressId,
    };
  }

  public static setDateOfBirth(dateOfBirth: string): ProfileUpdateAction {
    return {
      action: 'setDateOfBirth',
      dateOfBirth,
    };
  }

  public static setDefaultBillingAddress(
    addressId: string
  ): ProfileUpdateAction {
    return {
      action: 'setDefaultBillingAddress',
      addressId,
    };
  }

  public static setDefaultShippingAddress(
    addressId: string
  ): ProfileUpdateAction {
    return {
      action: 'setDefaultShippingAddress',
      addressId,
    };
  }

  public static addShippingAddressId(addressId: string): ProfileUpdateAction {
    return {
      action: 'addShippingAddressId',
      addressId,
    };
  }

  public static addBillingAddressId(addressId: string): ProfileUpdateAction {
    return {
      action: 'addBillingAddressId',
      addressId,
    };
  }

  public static removeShippingAddressId(
    addressId: string
  ): ProfileUpdateAction {
    return {
      action: 'removeShippingAddressId',
      addressId,
    };
  }

  public static removeBillingAddressId(addressId: string): ProfileUpdateAction {
    return {
      action: 'removeBillingAddressId',
      addressId,
    };
  }
}
