import React from 'react'
import { connect } from 'react-redux'
import { Switch, Route } from 'react-router-dom'
import routes from './routes'
import { actions as smsTemplateActions } from '~redux/modules/smsTemplate'
import { smsTemplateSelector } from '~redux/selectors/smsTemplateSelector'

const mapStateToProps = (state) => ({
  smsTemplate: smsTemplateSelector(state),
})

const mapDispatchToProps = {
  ...smsTemplateActions,
}

const SmsTemplate = (props) => (
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

export default connect(mapStateToProps, mapDispatchToProps)(SmsTemplate)
