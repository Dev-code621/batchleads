import PaymentMethods from './PaymentMethods'
import AddPaymentMethod from './AddPaymentMethod'

const routes = [
  {
    path: '/dashboard/settings/paymentmethod', exact: true, name: 'My Payment Methods',
  },
  {
    path: '/dashboard/settings/paymentmethod', exact: true, name: 'My Payment Methods', component: PaymentMethods,
  },
  {
    path: '/dashboard/settings/paymentmethod/add', exact: true, name: 'My Payment Methods', component: AddPaymentMethod,
  },
  {
    path: '/dashboard/settings/paymentmethod/*', exact: true, name: 'My Payment Methods', component: PaymentMethods,
  },
];

export default routes;
