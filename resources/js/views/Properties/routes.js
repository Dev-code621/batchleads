import Properties from './PropertiesList'
import PropertyDetail from './PropertyDetail'
import PropertyFilter from './PropertyListFilter'
import PropertyActivities from './PropertyActivities'

const routes = [
  {
    path: '/dashboard/properties', exact: true, name: 'Properties',
  },
  {
    path: '/dashboard/properties', exact: true, name: 'Properties', component: Properties,
  },
  {
    path: '/dashboard/properties/new', exact: true, name: 'New Property', component: PropertyDetail,
  },
  {
    path: '/dashboard/properties/detail', exact: true, name: 'Property Detail', component: PropertyDetail,
  },
  {
    path: '/dashboard/properties/detail/activities', exact: true, name: 'Property Activities', component: PropertyActivities,
  },
  {
    path: '/dashboard/properties/filter', exact: true, name: 'Property Filter', component: PropertyFilter,
  },
  {
    path: '/dashboard/properties/:isSelect', exact: true, name: 'Properties', component: Properties,
  },
];

export default routes;
