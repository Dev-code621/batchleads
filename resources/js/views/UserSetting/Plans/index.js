import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'
import get from 'lodash.get'
import axios from 'axios'
import TagManager from 'react-gtm-module'
import { toast } from '~common/helper'
import Form from '~common/components/Form'
import FormTitle from '~components/Layout/Dashboard/FormTitle'
import LoadingActivity from '~components/LoadingActivity'
import ContainerRow from '~components/ContainerRow'
import PlanCard from '~components/PlanCard'
import Button from '~components/Button'
import './layout/style.scss'

const Plans = withRouter(
  ({
    history,
    user,
    credit,
    getPlans,
    subscribeChange,
    getUser,
    initSubscribeChange,
    endTrial,
    initEndTrial,
  }) => {
    let planList = get(credit.plans.data, 'data')
    if (planList) {
      planList = planList.filter((item) => !item.is_pause)
    }
    const subscription = get(user.result.user.user, 'subscription')
    const isCancelled = get(user.result.user.user, 'is_cancelled')
    const addOns = get(user.result.user.user, 'add_ons')
    const success = get(credit.subscribeChangeResult, 'success')
    const loading = get(credit.subscribeChangeResult, 'loading')
    const error = get(credit.subscribeChangeResult, 'error')
    const plansLoading = get(credit.plans, 'loading')
    const [expandBlock, setExpand] = useState(false)
    const isTrial = get(user.result.user.user, 'is_trial')
    const endTrialSuccess = get(credit.endTrialResult, 'success')
    const endTrialLoading = get(credit.endTrialResult, 'loading')
    const successChange = get(credit.subscribeChangeResult, 'success')

    const [planForSwitching, setPlanForSwitching] = useState(null)

    const getPlanForSwitching = (yearlyOnly) => {
      axios({
        url: `${__CONFIG__.API_ENDPOINT_URL}stripe/subscribe/getPlans?yearly_only=${yearlyOnly}`,
        method: 'GET',
      }).then((res) => {
        const plans = res.data.data
        plans.map((plan) => {
          if (plan.nickname === subscription.nickname) {
            setPlanForSwitching(plan)
          }
          return true
        })
      }).catch(() => {
      })
    }

    useEffect(() => {
      initEndTrial()
      initSubscribeChange()
    }, [])

    useEffect(() => {
      if (subscription) {
        getPlans(subscription.interval)
        let yearlyOnly = 0
        if (subscription.interval === 'month') {
          yearlyOnly = 1
        }
        getPlanForSwitching(yearlyOnly)
      }
    }, [subscription])

    useEffect(() => {
      if (success) {
        getUser(user)
        initSubscribeChange()
      }
    }, [success])

    useEffect(() => {
      if (endTrialSuccess) {
        getUser(user)
        initEndTrial()
        const tagManagerArgs = {
          dataLayer: {
            event: 'user_subscribed',
            transactionTotal: subscription.amount / 100,
            currencyCode: subscription.currency,
          },
        }
        TagManager.dataLayer(tagManagerArgs)
      }
    }, [endTrialSuccess])

    useEffect(() => {
      if (error) {
        toast.error(error.message)
        initSubscribeChange()
      }
    }, [error])

    useEffect(() => {
      if (successChange) {
        // const tagManagerArgs = {
        //   dataLayer: {
        //     transactionId: '',
        //     transactionAffiliation: '',
        //     transactionTotal: subscription.amount / 100,
        //     transactionProducts: [{
        //       sku: subscription.id,
        //       name: subscription.nickname,
        //       category: 'subscription',
        //       price: subscription.amount / 100,
        //       currency: subscription.currency,
        //       quantity: 1,
        //     }],
        //   },
        // }
        // TagManager.dataLayer(tagManagerArgs)
        let yearlyOnly = 1
        if (subscription.interval === 'month') {
          yearlyOnly = 0
        }
        getPlanForSwitching(yearlyOnly)
        if (yearlyOnly) {
          getPlans('month')
        } else {
          getPlans('year')
        }
        getUser(user)
        initSubscribeChange()
        toast.success('Plan changed!')
      }
    }, [successChange])

    const onToggleExpand = () => {
      setExpand(!expandBlock)
    }

    const endUserTrial = () => {
      if (confirm('Are you sure?')) {
        endTrial()
      }
    }

    const changePlan = () => {
      if (planForSwitching) {
        initSubscribeChange()
        subscribeChange(planForSwitching.id)
      }
    }

    return (
      <Form className="plans-page">
        <FormTitle title="Plans" hasBack history={history} />
        {
          endTrialLoading && <ContainerRow><LoadingActivity /></ContainerRow>
        }
        {
          isTrial && !endTrialLoading && (
          <Button
            label="END TRIAL & SUBSCRIBE"
            width="100%"
            height={48}
            onClick={endUserTrial}
          />
          )
        }
        {
        user && planList && (
          planList.map((plan) => (
            <PlanCard
              {...plan}
              history={history}
              subscription={subscription}
              changePlan={() => subscribeChange(plan.id)}
              key={plan.id}
              cancelled={isCancelled}
              addOns={addOns}
            />
          )))

        }
        {user && planList && (
          <Button
            label="CHANGE BILLING PERIOD"
            width="100%"
            height={48}
            icon="change"
            onClick={onToggleExpand}
          />
        )}

        { expandBlock && (
          <div className="billig-items-container">
            <div
              className="close"
              onClick={onToggleExpand}
            >
              &times;
            </div>
            {
              planForSwitching ? (
                <div className="billing-item" key={planForSwitching.id}>
                  <div className="label">
                    {`${planForSwitching.interval}ly`}
                  </div>
                  <div className="price">
                    {`$${planForSwitching.amount / 100}`}
                  </div>
                </div>
              ) : <ContainerRow><LoadingActivity /></ContainerRow>
            }
            <div className="w-100 text-center">
              <Button
                label="CONFIRM AND SWITCH"
                width="70%"
                height={30}
                icon="change"
                onClick={changePlan}
              />
            </div>
          </div>
        )}

        {(plansLoading || loading) && <ContainerRow><LoadingActivity /></ContainerRow>}
      </Form>
    )
  }
)

export default Plans
