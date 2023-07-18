import MessageBox from './MessageBox'
import MessageHistory from './MessageHistory'

const routes = [
  {
    path: '/dashboard/messages', exact: true, name: 'Messages',
  },
  {
    path: '/dashboard/messages', exact: true, name: 'Messages', component: MessageBox,
  },
  {
    path: '/dashboard/messages/:masterId', exact: true, name: 'Message History', component: MessageHistory,
  },
  {
    path: '/dashboard/messages/*', exact: true, name: 'Messages', component: MessageBox,
  },
];

export default routes;
