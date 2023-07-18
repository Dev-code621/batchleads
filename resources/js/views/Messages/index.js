import React from 'react'
import { connect } from 'react-redux'
import { Switch, Route } from 'react-router-dom'
import routes from './routes'
import { actions as messageActions } from '~redux/modules/message'
import { actions as propertyActions } from '~redux/modules/property'
import { messageSelector } from '~redux/selectors/messageSelector'

const mapStateToProps = (state) => ({
  message: messageSelector(state),
})

const mapDispatchToProps = {
  ...messageActions,
  ...propertyActions,
}

const Messages = (props) => (
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

export default connect(mapStateToProps, mapDispatchToProps)(Messages)
