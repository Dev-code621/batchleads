import React from 'react'
import { connect } from 'react-redux'
import { Switch, Route } from 'react-router-dom'
import { userSelector } from '~redux/selectors/userSelector'
import { actions as userActions } from '~redux/modules/user'
import routes from './routes'

const mapStateToProps = (state) => ({
  user: userSelector(state),
})

const mapDispatchToProps = {
  ...userActions,
}

const Team = (props) => (
  <Switch>
    {routes.map((route) => route.component && (
      <Route
        key={route.name}
        path={route.path}
        exact={route.exact}
        name={route.name}
        render={() => (
          <route.component
            {...props}
          />
        )}
      />
    ))}
  </Switch>
)

export default connect(mapStateToProps, mapDispatchToProps)(Team)
