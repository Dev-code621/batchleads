import React from 'react'
import { connect } from 'react-redux'
import { Switch, Route } from 'react-router-dom'
import routes from './routes'
import { actions as mailTemplateActions } from '~redux/modules/mailTemplate'
import { mailTemplateSelector } from '~redux/selectors/mailTemplateSelector'

const mapStateToProps = (state) => ({
  mailTemplate: mailTemplateSelector(state),
})

const mapDispatchToProps = {
  ...mailTemplateActions,
}

const MailTemplate = (props) => (
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

export default connect(mapStateToProps, mapDispatchToProps)(MailTemplate)
