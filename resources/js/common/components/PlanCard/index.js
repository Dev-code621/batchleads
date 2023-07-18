import React from 'react'
import { formatNumber } from '~common/helper'
import './style.scss'

export default (props) => {
  const {
    id,
    history,
    nickname,
    interval,
    amount,
    subscription,
    changePlan,
    cancelled,
    addOns,
    disabled,
    onClick,
  } = props

  const isActive = subscription.id === id
  const isUserSubscribedToDisabledPlan = disabled && isActive

  // eslint-disable-next-line no-unused-vars
  const switchPlan = () => {
    if (!isActive || cancelled) {
      changePlan()
    }
  }


  const isActiveAddOn = (addOn) => {
    return addOns.map((e) => e.add_on).indexOf(addOn) > -1 || nickname === 'PERFORMANCE+'
  }

  let actionClassName = ''
  let actionName = ''
  if (cancelled) {
    actionClassName = 'upgrade'
    actionName = 'Subscribe'
  } else if ((subscription.amount / 100) > (amount / 100)) {
    actionName = 'Downgrade'
    actionClassName = 'downgrade'
  } else if ((subscription.amount / 100) <= (amount / 100)) {
    actionName = 'Upgrade'
    actionClassName = 'upgrade'
  }

  if (subscription.id === id) {
    actionClassName = 'active'
    actionName = 'Current Plan'
  }

  const onClickCard = () => {
    if (onClick) {
      onClick()
    } else {
      history.push(`/dashboard/settings/addons/${id}`);
    }
  }

  return (
    (disabled && isUserSubscribedToDisabledPlan) || (!disabled && !isUserSubscribedToDisabledPlan)
      ? (
        <div
          className={`plan-card ${actionClassName}`}
          onClick={onClickCard}
        >
          <div
            className="plan-action"
            onClick={onClickCard}
            onKeyPress={() => {}}
            role="button"
            tabIndex="0"
          >
            {
              actionName
            }
          </div>
          <div className="plan-info-left-container">
            <div className="list-item-title-container">
              <div className="list-item-title">{nickname}</div>
              { actionClassName === 'active' && (
              <div className="list-item-description">
                <div className={`list-item-addon ${isActiveAddOn('driving_route') ? 'active' : ''}`}>
                  Real-time Driving Routes
                </div>
                <div className={`list-item-addon ${isActiveAddOn('street_view') ? 'active' : ''}`}>
                  Google Street Pic
                </div>
              </div>
              ) }
            </div>
          </div>
          <div className="plan-info">
            <div className="plan-interval">{interval}</div>
            <div className="plan-price">{`$${formatNumber(amount / 100)}`}</div>
          </div>
        </div>
      ) : null
  )
}
