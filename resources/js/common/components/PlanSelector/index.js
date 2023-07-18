import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import get from 'lodash.get'
import { planDetailsItem } from '~common/constants'
import PlanDetailsItem from './PlanDetailsItem'
import PlanCarouselPicker from './PlanCarouselPicker'
import PlanPicker from './PlanPicker'
import LoadingActivity from '~components/LoadingActivity'
import { creditSelector } from '~redux/selectors/creditSelector'
import { getPlans } from '~redux/modules/credit'
import './style.scss'

export default ({ onSelectPlan, afterGetPlans, planPeriod = 'month' }) => {
  const dispatch = useDispatch()
  const credit = useSelector(creditSelector)
  const [selectedPlan, setSelectedPlan] = useState(0)
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(1)
  const [plans, setPlans] = useState([])

  const planList = get(credit.plans.data, 'data')

  useEffect(() => {
    if (!planList) {
      dispatch(getPlans(planPeriod))
    }
  }, [])

  useEffect(() => {
    dispatch(getPlans(planPeriod))
  }, [planPeriod])

  useEffect(() => {
    if (credit.plans.success) {
      const enabledPlanList = planList.filter((item) => !item.disabled && !item.is_pause)
      setPlans(enabledPlanList)
      if (enabledPlanList.length > 0) {
        setSelectedPlan(enabledPlanList[0].id)
        setSelectedPlanIndex(0)
        if (enabledPlanList.length >= 2) {
          setSelectedPlan(enabledPlanList[1].id)
          setSelectedPlanIndex(1)
          if (afterGetPlans) {
            afterGetPlans(enabledPlanList)
          }
        }
      }
    }
  }, [credit.plans])

  const onChangeCarousel = (index) => {
    setSelectedPlanIndex(index)
    setSelectedPlan(plans[index].id)
    if (onSelectPlan) {
      onSelectPlan(index, plans[index].id)
    }
  }

  return (
    <div className="plan-selector-container">
      {
        credit.plans.loading ? (
          <div className="spinner-container">
            <LoadingActivity />
          </div>
        ) : (
          <React.Fragment>
            <div className="desktop-plan-pick-container">
              <div className="plan-picker-container">
                <PlanPicker
                  selectedPlan={selectedPlan}
                  onSelectPlan={(planId, index) => {
                    setSelectedPlan(planId)
                    setSelectedPlanIndex(index)
                    if (onSelectPlan) {
                      onSelectPlan(index, planId)
                    }
                  }}
                  plans={plans}
                />
              </div>
              <div className="plan-details-container">
                <div className="plan-details-item">
                  <div>
                    <div className="plan-details-item-description" />
                    <div className="plan-details-item-detail">
                      {plans.map((plan) => (
                        !plan.disabled && (
                        <div
                          key={plan.id}
                          className={`plan-details-item-detail-cell pb-0 ${selectedPlan === plan.id && 'active'}`}
                        >
                          {
                      (plan.interval === 'year'
                        ? (
                          <div className="plan-price">
                            {`$ ${plan.amount / 100}`}
                            <span>per year</span>
                          </div>
                        ) : (
                          <div className="plan-price">
                            {`$ ${plan.amount / 100}`}
                            <span>per month</span>
                          </div>
                        )
                      )
                    }
                        </div>
                        )
                      ))}
                    </div>
                  </div>
                </div>
                {planDetailsItem.map((item) => (
                  <PlanDetailsItem
                    {...item}
                    key={item.title}
                    selectedPlanIndex={selectedPlanIndex}
                    planPeriod={planPeriod}
                  />
                ))}
              </div>
            </div>

            <div className="mobile-plan-pick-container">
              {plans.length > 0 && (
              <PlanCarouselPicker
                plans={plans}
                selectedPlanIndex={selectedPlanIndex}
                onChange={onChangeCarousel}
                planDetails={planDetailsItem}
                planPeriod={planPeriod}
              />
              )}
            </div>
          </React.Fragment>
        )
      }
    </div>
  )
}
