import ImportData from './Import'
import ExportData from './Export'
import Menu from './Menu'

const routes = [
  {
    path: '/dashboard/settings/datamanagement', exact: true, name: 'Data Management',
  },
  {
    path: '/dashboard/settings/datamanagement', exact: true, name: 'Data Management', component: Menu,
  },
  {
    path: '/dashboard/settings/datamanagement/import', exact: true, name: 'Import Data', component: ImportData,
  },
  {
    path: '/dashboard/settings/datamanagement/export', exact: true, name: 'Export Data', component: ExportData,
  },
];

export default routes;
