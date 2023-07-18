import React from 'react'
import { connect } from 'react-redux'
import { Switch, Route } from 'react-router-dom'
import routes from './routes'
import { actions as mailSignatureActions } from '~redux/modules/signature'
import { signatureSelector } from '~redux/selectors/signatureSelector'

const mapStateToProps = (state) => ({
  mailSignature: signatureSelector(state),
})

const mapDispatchToProps = {
  ...mailSignatureActions,
}

const MailSignature = (props) => (
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

export default connect(mapStateToProps, mapDispatchToProps)(MailSignature)
