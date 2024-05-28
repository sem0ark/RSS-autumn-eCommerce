/**
 * Address object interface based on the commerce tools documentation and RSS requirements.
 */
export interface Address {
  id?: string;
  key?: string;
  // title: string;
  // firstName: string;
  // lastName: string;

  country: string;
  city: string;
  postalCode: string;
  streetName: string;
  // streetNumber: string;

  // phone: string;
  // mobile: string;
  // email: string;
}
