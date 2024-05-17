// import { authContext } from '../../contexts/authContext';
// import { Address } from '../../data/authConnector';
// import { factories } from '../../framework/factories';
// import { htmlComponents } from '../shared/htmlComponents';

// const { functional, pboolean } = factories;
// const { div, form, hidden } = htmlComponents;

// const addressDataFormEntry = (address: Address) => {
//   // const changing = pboolean(false, 'addressDataFormEntry_changing');

//   return form();
// };

// export const addressDataForm = () => {
//   return functional(() => {
//     return div(
//       ...(authContext.userData.get()?.addresses.map(addressDataFormEntry) || [
//         hidden(),
//       ])
//     ).cls('address-data-form');
//   });
// };
