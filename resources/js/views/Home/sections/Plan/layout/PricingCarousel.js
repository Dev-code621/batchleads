import React from 'react'
import Carousel from 'nuka-carousel'
import PricingCard from './PricingCard'

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
  selectedIndex, plans, onChange, history, activeItem, toolTipId,
}) => (
  <Carousel
    heightMode="max"
    slideIndex={plans.length > selectedIndex ? selectedIndex : 0}
    defaultControlsConfig={defaultControlsConfig}
    afterSlide={onChange}
  >
    {plans.map((plan, index) => (
      <PricingCard
        {...plan}
        key={plan.id}
        activeItem={activeItem}
        setActiveItem={onChange}
        history={history}
        index={index + 1}
        toolTipId={toolTipId}
      />
    ))}
  </Carousel>
)
