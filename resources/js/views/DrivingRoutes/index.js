import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { connect } from 'react-redux'
import routes from './routes'
import { actions as drivingRoutesActions } from '~redux/modules/drivingRoutes'
import { drivingRoutesSelector } from '~redux/selectors/drivingRoutesSelector'

const mapStateToProps = (state) => ({
  drivingRoutes: drivingRoutesSelector(state),
})

const mapDispatchToProps = {
  ...drivingRoutesActions,
}

const DrivingRoutesList = ({
  getDrivingRoutes, drivingRoutes, initDrivingRoutes, setDrivingRoute, deleteDrivingRoute, initDeleteResult,
}) => {
  return (
    <Switch>
      {routes.map((route) => {
        return route.component ? (
          <Route
            key={route.name}
            path={route.path}
            exact={route.exact}
            name={route.name}
            render={(props) => (
              <route.component
                {...props}
                delete
                getDrivingRoutes={getDrivingRoutes}
                drivingRoutes={drivingRoutes}
                initDrivingRoutes={initDrivingRoutes}
                setDrivingRoute={setDrivingRoute}
                initDeleteResult={initDeleteResult}
                deleteDrivingRoute={deleteDrivingRoute}
              />
            )}
          />
        ) : null
      })}
    </Switch>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(DrivingRoutesList)
