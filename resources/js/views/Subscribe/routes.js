import ChoosePlan from '~views/ChoosePlan';
import Payment from '~views/Payment';

const routes = [
  {
    path: '/subscribe', exact: true, name: 'ChoosePlan', component: ChoosePlan,
  },
  {
    path: '/subscribe/choosePlan', exact: true, name: 'ChoosePlan', component: ChoosePlan,
  },
  {
    path: '/subscribe/payment/:planId', exact: true, name: 'Payment', component: Payment,
  },
  {
    path: '/subscribe/*', exact: true, name: 'ChoosePlan', component: ChoosePlan,
  },
];

export default routes;
