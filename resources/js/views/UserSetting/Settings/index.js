import React, { useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import get from 'lodash.get'
import Form from '~common/components/Form'
import FormTitle from '~components/Layout/Dashboard/FormTitle'
import ContainerRow from '~components/ContainerRow'
import NavItem from '~components/NavItem'
import ScrollContainer from '~components/Layout/Dashboard/ScrollContainer'
import './layout/style.scss'

const Settings = withRouter(({
  history, user, getUser,
}) => {
  useEffect(() => {
    if (user) {
      getUser(user)
    }
  }, [])

  // const name = user.result.user ? get(user.result.user.user, 'name') : null
  const email = user.result.user ? get(user.result.user.user, 'email') : null
  // const role = user.result.user ? get(user.result.user.user, 'role') : null
  // const subscribedPlan = user.result.user ? get(user.result.user.user, 'subscribed_plan') : null
  // const credit = user.result.user ? get(user.result.user.user, 'credit') : null

  return (
    <Form className="settings-page">
      <FormTitle title="Settings" />
      <ScrollContainer>
        <ContainerRow>
          <NavItem
            title="My Account"
            description={email}
            onClick={() => history.push('/dashboard/settings/profile')}
          />
        </ContainerRow>
        <ContainerRow>
          <NavItem
            title="Folders & Tags"
            description="Manage and organize it all"
            onClick={() => history.push('/dashboard/settings/folders')}
          />
        </ContainerRow>
        <ContainerRow>
          <NavItem
            title="Phone Manager"
            description="Manage your phone numbers"
            onClick={() => history.push('/dashboard/settings/phonenumbers')}
          />
        </ContainerRow>
        <ContainerRow>
          <NavItem
            title="Data Management"
            description="Manage your data"
            onClick={() => history.push('/dashboard/settings/datamanagement')}
          />
        </ContainerRow>
        <ContainerRow>
          <NavItem
            title="Team Management"
            description="Manage your team"
            onClick={() => history.push('/dashboard/teams')}
          />
        </ContainerRow>
        <ContainerRow>
          <NavItem
            title="Notifications"
            description="Edit your push notification preferences"
            onClick={() => history.push('/dashboard/settings/notifications')}
          />
        </ContainerRow>
        <ContainerRow>
          <NavItem
            title="Affiliates"
            description="Manage your affiliates"
            onClick={() => history.push('/dashboard/affiliates')}
          />
        </ContainerRow>
      </ScrollContainer>
    </Form>
  )
})

export default Settings
