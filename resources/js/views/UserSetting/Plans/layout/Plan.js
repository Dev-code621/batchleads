import React from 'react'
import { formatNumber } from '~common/helper'

export default (props) => {
  const {
    id,
    nickname,
    interval,
    amount,
    subscription,
    changePlan,
    cancelled,
    addOns,
  } = props
  const isActive = subscription.id === id

  const switchPlan = () => {
    if (!isActive || cancelled) {
      changePlan()
    }
  }


  const isActiveAddOn = (addOn) => {
    return addOns.map((e) => e.add_on).indexOf(addOn) > -1
  }

  let actionClassName = 'active'
  let actionName = 'Current Plan'
  if (cancelled) {
    actionClassName = 'upgrade'
    actionName = 'Subscribe'
  } else if ((subscription.amount / 100) > (amount / 100)) {
    actionName = 'Downgrade'
    actionClassName = 'downgrade'
  } else if ((subscription.amount / 100) < (amount / 100)) {
    actionName = 'Upgrade'
    actionClassName = 'upgrade'
  }


  return (
    <div className={`list-item plan-info-container ${actionClassName}`}>
      <div
        className="plan-action"
        onClick={switchPlan}
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
  )
}
