import React, { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Polyline, Marker } from '@react-google-maps/api'

import { getRoutingColor } from '~common/helper'
import { getHomeDrivingRoutes } from '~redux/modules/drivingRoutes';
import { homeDrivingRouteSelector } from '~redux/selectors/drivingRoutesSelector';

const routeOptions = {
  strokeColor: '#0c7de3',
  strokeOpacity: 1,
  strokeWeight: 5,
  fillColor: '#0c7de3',
  fillOpacity: 0.35,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
  radius: 30000,
  zIndex: 1,
}

export const HomeDrivingRoutes = ({ showDrivingRoutes }) => {
  if (!showDrivingRoutes) {
    return null;
  }
  const routes = useSelector(homeDrivingRouteSelector);
  return (
    <Fragment>
      {
        routes && routes.map((route) => (
          <Fragment key={route.created_at}>
            <Polyline
              path={route.gps}
              options={{ ...routeOptions, strokeColor: getRoutingColor(route.created_at) }}
            />
            <Marker position={route.gps[0]} />
            <Marker position={route.gps[route.gps.length - 1]} />
          </Fragment>
        ))
      }
    </Fragment>
  )
};
