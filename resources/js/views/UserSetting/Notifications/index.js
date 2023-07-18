import React from 'react'
import { withRouter } from 'react-router-dom'
import get from 'lodash.get'
import Form from '~common/components/Form'
import FormTitle from '~components/Layout/Dashboard/FormTitle'
import Notification from './layout/Notification'
import './layout/style.scss'

const Notifications = withRouter(
  ({ history, user, updateNotificationSetting }) => {
    const settings = user.result.user
      ? get(user.result.user.user, 'user_notification_settings')
      : null

    return (
      <Form className="notifications-page">
        <FormTitle title="Notification Settings" hasBack history={history} />
        {settings
          && settings.map((setting) => (
            <Notification
              key={setting.name}
              {...setting}
              onChange={() => updateNotificationSetting(
                setting.notification_type,
                !setting.enabled,
                user
              )
              }
            />
          ))}
      </Form>
    )
  }
)

export default Notifications
