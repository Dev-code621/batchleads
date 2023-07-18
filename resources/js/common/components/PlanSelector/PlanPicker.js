import React from 'react'
import PlanPickerItem from './PlanPickerItem'

export default ({ onSelectPlan, selectedPlan, plans }) => (
  <div className="plan-picker">
    {plans.map((plan, index) => (
      plan.disabled ? null
        : (
          <PlanPickerItem
            key={plan.id}
            index={index}
            onClick={() => onSelectPlan(plan.id, index)}
            active={selectedPlan === plan.id}
            text={plan.nickname}
          />
        )
    ))}
  </div>
)
