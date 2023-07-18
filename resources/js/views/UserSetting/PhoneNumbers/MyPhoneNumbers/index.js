import React, { useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import get from 'lodash.get'
import Form from '~common/components/Form'
import FormTitle from '~components/Layout/Dashboard/FormTitle'
import ContainerRow from '~components/ContainerRow'
import LoadingActivity from '~components/LoadingActivity'
import PhoneNumberListItem from '~components/PhoneNumberListItem'
import NavItem from '~components/NavItem'
import ScrollContainer from '~components/Layout/Dashboard/ScrollContainer'
import { formatPhoneNumber } from '~common/helper'

import './layout/style.scss'

const PhoneNumbers = withRouter(
  ({
    history,
    getPurchasedPhoneNumbers,
    user,
    releasePhone,
  }) => {
    useEffect(() => {
      getPurchasedPhoneNumbers()
    }, [])

    const loading = get(user.purchased_phone_numbers, 'loading')
    const phoneNumbers = get(user.purchased_phone_numbers, 'data')
    const callForwarding = user.result.user ? get(user.result.user.user, 'call_forwarding') : null
    const releasePhoneLoading = get(user.release_phone, 'loading', false)

    useEffect(() => {
      if (!releasePhoneLoading) {
        getPurchasedPhoneNumbers()
      }
    }, [releasePhoneLoading])

    const releasePhoneNumber = (phoneNumber) => {
      if (confirm('This Action can not be undone. Are you sure?')) {
        releasePhone(phoneNumber)
      }
    }

    return (
      <Form className="phone-numbers-page">
        <FormTitle title="Phone Manager" hasAdd onAdd={() => history.push('/dashboard/settings/phonenumbers/purchase')} hasBack history={history} />
        <ScrollContainer>
          <ContainerRow>
            <NavItem
              title="Call Forward"
              description={callForwarding ? formatPhoneNumber(callForwarding.phone_number) : 'none'}
              onClick={() => history.push('/dashboard/settings/phonenumbers/callforward')}
            />
          </ContainerRow>
          {phoneNumbers && phoneNumbers.map((phoneNumber) => (
            <ContainerRow>
              <PhoneNumberListItem
                phoneNumber={formatPhoneNumber(phoneNumber)}
                key={phoneNumber}
                showRelease
                onRelease={() => releasePhoneNumber(phoneNumber)}
              />
            </ContainerRow>
          ))}
          <ContainerRow>
            {(loading || releasePhoneLoading) && <LoadingActivity />}
          </ContainerRow>
        </ScrollContainer>
      </Form>
    )
  }
)

export default PhoneNumbers
