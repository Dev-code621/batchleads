import MyProfile from './MyProfile'
import EditProfile from './EditProfile'

const routes = [
  {
    path: '/dashboard/settings/profile', exact: true, name: 'My Profile',
  },
  {
    path: '/dashboard/settings/profile', exact: true, name: 'My Profile', component: MyProfile,
  },
  {
    path: '/dashboard/settings/profile/edit', exact: true, name: 'Edit Profile', component: EditProfile,
  },
];

export default routes;
