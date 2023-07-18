import MyPhoneNumbers from './MyPhoneNumbers'
import PurchasePhoneNumber from './PurchasePhoneNumber'
import CallForward from './CallForward'

const routes = [
  {
    path: '/dashboard/settings/phonenumbers', exact: true, name: 'My Phone Numbers',
  },
  {
    path: '/dashboard/settings/phonenumbers', exact: true, name: 'My Phone Numbers', component: MyPhoneNumbers,
  },
  {
    path: '/dashboard/settings/phonenumbers/purchase', exact: true, name: 'Purchase Phone Number', component: PurchasePhoneNumber,
  },
  {
    path: '/dashboard/settings/phonenumbers/callforward', exact: true, name: 'Call Forward', component: CallForward,
  },
  {
    path: '/dashboard/settings/phonenumbers/*', exact: true, name: 'My Phone Numbers', component: MyPhoneNumbers,
  },
];

export default routes;
