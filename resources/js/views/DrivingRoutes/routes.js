import DrivingRouteList from './DrivingRouteList'

const routes = [
  {
    path: '/dashboard/drivingRoutes', exact: true, name: 'Driving Routes',
  },
  {
    path: '/dashboard/drivingRoutes', exact: true, name: 'Driving Routes', component: DrivingRouteList,
  },
  {
    path: '/dashboard/drivingRoutes/*', exact: true, name: 'Driving Routes', component: DrivingRouteList,
  },
];

export default routes
