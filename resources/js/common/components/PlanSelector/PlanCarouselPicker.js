import React from 'react'
import Carousel from 'nuka-carousel'
import PlanCarouselItem from './PlanCarouselItem'

const defaultControlsConfig = {
  pagingDotsStyle: {
    width: '20px',
    height: '20px',
  },
  prevButtonStyle: {
    display: 'none',
  },
  nextButtonStyle: {
    display: 'none',
  },
}

export default ({
  selectedPlanIndex,
  plans,
  planDetails,
  onChange,
  planPeriod,
}) => (
  <Carousel
    heightMode="max"
    slideIndex={plans.length > selectedPlanIndex ? selectedPlanIndex : 0}
    defaultControlsConfig={defaultControlsConfig}
    afterSlide={onChange}
  >
    {plans.map((plan) => (
      <PlanCarouselItem
        plan={plan}
        key={plan.id}
        activeIndex={selectedPlanIndex}
        planDetails={planDetails}
        planPeriod={planPeriod}
      />
    ))}
  </Carousel>
)
