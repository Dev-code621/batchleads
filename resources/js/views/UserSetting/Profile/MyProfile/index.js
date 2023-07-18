import React, { useState, useEffect } from 'react'
import { withRouter, Link } from 'react-router-dom'
import get from 'lodash.get'
import moment from 'moment'
import TagManager from 'react-gtm-module'
import Form from '~common/components/Form'
import FormTitle from '~components/Layout/Dashboard/FormTitle'
import Button from '~components/Button'
import ContainerRow from '~components/ContainerRow'
import PlanCard from '~components/PlanCard'
import PaymentCard from '~components/PaymentCard'
import ScrollContainer from '~components/Layout/Dashboard/ScrollContainer'
import CancelAccount from './CancelAccount'
import ProfileHeader from '../layout/ProfileHeader'
import { toast } from '~common/helper'
import './layout/style.scss'

const MyProfile = withRouter(({
  history,
  user,
  initUpdateUserInfo,
  getUser,
  getPlans,
  credit,
  removeCard,
  cancelUserAccount,
  pauseUserAccount,
  logout,
  getUpcomingInvoice,
}) => {
  const [cancelAccount, showCancelAccount] = useState(false)
  const userName = user.result.user ? get(user.result.user.user, 'name') : null
  const subscription = get(user.result.user.user, 'subscription')
  const credits = get(user.result.user.user.credit, 'ballance')
  const properties = get(user.result.user.user, 'property_count')
  const addOns = get(user.result.user.user, 'add_ons')
  const isCancelled = get(user.result.user.user, 'is_cancelled')
  const photoUrl = user.result.user ? get(user.result.user.user, 'photo_url') : null
  const paymentMethods = user.result.user ? get(user.result.user.user, 'payment_methods') : null
  const defaultPaymentMethod = user.result.user ? get(user.result.user.user, 'payment_method') : null
  const role = user.result.user ? get(user.result.user.user, 'role') : null

  const success = user.update_user_info ? get(user.update_user_info, 'success') : null
  const errorCancel = user.cancel_user_account ? get(user.cancel_user_account, 'error') : null
  const loadingCancel = user.cancel_user_account ? get(user.cancel_user_account, 'loading') : null
  const successCancel = user.cancel_user_account ? get(user.cancel_user_account, 'success') : null
  const errorPause = user.pause_user_account ? get(user.pause_user_account, 'error') : null
  const loadingPause = user.pause_user_account ? get(user.pause_user_account, 'loading') : null
  const successPause = user.pause_user_account ? get(user.pause_user_account, 'success') : null

  const upcomingInvoice = get(credit, 'upcomingInvoice')
  const nextInvoiceDate = upcomingInvoice ? get(upcomingInvoice, 'data.next_payment_attempt') : null

  const planList = get(credit.plans.data, 'data')

  useEffect(() => {
    initUpdateUserInfo()
    getUser(user)
    getUpcomingInvoice()
  }, [])

  useEffect(() => {
    if (subscription) {
      getPlans(subscription.interval)
    }
  }, [subscription])

  useEffect(() => {
    if (success) {
      toast('Updated!')
      initUpdateUserInfo()
      getUser(user)
    }
  }, [success])

  const onCancel = (surveyId, surveyText) => {
    cancelUserAccount(
      surveyId,
      surveyText
    )
  }

  const onPause = (surveyId, surveyText) => {
    pauseUserAccount(
      surveyId,
      surveyText
    )
  }

  useEffect(() => {
    if (successPause) {
      toast.success('Updated!')
      logout(localStorage.getItem('oneSignalUserId'))
    }
  }, [successPause])

  useEffect(() => {
    if (successPause || successCancel) {
      toast.success('Updated!')
      const tagManagerArgs2 = {
        dataLayer: {
          event: successPause ? 'account_paused' : 'account_cancelled',
        },
      }
      TagManager.dataLayer(tagManagerArgs2)
      logout(localStorage.getItem('oneSignalUserId'))
    }
  }, [successPause, successCancel])

  useEffect(() => {
    if (errorPause || errorCancel) {
      toast.error('Error!')
    }
  }, [errorPause, errorCancel])

  const gotoPlanList = () => {
    history.push('/dashboard/settings/plans')
  }

  const gotoPaymentMethod = () => {
    history.push('/dashboard/settings/paymentmethod')
  }

  return (
    <Form className="profile-page--first">
      <FormTitle title="Profile" hasBack history={history} />
      <ScrollContainer>
        <ProfileHeader
          photoUrl={photoUrl}
          properties={properties}
          credits={credits}
          role={role}
          history={history}
        />
        <ContainerRow className="user-name">
          <h4>{userName}</h4>
          {/* <p>San Francisco, CA</p> */}
        </ContainerRow>
        {
          role === 'owner' && (
          <ContainerRow>
            {
              user && planList && subscription && (
                planList.filter((plan) => subscription.id === plan.id).map((plan) => (
                  <PlanCard
                    {...plan}
                    history={history}
                    subscription={subscription}
                    key={plan.id}
                    cancelled={isCancelled}
                    addOns={addOns}
                    visibleSetAsDefault
                    onClick={gotoPlanList}
                  />
                ))
              )
            }
            <div className="next-invoice-date">
              {
                nextInvoiceDate && `Next Charge ${moment.unix(nextInvoiceDate).format('MM/DD/YYYY')}`
              }
            </div>
            {
              paymentMethods && paymentMethods
                .filter((paymentMethod) => paymentMethod.id === defaultPaymentMethod)
                .map((paymentMethod) => {
                  return (
                    <PaymentCard
                      key={paymentMethod.id}
                      paymentMethod={paymentMethod}
                      isDefault
                      removeCard={removeCard}
                      onClick={gotoPaymentMethod}
                    />
                  )
                })
            }
          </ContainerRow>
          )
        }
        <ContainerRow className="button-container">
          <Link to="/dashboard/settings/profile/edit">
            <Button
              label="Edit Profile"
              width="70%"
              height={40}
            />
          </Link>
          <Link to="/dashboard/settings/changepassword">
            <Button
              label="Change Password"
              width="70%"
              color="white"
              height={40}
            />
          </Link>
          {
            role === 'owner' && (
            <Button
              label="Cancel Account"
              width="70%"
              color="white"
              height={40}
              onClick={() => showCancelAccount(true)}
            />
            )
          }
        </ContainerRow>
      </ScrollContainer>
      {cancelAccount && (
        <CancelAccount
          toggle={cancelAccount}
          onClose={() => showCancelAccount(false)}
          actionCancel={onCancel}
          actionPause={onPause}
          loading={loadingCancel || loadingPause}
        />
      )}
    </Form>
  )
})

export default MyProfile
