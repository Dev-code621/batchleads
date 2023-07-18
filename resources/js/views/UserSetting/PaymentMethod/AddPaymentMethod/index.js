import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'
import {
  useStripe,
  useElements,
  CardNumberElement,
} from '@stripe/react-stripe-js'
import get from 'lodash.get'
import {
  CardNumberInput,
  CardCvcInput,
  CardExpiryInput,
} from '~components/Card'
import Form from '~common/components/Form'
import FormTitle from '~components/Layout/Dashboard/FormTitle'
import ContainerRow from '~components/ContainerRow'
import Button from '~components/Button'
import Input from '~components/Input'
import LoadingActivity from '~components/LoadingActivity'

import UserIcon from '~assets/icons/user.svg'
import CardIcon from '~assets/icons/card.svg'
import CalendarIcon from '~assets/icons/calendar.svg'
import { isValidName } from '~common/helper'
import { useThemeState } from '~common/theme-context'

import './layout/style.scss'

const AddPaymentMethod = withRouter(
  ({
    user, credit, addCard, getUser, history, initAddCard,
  }) => {
    const loading = get(credit.addCardResult, 'loading')
    const success = get(credit.addCardResult, 'success')
    const errorAddCard = get(credit.addCardResult, 'error')
    const stripe = useStripe()
    const elements = useElements()

    useEffect(() => {
      if (success) {
        getUser(user)
        initAddCard()
        history.goBack()
      }
    }, [success])

    const [cardNumberComplete, setCardNumberComplete] = useState(false)
    const [cardExpComplete, setCardExpComplete] = useState(false)
    const [cardCvcComplete, setCardCvcComplete] = useState(false)

    const [errorFirstName, setErrorFirstName] = useState(false)
    const [errorLastName, setErrorLastName] = useState(false)
    const [errorCardNumber, setErrorCardNumber] = useState(false)
    const [errorCardCvc, setErrorCardCvc] = useState(false)
    const [errorCardExp, setErrorCardExp] = useState(false)
    const [processing, setProcessing] = useState(false)
    const [error, setError] = useState(null)

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')

    const theme = useThemeState()

    const onChangeFirstName = (event) => {
      if (event.target.value === '') {
        setErrorFirstName('First Name is required!')
      } else {
        setErrorFirstName('')
      }
      if (isValidName(event.target.value)) {
        setFirstName(event.target.value)
      }
    }

    const onChangeLastName = (event) => {
      if (event.target.value === '') {
        setErrorLastName('Last Name is required!')
      } else {
        setErrorLastName('')
      }
      if (isValidName(event.target.value)) {
        setLastName(event.target.value)
      }
    }

    const onContinue = async (event) => {
      setError(null)
      event.preventDefault()

      if (!stripe || !elements) {
        return
      }

      if (firstName === '') {
        setErrorFirstName('First Name is required!')
      }
      if (lastName === '') {
        setErrorLastName('Last Name is required!')
      }
      if (!cardNumberComplete) {
        if (!errorCardNumber) {
          setErrorCardNumber('Card Number is required!')
        }
      }
      if (!cardExpComplete) {
        if (!errorCardExp) {
          setErrorCardExp('Required!')
        }
      }
      if (!cardCvcComplete) {
        if (!errorCardCvc) {
          setErrorCardCvc('Required!')
        }
      }

      if (
        cardExpComplete
        && cardExpComplete
        && cardNumberComplete
        && firstName !== ''
        && lastName !== ''
      ) {
        setProcessing(true)

        const card = elements.getElement(CardNumberElement)
        const payload = await stripe.createToken(card, {
          name: `${firstName} ${lastName}`,
          address_country: 'US',
          currency: 'usd',
        })
        setProcessing(false)

        if (payload.error) {
          setError(payload.error)
        } else {
          const { token } = payload
          addCard({ stripeToken: token.id })
        }
      }
    }

    return (
      <Form className="add-payment-method-page">
        <FormTitle title="Add Payment Method" hasBack history={history} />
        <form onSubmit={onContinue}>
          <ContainerRow>
            <Input
              type="text"
              value={firstName}
              onChange={onChangeFirstName}
              placeholder="Your First Name"
              width="100%"
              className="input"
              error={errorFirstName}
              icon={UserIcon}
            />
          </ContainerRow>
          <ContainerRow>
            <Input
              type="text"
              value={lastName}
              onChange={onChangeLastName}
              placeholder="Your Last Name"
              width="100%"
              className="input"
              error={errorLastName}
              icon={UserIcon}
            />
          </ContainerRow>
          <ContainerRow>
            <CardNumberInput
              width="100%"
              icon={CardIcon}
              onChange={(e) => {
                setErrorCardNumber(e.error)
                setCardNumberComplete(e.complete)
              }}
              error={errorCardNumber}
              theme={theme.theme}
            />
          </ContainerRow>
          <ContainerRow>
            <div className="card-info-container">
              <div className="card-expiry-container">
                <CardExpiryInput
                  width="100%"
                  icon={CalendarIcon}
                  onChange={(e) => {
                    setErrorCardExp(e.error)
                    setCardExpComplete(e.complete)
                  }}
                  error={errorCardExp}
                  theme={theme.theme}
                />
              </div>
              <div className="card-cvc-container">
                <CardCvcInput
                  width="100%"
                  onChange={(e) => {
                    setErrorCardCvc(e.error)
                    setCardCvcComplete(e.complete)
                  }}
                  error={errorCardCvc}
                  theme={theme.theme}
                />
              </div>
            </div>
          </ContainerRow>
          <ContainerRow>
            {error && (
            <div className="input-component">
              <div className="error">{error}</div>
            </div>
            )}
            {
              errorAddCard && (
                <div className="input-component">
                  <div className="error">{errorAddCard.message}</div>
                </div>
              )}
            {processing || loading ? (
              <LoadingActivity />
            ) : (
              <Button
                label="Add"
                width="100%"
                onClick={onContinue}
              />
            )}
          </ContainerRow>
        </form>
      </Form>
    )
  }
)

export default AddPaymentMethod
