import Settings from './Settings'
import Profile from './Profile'
import PaymentMethod from './PaymentMethod'
import Credit from './Credit'
import PhoneNumbers from './PhoneNumbers'
import Notifications from './Notifications'
import ChangePassword from './ChangePassword'
import Plans from './Plans'
import DataManagement from './DataManagement'
import AddOns from './AddOns'
import AutoRecharge from './AutoRecharge'
import Team from '~views/Team'
import Affiliates from '~views/Affiliates'
import Folders from './Folders'

const routes = [
  {
    path: '/dashboard/settings', exact: true, name: 'Settings',
  },
  {
    path: '/dashboard/settings', exact: true, name: 'Settings', component: Settings,
  },
  {
    path: '/dashboard/settings/profile', exact: true, name: 'Profile', component: Profile,
  },
  {
    path: '/dashboard/settings/profile/*', exact: true, name: 'Profile', component: Profile,
  },
  {
    path: '/dashboard/settings/paymentmethod', exact: true, name: 'Payment Method', component: PaymentMethod,
  },
  {
    path: '/dashboard/settings/paymentmethod/*', exact: true, name: 'Payment Method', component: PaymentMethod,
  },
  {
    path: '/dashboard/settings/credit', exact: true, name: 'Credits', component: Credit,
  },
  {
    path: '/dashboard/settings/credit/*', exact: true, name: 'Credits', component: Credit,
  },
  {
    path: '/dashboard/settings/phonenumbers', exact: true, name: 'Phone Numbers', component: PhoneNumbers,
  },
  {
    path: '/dashboard/settings/phonenumbers/*', exact: true, name: 'Phone Numbers', component: PhoneNumbers,
  },
  {
    path: '/dashboard/settings/notifications', exact: true, name: 'Phone Numbers', component: Notifications,
  },
  {
    path: '/dashboard/settings/changepassword', exact: true, name: 'Phone Numbers', component: ChangePassword,
  },
  {
    path: '/dashboard/settings/datamanagement', exact: true, name: 'Data Management', component: DataManagement,
  },
  {
    path: '/dashboard/settings/datamanagement/*', exact: true, name: 'Data Management', component: DataManagement,
  },
  {
    path: '/dashboard/settings/plans', exact: true, name: 'Plans', component: Plans,
  },
  {
    path: '/dashboard/settings/addons/:id?', exact: true, name: 'Phone Numbers', component: AddOns,
  },
  {
    path: '/dashboard/settings/autorecharge', exact: true, name: 'Phone Numbers', component: AutoRecharge,
  },
  {
    path: '/dashboard/teams', exact: true, name: 'Team', component: Team,
  },
  {
    path: '/dashboard/teams/*', exact: true, name: 'Team', component: Team,
  },
  {
    path: '/dashboard/settings/folders', exact: true, name: 'Folders', component: Folders,
  },
  {
    path: '/dashboard/settings/folders/*', exact: true, name: 'Folders', component: Folders,
  },
  {
    path: '/dashboard/affiliates', exact: true, name: 'Affiliates', component: Affiliates,
  },
  {
    path: '/dashboard/settings/*', exact: true, name: 'Settings', component: Settings,
  },
];

export default routes;
