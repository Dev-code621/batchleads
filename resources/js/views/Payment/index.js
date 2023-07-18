import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import get from 'lodash.get'
import { withRouter } from 'react-router-dom'
import {
  useStripe,
  useElements,
  CardNumberElement,
} from '@stripe/react-stripe-js'
import TagManager from 'react-gtm-module'

import { Row, Col } from 'react-flexbox-grid'
import {
  CardNumberInput,
  CardCvcInput,
  CardExpiryInput,
} from '~components/Card'

import Title from '~layout/Title'
import Button from '~components/Button'
import Step from '~components/Step'
import Input from '~components/Input'
import LoadingActivity from '~components/LoadingActivity'
import TosModalContent from '~components/TosModalContent'
import BaseModal from '~components/BaseModal'
import TosContainer from '~components/TosContainer'
import ErrorMessage from '~components/ErrorMessage'
import InfoIcon from '~assets/icons/info.svg'
import UserIcon from '~assets/icons/user.svg'
import PromoCodeIcon from '~assets/icons/promo_code.svg'
import CardIcon from '~assets/icons/card.svg'
import CalendarIcon from '~assets/icons/calendar.svg'
import './layout/style.scss'

import { actions as creditActions } from '~redux/modules/credit'
import { actions as userActions } from '~redux/modules/user'
import { userSelector } from '~redux/selectors/userSelector'
import { creditSelector } from '~redux/selectors/creditSelector'

const mapStateToProps = (state) => ({
  credit: creditSelector(state),
  user: userSelector(state),
})

const mapDispatchToProps = {
  ...creditActions,
  ...userActions,
}

const Payment = withRouter(
  ({
    user,
    credit,
    match,
    getPlans,
    subscribe,
    getUser,
    location,
    getAddons,
  }) => {
    const [selectedPlan, setSelectedPlan] = useState(null)

    const stripe = useStripe()
    const elements = useElements()

    const [cardNumberComplete, setCardNumberComplete] = useState(false)
    const [cardExpComplete, setCardExpComplete] = useState(false)
    const [cardCvcComplete, setCardCvcComplete] = useState(false)

    const [errorFirstName, setErrorFirstName] = useState(false)
    const [errorLastName, setErrorLastName] = useState(false)
    const [errorCardNumber, setErrorCardNumber] = useState(false)
    const [errorCardCvc, setErrorCardCvc] = useState(false)
    const [errorCardExp, setErrorCardExp] = useState(false)
    const [processing, setProcessing] = useState(false)
    const [loadingUserInfo, setLoadingUserInfo] = useState(false)
    const [error, setError] = useState(null)

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')

    const [promoCode, setPromoCode] = useState('')

    const [addOnDrivingRoute, setAddOnDrivingRoute] = useState(false)
    const [addOnStreetView, setAddOnStreetView] = useState(false)
    const [addOnPrice, setAddOnPrice] = useState(0)
    const [tagData, setTagData] = useState([])

    const [tos, setTos] = useState(false)
    const [showTos, setShowTos] = useState(false)

    const username = user.result.user ? get(user.result.user.user, 'name') : null
    const email = user.result.user ? get(user.result.user.user, 'email') : null
    const subscriptions = user.result.user ? get(user.result.user.user, 'subscriptions') : []

    const planList = get(credit.plans.data, 'data')
    const addonList = get(credit.addons.data, 'data')

    useEffect(() => {
      if (!addonList) {
        getAddons()
      }
      if (!planList) {
        const params = new URLSearchParams(location.search)
        const planPeriod = params.get('plan_period')
        getPlans(planPeriod)
      }
      // if (localStorage.tracking_ref_id) {
      //   setPromoCode(localStorage.tracking_ref_id)
      // }
    }, [])

    const setAddonDetails = (tagList) => {
      const params = new URLSearchParams(location.search)
      const drivingRoute = params.get('driving_route') === 'true'
      const streetview = params.get('street_view') === 'true'
      let addonCost = 0
      addonList.forEach((addon) => {
        if ((drivingRoute && addon.nickname === 'Real-Time Driving Routes')
          || (streetview && addon.nickname === 'Google Street Pic')) {
          addonCost += addon.amount / 100
          const addonTag = {
            sku: addon.id,
            name: addon.nickname,
            category: 'subscription',
            price: addon.amount / 100,
            currency: addon.currency,
            quantity: 1,
            type: 'addon',
          }
          tagList.push(addonTag)
        }
      })
      setAddOnDrivingRoute(drivingRoute)
      setAddOnStreetView(streetview)
      setAddOnPrice(addonCost)
    }

    useEffect(() => {
      if (credit.plans.success && credit.addons.success) {
        const selectedPlanId = get(match.params, 'planId')
        const tagList = []
        planList.forEach((plan) => {
          if (plan.id === selectedPlanId) {
            setSelectedPlan(plan)
            const planTag = {
              sku: plan.id,
              name: plan.nickname,
              category: 'subscription',
              price: plan.amount / 100,
              currency: plan.currency,
              quantity: 1,
              type: 'main',
            }
            tagList.push(planTag)
          }
        })
        setAddonDetails(tagList)
        setTagData(tagList)
      }
    }, [credit.plans, credit.addons])

    const subscribeSuccess = get(credit.subscribeResult, 'success')
    const subscribeError = get(credit.subscribeResult, 'error')
    const subscribing = get(credit.subscribeResult, 'loading')

    useEffect(() => {
      if (subscribeSuccess) {
        setLoadingUserInfo(true)
        localStorage.removeItem('tracking_ref_id')
        // if (selectedPlan.nickname === 'Premium') return;

        $FPROM.trackSignup({ email },
          () => { console.log('Callback received!') });

        getUser(user)
      }
    }, [subscribeSuccess])

    useEffect(() => {
      if (subscribeSuccess && subscriptions && subscriptions.length > 0) {
        const tagManagerArgs2 = {
          dataLayer: {
            event: 'user_trial',
          },
        }
        TagManager.dataLayer(tagManagerArgs2)
      }
    }, [subscriptions])

    const closeTosModal = () => {
      setShowTos(false)
    }

    const onChangeFirstName = (event) => {
      if (event.target.value === '') {
        setErrorFirstName('First Name is required!')
      } else {
        setErrorFirstName('')
      }
      setFirstName(event.target.value)
    }

    const onChangeLastName = (event) => {
      if (event.target.value === '') {
        setErrorLastName('Last Name is required!')
      } else {
        setErrorLastName('')
      }
      setLastName(event.target.value)
    }

    const onChangePromoCode = (event) => {
      setPromoCode(event.target.value)
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
          setErrorCardExp('Card Expiry Date is required!')
        }
      }
      if (!cardCvcComplete) {
        if (!errorCardCvc) {
          setErrorCardCvc('Card CVC is required!')
        }
      }

      if (!selectedPlan) {
        setError('Can not get the plan information.')
        return
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
          const message = get(payload.error, 'message', 'Card Error!')
          setError(message)
        } else {
          const { token } = payload
          const customerName = token.card.name
          const addOns = []
          if (addOnStreetView) {
            addOns.push('street_view')
          }
          if (addOnDrivingRoute) {
            addOns.push('driving_route')
          }
          subscribe({
            stripeToken: token.id,
            planId: selectedPlan.id,
            customerName,
            promoCode: localStorage.tracking_ref_id ? localStorage.tracking_ref_id : promoCode,
            addOns,
          })
        }
      }
    }

    return (
      <div className="payment-page">
        <Step active={2} userName={username} planName={selectedPlan ? selectedPlan.nickname : ''} />
        <Row className="blocks-container">
          <Col
            sm={12}
            lg={6}
            className="left-block"
          >
            <Title title="ORDER SUMMARY" container="blue" />

            {credit.plans.loading ? (
              <div className="spinner-container">
                <LoadingActivity />
              </div>
            ) : (
              <div className="plan-container">
                {selectedPlan && (
                  <div className="plan-details">
                    <Row>
                      <Col
                        sm={6}
                        className="label"
                      >
                        {`${selectedPlan.nickname} Package:`}
                      </Col>
                      <Col
                        sm={6}
                        className="value"
                      >
                        {`$${selectedPlan ? selectedPlan.amount / 100 : null}`}
                      </Col>
                    </Row>
                    {selectedPlan.nickname !== 'Premium' && (
                      <Row>
                        <Col
                          sm={6}
                          className="label"
                        >
                          Add On:
                        </Col>
                        <Col
                          sm={6}
                          className="value"
                        >
                          {`$${addOnPrice}`}
                        </Col>
                      </Row>
                    )}
                    <hr />
                    <Row>
                      <Col
                        sm={6}
                        className="label"
                      >
                        Total:
                      </Col>
                      <Col
                        sm={6}
                        className="value value--total"
                      >
                        {`$ ${selectedPlan.amount / 100 + (selectedPlan.nickname === 'Premium' ? 0 : addOnPrice)}`}
                        <span className="per">{`/${selectedPlan.interval}`}</span>
                      </Col>
                    </Row>
                  </div>
                )}
                <div className="info" style={{ backgroundImage: `url(${InfoIcon})` }}>
                  Your account will not be charged until after your trial.
                  <br />
                  You can cancel this at anytime.
                </div>

              </div>
            )}

          </Col>
          <Col
            sm={12}
            lg={6}
            className="right-block"
          >
            <Title title="PAYMENT DETAILS" container="blue" />
            <form onSubmit={onContinue}>
              <div className="input-container">
                <Input
                  type="text"
                  value={firstName}
                  onChange={onChangeFirstName}
                  placeholder="First name"
                  width="100%"
                  height={35}
                  className="input"
                  error={errorFirstName}
                  icon={UserIcon}
                />
                <Input
                  type="text"
                  value={lastName}
                  onChange={onChangeLastName}
                  placeholder="Last name"
                  width="100%"
                  height={35}
                  className="input"
                  error={errorLastName}
                  icon={UserIcon}
                />
                <CardNumberInput
                  width="100%"
                  height={35}
                  icon={CardIcon}
                  onChange={(e) => {
                    setErrorCardNumber(e.error)
                    setCardNumberComplete(e.complete)
                  }}
                  error={errorCardNumber}
                />
                <div className="card-info-container">
                  <div className="card-expiry-container">
                    <CardExpiryInput
                      width="100%"
                      height={35}
                      icon={CalendarIcon}
                      onChange={(e) => {
                        setErrorCardExp(e.error)
                        setCardExpComplete(e.complete)
                      }}
                      error={errorCardExp}
                    />
                  </div>
                  <div className="card-cvc-container">
                    <CardCvcInput
                      width="100%"
                      height={35}
                      onChange={(e) => {
                        setErrorCardCvc(e.error)
                        setCardCvcComplete(e.complete)
                      }}
                      error={errorCardCvc}
                    />
                  </div>
                </div>
                {error && (
                  <div className="input-component">
                    <div className="error">{error}</div>
                  </div>
                )}
                <Input
                  type="text"
                  value={promoCode}
                  onChange={onChangePromoCode}
                  placeholder="Promo code"
                  width="100%"
                  height={35}
                  className="input"
                  icon={PromoCodeIcon}
                />
                <TosContainer
                  checked={tos}
                  onChange={(val) => setTos(val)}
                  showTosModal={() => setShowTos(true)}
                />

                <div className="button-container">
                  {
                    subscribeError
                      && <ErrorMessage message={subscribeError.message} />
                  }
                  {processing || subscribing || loadingUserInfo ? (
                    <LoadingActivity />
                  ) : (
                    <Button
                      label="SUBSCRIBE NOW"
                      icon="cart"
                      height={35}
                      style={{
                        fontSize: '14px',
                      }}
                      disabled={!tos}
                      onClick={onContinue}
                    />
                  )}
                </div>
              </div>
            </form>
          </Col>
        </Row>
        <BaseModal toggle={showTos} onClose={closeTosModal}>
          <TosModalContent />
        </BaseModal>
      </div>
    )
  }
)

export default connect(mapStateToProps, mapDispatchToProps)(Payment)
