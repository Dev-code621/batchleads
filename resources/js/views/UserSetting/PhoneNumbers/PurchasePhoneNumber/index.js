import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'
import get from 'lodash.get'
import Form from '~common/components/Form'
import FormTitle from '~components/Layout/Dashboard/FormTitle'
import ContainerRow from '~components/ContainerRow'
import LoadingActivity from '~components/LoadingActivity'
import PhoneNumberListItem from '~components/PhoneNumberListItem'
import Button from '~components/Button'
import { formatPhoneNumber, toast } from '~common/helper'
import './style.scss'

const PurchasePhoneNumber = withRouter(
  ({
    history, searchAvailablePhoneNumbers, user, purchasePhoneNumber, initPurchasePhoneNumber,
  }) => {
    const [selectedPhoneNumber, setSelectedPhoneNumber] = useState(null)
    const [areaCode, setAreaCode] = useState('')

    const loading = get(user.available_phone_numbers, 'loading')
    const phoneNumbers = get(user.available_phone_numbers, 'data')
    const purchasing = get(user.purchase_phone_number, 'loading')
    const success = get(user.purchase_phone_number, 'success')
    const error = get(user.purchase_phone_number, 'error')

    useEffect(() => {
      searchAvailablePhoneNumbers(areaCode)
      initPurchasePhoneNumber()
    }, [])

    useEffect(() => {
      if (success) {
        history.push('/dashboard/settings/phonenumbers')
      }
    }, [success])

    useEffect(() => {
      if (error) {
        toast.error(error.message)
        initPurchasePhoneNumber()
      }
    }, [error])

    const onPurchase = () => {
      purchasePhoneNumber(selectedPhoneNumber)
    }

    const onSelectAreaCode = () => {
      const code = prompt('Select Area Code')
      if (code) {
        setAreaCode(code)
        setSelectedPhoneNumber(null)
        searchAvailablePhoneNumbers(code)
      }
    }

    const areaCodeButtonLabel = areaCode ? `Select Area Code (${areaCode})` : 'Select Area Code'

    return (
      <Form className="purchase-phone-number-page">
        <FormTitle title="Available Phone Numbers" hasBack history={history} />
        <ContainerRow>
          <Button
            label={areaCodeButtonLabel}
            width="70%"
            onClick={onSelectAreaCode}
          />
        </ContainerRow>
        <ContainerRow>
          {loading && <LoadingActivity />}
          {phoneNumbers
            && phoneNumbers.map((phoneNumber) => (
              <PhoneNumberListItem
                phoneNumber={formatPhoneNumber(phoneNumber)}
                key={phoneNumber}
                isSelect
                onSelect={() => setSelectedPhoneNumber(phoneNumber)}
                selected={phoneNumber === selectedPhoneNumber}
              />
            ))}
        </ContainerRow>
        <ContainerRow>
          {
            purchasing ? <LoadingActivity /> : (
              <Button
                label="Purchase"
                width="70%"
                onClick={onPurchase}
                disabled={!selectedPhoneNumber}
              />
            )
          }
        </ContainerRow>
      </Form>
    )
  }
)

export default PurchasePhoneNumber
