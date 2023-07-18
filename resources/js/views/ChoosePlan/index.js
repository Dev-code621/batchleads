import React, { useState } from 'react'
import { connect } from 'react-redux'
import get from 'lodash.get'
import { withRouter } from 'react-router-dom'

import Button from '~components/Button'
import Step from '~components/Step'
import PlanSelector from '~components/PlanSelector'
import PlanAddOnItem from './layout/PlanAddOnItem'
import PlanPeriodToggle from './layout/PlanPeriodToggle'
import './layout/style.scss'
import { planAddOnItem } from '~common/constants'
import { userSelector } from '~redux/selectors/userSelector'

const mapStateToProps = (state) => ({
  user: userSelector(state),
})

const mapDispatchToProps = {
}

const ChoosePlan = withRouter(({
  history,
  user,
}) => {
  const [selectedPlan, setSelectedPlan] = useState(0)
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(1)
  const [plans, setPlans] = useState([])
  const [addOns, setAddOns] = useState([])
  const [planPeriod, setPlanPeriod] = useState('month')
  const [total, setTotal] = useState(0)
  const username = user.result.user ? get(user.result.user.user, 'name') : null
  const preSelectedPlanIndex = user.result.user ? get(user.result.user.user, 'pre_selected_plan_index') : null

  const calcTotal = () => {
    if (plans && plans.length) {
      const addOnCost = 20;
      setTotal(
        plans[selectedPlanIndex].amount / 100
        + (selectedPlanIndex < 2 ? addOns.filter((e) => e).length * addOnCost : 0)
      )
    }
  }

  const onContinue = (hasAddOn) => {
    history.push(`/subscribe/payment/${selectedPlan}?driving_route=${hasAddOn && !!addOns[0]}&street_view=${hasAddOn && !!addOns[1]}&plan_period=${planPeriod}`)
  }

  const onChangeAddon = (index) => {
    addOns[index] = !addOns[index];
    setAddOns([...addOns]);
    calcTotal()
  }

  const afterGetPlans = (planList) => {
    setPlans(planList)
    setTotal(planList[1].amount / 100)
    setSelectedPlan(planList[1].id)
    setSelectedPlanIndex(1)
    if (preSelectedPlanIndex) {
      history.push(`/subscribe/payment/${planList[preSelectedPlanIndex - 1].id}`)
    }
  }

  const onSelectPlan = (index, id) => {
    setSelectedPlan(id)
    setSelectedPlanIndex(index)
    calcTotal()
  }

  return (
    <div className="choose-plan-page">
      <div className="input-container">
        <Step active={1} userName={username} />
        <React.Fragment>
          <div className="plan-period-toggle-container">
            <PlanPeriodToggle
              active={planPeriod}
              onClickMonth={() => setPlanPeriod('month')}
              onClickYear={() => setPlanPeriod('year')}
            />
          </div>

          <PlanSelector
            onSelectPlan={(index, id) => onSelectPlan(index, id)}
            afterGetPlans={(planList) => afterGetPlans(planList)}
            planPeriod={planPeriod}
          />
          <div className="addon-container">
            <div className="addon-title">
              <span className="blue-text">CHOOSE</span>
                YOUR
              <span className="blue-text">ADD-ONS</span>
              <span className="small">*optional</span>
            </div>
            <div className="plan-details-container">
              {planAddOnItem.map((item, index) => (
                <PlanAddOnItem
                  {...item}
                  key={item.title}
                  addOns={addOns}
                  addOnIndex={index}
                  onChangeAddon={() => onChangeAddon(index)}
                  selectedPlanIndex={selectedPlanIndex}
                />
              ))}
            </div>
          </div>
          <div className="summary-container">
            <div className="note-container">
                *Note
              <span>$ 1 = 30 Credits</span>
            </div>
            <div className="price-container">
                Total:
              <span>{`$${total}`}</span>
            </div>
            <div className="button-container">
              <Button
                label="CONTINUE TO ORDER"
                width="50%"
                height={30}
                icon="cart"
                onClick={() => { onContinue(true) }}
              />
              {/* <div className="continue-link" onClick={() => { onContinue(false) }}>
                  no, continue without add-ones
                </div> */}
            </div>
          </div>
        </React.Fragment>

      </div>
    </div>
  )
})

export default connect(mapStateToProps, mapDispatchToProps)(ChoosePlan)
