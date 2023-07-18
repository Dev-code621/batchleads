import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { connect } from 'react-redux'

import routes from './routes'
import { actions as smsCampaignActions } from '~redux/modules/smsCampaign'
import { actions as propertyActions } from '~redux/modules/property'
import { actions as smsTemplateActions } from '~redux/modules/smsTemplate'
import { smsCampaignSelector } from '~redux/selectors/smsCampaignSelector'
import { smsTemplateSelector } from '~redux/selectors/smsTemplateSelector'
import { propertySelector } from '~redux/selectors/propertySelector'

const mapStateToProps = (state) => ({
  smsTemplate: smsTemplateSelector(state),
  smsCampaign: smsCampaignSelector(state),
  property: propertySelector(state),
})

const mapDispatchToProps = {
  ...smsCampaignActions,
  ...propertyActions,
  ...smsTemplateActions,
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
