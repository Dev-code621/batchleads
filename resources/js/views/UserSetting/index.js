import React from 'react'
import { connect } from 'react-redux'
import { Switch, Route } from 'react-router-dom'
import { userSelector } from '~redux/selectors/userSelector'
import { creditSelector } from '~redux/selectors/creditSelector'
import { actions as userActions } from '~redux/modules/user'
import { actions as creditActions } from '~redux/modules/credit'
import routes from './routes'

const mapStateToProps = (state) => ({
  user: userSelector(state),
  credit: creditSelector(state),
})

const mapDispatchToProps = {
  ...userActions,
  ...creditActions,
}

const Setting = (props) => {
  return (
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
}

export default connect(mapStateToProps, mapDispatchToProps)(Setting)
