import ManageAll from './ManageAll'
import ManageFolders from './ManageFolders'
import ManageStatus from './ManageStatus'
import ManageTags from './ManageTags'

const routes = [
  {
    path: '/dashboard/settings/folders', exact: true, name: 'Folders & Tags',
  },
  {
    path: '/dashboard/settings/folders', exact: true, name: 'Folders & Tags', component: ManageAll,
  },
  {
    path: '/dashboard/settings/folders/managefolders', exact: true, name: 'Manage and organize your folders', component: ManageFolders,
  },
  {
    path: '/dashboard/settings/folders/managestatus', exact: true, name: 'Manage and organize your statuses', component: ManageStatus,
  },
  {
    path: '/dashboard/settings/folders/managetags', exact: true, name: 'Manage and organize your tags', component: ManageTags,
  },
  {
    path: '/dashboard/settings/folders/*', exact: true, name: 'Folders & Tags', component: ManageAll,
  },
];

export default routes;
