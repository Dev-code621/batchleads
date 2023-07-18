import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'
import get from 'lodash.get'
import Form from '~common/components/Form'
import FormTitle from '~components/Layout/Dashboard/FormTitle'
import ContainerRow from '~components/ContainerRow'
import Input from '~components/Input'
import Button from '~components/Button'
import LoadingActivity from '~components/LoadingActivity'
import PhoneIcon from '~assets/icons/phone.svg'
import { formatPhoneInput } from '~common/helper'

const CallForward = withRouter(
  ({
    history, user, setCallForward, initSetCallForward, getUser,
  }) => {
    const [phoneNumber, setPhoneNumber] = useState('')

    const loading = get(user.call_forward, 'loading')
    const success = get(user.call_forward, 'success')
    const error = get(user.call_forward, 'error')

    useEffect(() => {
      initSetCallForward()
      const callForwarding = user.result.user ? get(user.result.user.user, 'call_forwarding') : null
      if (callForwarding) {
        setPhoneNumber(callForwarding.phone_number)
      }
    }, [])

    useEffect(() => {
      if (success) {
        getUser(user)
        initSetCallForward()
        history.goBack()
      }
    }, [success])

    const savePhoneNumber = () => {
      setCallForward(phoneNumber)
    }

    return (
      <Form className="call-forwarding-page">
        <FormTitle title="Call Forward" hasBack history={history} />
        <ContainerRow>
          <Input
            placeholder="Phone Number"
            value={formatPhoneInput(phoneNumber)}
            onChange={(e) => setPhoneNumber(e.target.value)}
            type="text"
            height={48}
            error={error && error.error && error.error.phone}
            icon={PhoneIcon}
          />
        </ContainerRow>
        {
          error && <div className="error-message">{error.message}</div>
        }
        <ContainerRow>
          {
            loading && <LoadingActivity />
          }
          {
            !loading && <Button label="SAVE" height={48} width="100%" onClick={savePhoneNumber} />
          }
        </ContainerRow>
      </Form>
    )
  }
)

export default CallForward
