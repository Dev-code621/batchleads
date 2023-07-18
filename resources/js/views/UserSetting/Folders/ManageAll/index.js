import React, { useEffect } from 'react'
import { withRouter } from 'react-router-dom'
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

  return (
    <Form className="foler-status-tag-container">
      <FormTitle
        title="Folders & Tags"
        hasBack
        history={history}
      />
      <ScrollContainer>
        <ContainerRow>
          <NavItem
            title="Folders Manager"
            description="Manage and organize your folders"
            onClick={() => history.push('/dashboard/settings/folders/managefolders')}
          />
        </ContainerRow>
        {/* <ContainerRow>
          <NavItem
            title="Statuses Manager"
            description="Manage and organize your statuses"
            // onClick={() => history.push('/dashboard/settings/folders/managestatus')}
          />
        </ContainerRow> */}
        <ContainerRow>
          <NavItem
            title="Tags Manager"
            description="Manage and organize your tags"
            onClick={() => history.push('/dashboard/settings/folders/managetags')}
          />
        </ContainerRow>
      </ScrollContainer>
    </Form>
  )
})

export default Settings
