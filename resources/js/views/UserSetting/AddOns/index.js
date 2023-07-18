import React, { useEffect } from 'react'
// import { withRouter, useParams } from 'react-router';
import { withRouter } from 'react-router-dom'
import get from 'lodash.get'
import TagManager from 'react-gtm-module'
import Form from '~common/components/Form'
import ScrollContainer from '~components/Layout/Dashboard/ScrollContainer'
import FormTitle from '~components/Layout/Dashboard/FormTitle'
import LoadingActivity from '~components/LoadingActivity'
import ContainerRow from '~components/ContainerRow'
import Button from '~components/Button'
import AddOn from './layout/AddOn'
import { planList, planDetailsItem } from '~common/constants'
import { toast } from '~common/helper'
import './layout/style.scss'

let addOnType = ''

const AddOns = withRouter(
  ({
    history,
    user,
    updateAddOn,
    initUpdateAddOn,
    endTrial,
    initEndTrial,
    credit,
    subscribeChange,
    getUser,
    initSubscribeChange,
    getPlans,
    getAddons,
    ...props
  }) => {
    const { id } = props.match.params;
    const addOns = user.result.user
      ? get(user.result.user.user, 'add_ons')
      : null
    const subscription = user.result.user
      ? get(user.result.user.user, 'subscribed_plan')
      : null

    const updateAddOnResult = user.update_add_on
    const loading = get(updateAddOnResult, 'loading')
    const error = get(updateAddOnResult, 'error')
    const success = get(updateAddOnResult, 'success')
    const endTrialSuccess = get(credit.endTrialResult, 'success')
    const endingTrial = get(credit.endTrialResult, 'loading')
    let planCostList = get(credit.plans.data, 'data')
    const subscriptionDetails = get(user.result.user.user, 'subscription')
    const subscriptions = get(user.result.user.user, 'subscriptions')
    const successChange = get(credit.subscribeChangeResult, 'success')
    const loadingChange = get(credit.subscribeChangeResult, 'loading')
    const errorChange = get(credit.subscribeChangeResult, 'error')
    const addonList = get(credit.addons.data, 'data')
    let allPlanList = get(credit.plans.data, 'data')
    const freeSkipTracingAvailableCount = user.result.user
      ? get(user.result.user.user, 'free_skiptracing_available_count')
      : 0

    if (planCostList) {
      planCostList = planCostList.filter((item) => (item.id === id))
    }

    let planIndex = 0

    if (planCostList && planCostList.length > 0) {
      planIndex = planList.indexOf(planCostList[0].nickname)
      if (planIndex === -1) {
        if (subscriptionDetails.nickname === 'Base - Grandfathered') {
          planIndex = 0
        }
        if (subscriptionDetails.nickname === 'Performance - Grandfathered') {
          planIndex = 1
        }
      }
    }

    const currentPlan = subscriptionDetails.id === id

    const checkEnabled = (addOn) => {
      return subscription === 'Premium' || addOns.find((item) => item.add_on === addOn)
    }
    const planCost = planCostList && planCostList.length > 0 ? planCostList[0].amount / 100 : 0
    // eslint-disable-next-line max-len
    const balance = planCost > subscriptionDetails.amount / 100 ? planCost - subscriptionDetails.amount / 100 : planCost
    const actionName = subscriptionDetails.amount / 100 > planCost ? 'DOWNGRADE' : 'UPGRADE'

    const purchaseAddOn = (status, type) => {
      addOnType = type
      updateAddOn(type, user, status)
    }

    useEffect(() => {
      initUpdateAddOn()
      initEndTrial()
      initSubscribeChange()
      getUser(user)
    }, [])

    useEffect(() => {
      if (subscriptionDetails) {
        getPlans(subscriptionDetails.interval)
        getAddons()
      }
    }, [subscriptionDetails])

    useEffect(() => {
      if (successChange) {
        let planListDetails = []
        let mainSubId = ''
        let mainCurrency = 'usd'
        let total = 0
        allPlanList.forEach((plan) => {
          if (plan.id === credit.subscribeChangeResult.data.data.plan_id) {
            mainSubId = credit.subscribeChangeResult.data.data.plan_id
            mainCurrency = plan.currency
            total += (plan.amount / 100)
            planListDetails.push(
              {
                sku: plan.id,
                name: plan.nickname,
                category: plan.category,
                price: plan.amount / 100,
                quantity: 1,
              }
            )
          }
        })
        addonList.forEach((plan) => {
          subscriptions.forEach((sub) => {
            if (plan.id === sub.stripe_plan) {
              total += (plan.amount / 100)
              planListDetails.push(
                {
                  sku: plan.id,
                  name: plan.nickname,
                  category: plan.category,
                  price: plan.amount / 100,
                  quantity: 1,
                }
              )
            }
          })
        })
        const tagManagerArgs = {
          dataLayer: {
            event: 'purchase_completed',
            currencyCode: mainCurrency,
            transactionId: mainSubId,
            transactionTotal: total,
            transactionProducts: planListDetails,
          },
        }
        TagManager.dataLayer(tagManagerArgs)
        initUpdateAddOn()
        initEndTrial()
        if (subscriptionDetails.interval === 'month') {
          getPlans('year')
        } else {
          getPlans('month')
        }
        getUser(user)
        initSubscribeChange()
        toast.success('Plan changed!')
      }
    }, [successChange])
    useEffect(() => {
      if (errorChange) {
        toast.error(errorChange.message)
        const tagManagerArgs2 = {
          dataLayer: {
            event: 'purchase_failed',
            stripeErrorType: errorChange.message,
            stripeErrorCode: errorChange.code,
          },
        }
        TagManager.dataLayer(tagManagerArgs2)
        initSubscribeChange()
      }
    }, [errorChange])

    useEffect(() => {
      if (error) {
        const { status } = error
        if (status === 434) {
          if (confirm('You are on Trial, Do you want to end the trial and continue?')) {
            endTrial()
          }
        } else {
          toast.error(error.message)
          const tagManagerArgs2 = {
            dataLayer: {
              event: 'purchase_failed',
              stripeErrorType: error.message,
              stripeErrorCode: error.code,
            },
          }
          TagManager.dataLayer(tagManagerArgs2)
        }
        initUpdateAddOn()
      }
    }, [error])

    useEffect(() => {
      if (endTrialSuccess) {
        const tagManagerArgs = {
          dataLayer: {
            event: 'user_subscribed',
            transactionTotal: subscriptionDetails.amount / 100,
            currencyCode: subscriptionDetails.currency,
          },
        }
        TagManager.dataLayer(tagManagerArgs)
        purchaseAddOn(addOnType)
        initEndTrial()
      }
    }, [endTrialSuccess])

    useEffect(() => {
      if (success) {
        let planListDetails = []
        let mainSubId = ''
        let mainCurrency = 'usd'
        let total = 0
        const addedAddon = addOns.find((item) => item.add_on === addOnType)
        addonList.forEach((plan) => {
          if (addedAddon.id === plan.id) {
            let subscriptionid = ''
            subscriptions.forEach((sub) => {
              if (plan.id === sub.stripe_plan) {
                subscriptionid = sub.stripe_id
              }
            })
            mainSubId = subscriptionid
            mainCurrency = plan.currency
            total += (plan.amount / 100)
            planListDetails.push(
              {
                sku: plan.id,
                name: plan.nickname,
                category: plan.category,
                price: plan.amount / 100,
                quantity: 1,
              }
            )
          }
        })
        const tagManagerArgs = {
          dataLayer: {
            event: 'purchase_completed',
            currencyCode: mainCurrency,
            transactionId: mainSubId,
            transactionTotal: total,
            transactionProducts: planListDetails,
          },
        }
        TagManager.dataLayer(tagManagerArgs)
        initUpdateAddOn()
        // history.goBack()
      }
    }, [success])

    const gotoPaymentMethod = () => {
      if (planCostList && planCostList.length > 0) {
        if (subscriptionDetails.amount / 100 > planCost) {
          subscribeChange(planCostList[0].id)
        } else {
          subscribeChange(planCostList[0].id)
          // history.push('/dashboard/settings/paymentmethod')
        }
      }
    }

    return (
      <Form className="addon-page">
        <div>{props.location.id}</div>
        <FormTitle
          title={`${currentPlan ? 'My' : ''} Plan:<br/><span>${(planCostList && planCostList[0]) ? planCostList[0].nickname : 'BASE'}</span><span class="amount">$${balance}</span>`}
          hasBack
          history={history}
        />
        <ScrollContainer>
          {
            planDetailsItem.map((plan, index) => {
              return (
                <div className="plan-item">
                  <div className="plan-item__title">
                    {plan.title}
                  </div>
                  {
                    index === 0 && (
                    <div className={`plan-item__status ${plan.status[planIndex]}`}>
                      {`7 days trial + ${freeSkipTracingAvailableCount} Skip Traces`}
                    </div>
                    )
                  }
                  {index !== 0 && planIndex > -1 && (
                    <div className={`plan-item__status ${plan.status[planIndex]}`}>
                      {['yes', 'no', 'has'].indexOf(plan.status[planIndex]) === -1 ? plan.status[planIndex] : ''}
                    </div>
                  )}
                </div>
              )
            })
          }
          {
            (loading || endingTrial || loadingChange)
            && <ContainerRow><LoadingActivity /></ContainerRow>
          }
          <AddOn
            name="Real-Time Driving Routes"
            price="$20"
            enabled={checkEnabled('driving_route')}
            onChange={(status) => purchaseAddOn(status, 'driving_route')}
          />
          <AddOn
            name="Google Street Pic"
            price="$20"
            enabled={checkEnabled('street_view')}
            onChange={(status) => purchaseAddOn(status, 'street_view')}
          />
          {!currentPlan
          && (
            <div>
              <div className="amount">
                Total:&nbsp;
                <span>
                  {`$${planCost}`}
                </span>
              </div>
              <div className="button-container button">
                <Button
                  label={actionName}
                  height="34px"
                  style={{
                    fontSize: '16px',
                  }}
                  onClick={gotoPaymentMethod}
                />
              </div>
            </div>
          )}
          <div className="button-container button">
            <Button
              label="BACK"
              color="white"
              onClick={() => history.goBack()}
              height="34px"
              style={{
                fontSize: '16px',
              }}
            />
          </div>
        </ScrollContainer>
      </Form>
    )
  }
)

export default AddOns
