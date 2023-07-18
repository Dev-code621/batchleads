import MyCredit from './MyCredit'
import Transactions from './Transactions'
import Buy from './Buy'

const routes = [
  {
    path: '/dashboard/settings/credit', exact: true, name: 'Credit',
  },
  {
    path: '/dashboard/settings/credit', exact: true, name: 'My Credit', component: MyCredit,
  },
  {
    path: '/dashboard/settings/credit/transaction', exact: true, name: 'Transaction History', component: Transactions,
  },
  {
    path: '/dashboard/settings/credit/buy', exact: true, name: 'Buy Credit', component: Buy,
  },
  {
    path: '/dashboard/settings/credit/*', exact: true, name: 'My Credit', component: MyCredit,
  },
];

export default routes;
