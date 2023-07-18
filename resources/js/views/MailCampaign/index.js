import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { connect } from 'react-redux'

import routes from './routes'
import { actions as mailCampaignActions } from '~redux/modules/mailCampaign'
import { actions as propertyActions } from '~redux/modules/property'
import { actions as mailTemplateActions } from '~redux/modules/mailTemplate'
import { actions as signatureActions } from '~redux/modules/signature'
import { mailCampaignSelector } from '~redux/selectors/mailCampaignSelector'
import { mailTemplateSelector } from '~redux/selectors/mailTemplateSelector'
import { signatureSelector } from '~redux/selectors/signatureSelector'
import { propertySelector } from '~redux/selectors/propertySelector'

const mapStateToProps = (state) => ({
  mailCampaign: mailCampaignSelector(state),
  property: propertySelector(state),
  mailTemplate: mailTemplateSelector(state),
  mailSignature: signatureSelector(state),
})

const mapDispatchToProps = {
  ...mailCampaignActions,
  ...propertyActions,
  ...mailTemplateActions,
  ...signatureActions,
}

const Campaigns = (props) => (
  <Switch>
    {routes.map((route) => route.component
      && (
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
      ))
    }
  </Switch>
)

export default connect(mapStateToProps, mapDispatchToProps)(Campaigns)
