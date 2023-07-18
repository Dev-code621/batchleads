import Members from './Members'
import Invite from './Invite'
import Member from './Member'

const routes = [
  {
    path: '/dashboard/teams', exact: true, name: 'Teams',
  },
  {
    path: '/dashboard/teams', exact: true, name: 'Teams', component: Members,
  },
  {
    path: '/dashboard/teams/invite', exact: true, name: 'Team Invitation', component: Invite,
  },
  {
    path: '/dashboard/teams/member', exact: true, name: 'Team Member', component: Member,
  },
];

export default routes;
