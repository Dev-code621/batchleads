import React from 'react'
import { connect } from 'react-redux'
import { Switch, Route } from 'react-router-dom'
import routes from './routes'
import { actions as propertyActions } from '~redux/modules/property'
import { propertySelector } from '~redux/selectors/propertySelector'

const mapStateToProps = (state) => ({
  property: propertySelector(state),
})

const mapDispatchToProps = {
  ...propertyActions,
}

const Property = (props) => (
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

export default connect(mapStateToProps, mapDispatchToProps)(Property)
