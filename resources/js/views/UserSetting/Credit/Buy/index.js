import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import get from 'lodash.get'
import TagManager from 'react-gtm-module'

import { toast } from '~common/helper'
import Form from '~common/components/Form'
import FormTitle from '~components/Layout/Dashboard/FormTitle'
import ContainerRow from '~components/ContainerRow'
import LoadingActivity from '~components/LoadingActivity'
import CreditPackageSelector from '~components/CollapsibleSelector/CreditPackageSelector'
import Button from '~components/Button'
import './layout/style.scss'

const Buy = withRouter(({
  history,
  user,
  credit,
  chargeCredit,
  initChargeCredit,
  getUser,
  // endTrial,
  initEndTrial,
}) => {
  const [selectedPackage, setSelectedPackage] = useState(null)

  const { chargeResult } = credit
  // const isTrial = user.result.user
  //   ? get(user.result.user.user, 'is_trial')
  //   : null
  const purchasing = get(chargeResult, 'loading')
  const error = get(chargeResult, 'error')
  const success = get(chargeResult, 'success')
  const endTrialSuccess = get(credit.endTrialResult, 'success')
  const endTrialError = get(credit.endTrialResult, 'error')
  const endingTrial = get(credit.endTrialResult, 'loading')
  const subscriptionDetails = get(user.result.user.user, 'subscription')
  const userCredits = get(user.result.user.user, 'credit')

  useEffect(() => {
    initEndTrial()
    initChargeCredit()
  }, [])

  useEffect(() => {
    if (endTrialError) {
      toast.error(endTrialError.message)
      initChargeCredit()
    }
  }, [endTrialError])

  useEffect(() => {
    if (error) {
      toast.error(error.message)
      const tagManagerArgs2 = {
        dataLayer: {
          event: 'purchase_failed',
          stripeErrorType: error.message,
          stripeErrorCode: error.code,
        },
      }
      TagManager.dataLayer(tagManagerArgs2)
      initChargeCredit()
    }
  }, [error])

  useEffect(() => {
    if (success) {
      toast.success('Charged Credits!')
      const tagManagerArgs = {
        dataLayer: {
          event: 'purchase_completed',
          currencyCode: 'credits',
          transactionId: chargeResult.credit.data.reference_id,
          transactionTotal: chargeResult.credit.data.credit_amount,
          transactionProducts: [{
            sku: 'balance_recharge',
            name: 'Wallet Balance Recharge',
            price: selectedPackage.credit_amount,
            quantity: 1,
          }],
        },
      }
      const total = (userCredits && userCredits.ballance)
        ? selectedPackage.credit_amount + userCredits.ballance
        : selectedPackage.credit_amount
      TagManager.dataLayer(tagManagerArgs)
      const tagManagerArgs2 = {
        dataLayer: {
          event: 'balance_updated',
          currencyCode: 'usd',
          walletBalance: total,
        },
      }
      TagManager.dataLayer(tagManagerArgs2)
      initChargeCredit()
      getUser(user)
      history.goBack()
    }
  }, [success])

  useEffect(() => {
    if (endTrialSuccess) {
      chargeCredit(selectedPackage)
      const tagManagerArgs = {
        dataLayer: {
          event: 'user_subscribed',
          transactionTotal: subscriptionDetails.amount / 100,
          currencyCode: subscriptionDetails.currency,
        },
      }
      TagManager.dataLayer(tagManagerArgs)
      initEndTrial()
    }
  }, [endTrialSuccess])

  const buy = () => {
    // if (isTrial) {
    //   if (confirm('You are on Trial, Do you want to end the trial and continue?')) {
    //     endTrial()
    //   }
    //   return
    // }
    chargeCredit(selectedPackage.id)
  }

  const onSelectPackage = (item) => {
    setSelectedPackage(item)
  }

  return (
    <Form className="buy-page">
      <FormTitle title="Purchase Credit" hasBack history={history} />
      <ContainerRow>
        <CreditPackageSelector
          onSelect={onSelectPackage}
          amount={selectedPackage && selectedPackage.credit_amount}
          selectedCreditPackage={selectedPackage}
        />
      </ContainerRow>
      <ContainerRow>
        {
          (purchasing || endingTrial) ? <LoadingActivity /> : (
            <Button
              label="Buy Now"
              width="90%"
              height={48}
              onClick={buy}
              disabled={!selectedPackage}
            />
          )
        }
      </ContainerRow>
    </Form>
  )
})

export default Buy
