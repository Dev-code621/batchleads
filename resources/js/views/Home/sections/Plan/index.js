import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import ScrollAnimation from 'react-animate-on-scroll'
import ReactTooltip from 'react-tooltip'
import PricingCard from './layout/PricingCard';
import AdditionalOptionCard from './layout/AdditionalOptionCard'
import BaseModal from '~components/BaseModal'
import Button from '~components/Button'
import PlanSelector from '~components/PlanSelector'
import MapIcon from '~assets/icons/map.svg'
import RouteIcon from '~assets/icons/route.svg'
import './layout/style.scss'
import PricingCarousel from './layout/PricingCarousel';

const buttonStyles = {
  width: 'max-content',
  fontSize: '16px',
  lineHeight: '24px',
  padding: '8px 20px',
  textTransform: 'inherit',
}

const pricingLists = [
  {
    id: 'pricingLists-0',
    index: 0,
    name: 'base',
    newPrice: 49,
    priceBy: 'mo',
    description: [
      { text: 'Unlimited Property Lookups' },
      { text: 'Pre-Foreclosures', disabled: true },
      { text: 'Tax Defaults', disabled: true },
      { text: 'Vacant Properties' },
      { text: '1 User' },
    ],
    isSelected: false,
  },
  {
    id: 'pricingLists-1',
    index: 1,
    name: 'Performance',
    newPrice: 119,
    priceBy: 'mo',
    description: [
      { text: 'Unlimited Property Lookups' },
      { text: 'Pre-Foreclosures' },
      { text: 'Tax Defaults' },
      { text: 'Vacant Properties' },
      { text: 'Up to 3 Users Included' },
    ],
    isSelected: true,
  },
  {
    id: 'pricingLists-2',
    index: 2,
    name: 'Performance +',
    newPrice: 199,
    priceBy: 'mo',
    description: [
      { text: 'Unlimited Property Lookups' },
      { text: 'Pre-Foreclosures' },
      { text: 'Tax Defaults' },
      { text: 'Vacant Properties' },
      { text: '10+ Users' },
    ],
    isSelected: false,
  },
]

const additionalOption = [
  {
    title: 'Add Google Street Pics',
    price: 20,
    paidType: 'month',
    image: MapIcon,
    description: 'Instantly see a "curbside view" photo of a property through Google\'s Street View.',
  },
  {
    title: 'Add Real-Time Driving Routes',
    price: 20,
    paidType: 'month',
    image: RouteIcon,
    description: 'See real-time driving routes and never drive the same route twice!',
  },
]


export default withRouter(({ history }) => {
  const [activeItem, setActiveItem] = useState('pricingLists-1')
  const [showSkipComparison, setShowSkipComparison] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(pricingLists[1])
  const toolTipId = 'viewDetails'

  return (
    <section className="pricing-section">
      {/* <div className="container" id="features">
        <ul className="month-year--switch">
          <li>Monthly</li>
          <li>3 Months</li>
          <li>6 Month</li>
          <li className="selected">Year</li>
        </ul>
  </div> */}
      <ReactTooltip html className="tool-tip" id={toolTipId} place="right" backgroundColor="#fff" />
      <div className="pricing-carousel-container">
        {
            pricingLists.map((pricingList, index) => {
              let zIndex = 1
              let animation = 'fadeIn'
              let delay = 50
              if (index === 0) {
                animation = 'fadeInLeft'
                delay = 350
              } else if (index === 2) {
                animation = 'fadeInRight'
                delay = 550
              } else if (index === 1) {
                zIndex = 999
              }
              return (
                <div style={{ zIndex }}>
                  <ScrollAnimation animateIn={animation} delay={delay} animateOnce>
                    <PricingCard
                      {...pricingList}
                      key={pricingList.id}
                      activeItem={activeItem}
                      setActiveItem={setActiveItem}
                      history={history}
                      index={index + 1}
                      toolTipId={toolTipId}
                    />
                  </ScrollAnimation>
                </div>
              )
            })
          }
      </div>
      <div className="pricing-carousel-container mobile">
        <PricingCarousel
          plans={pricingLists}
          selectedIndex={selectedPlan.index}
          history={history}
          onChange={(index) => {
            setSelectedPlan(pricingLists[index])
            setActiveItem(pricingLists[index].id)
          }}
          activeItem={activeItem}
          toolTipId={toolTipId}
        />
      </div>

      <div className="plan-comparison">
        <div className="container">
          <div>
            <Button
              label="VIEW FULL PLAN COMPARISON"
              height={40}
              color="gray"
              style={buttonStyles}
              onClick={() => setShowSkipComparison(true)}
            />
          </div>
        </div>
      </div>

      <div className="additional-option">
        <div className="container">
          <h2>ADDITIONAL OPTIONS</h2>

          <ScrollAnimation animateIn="bounceInLeft" animateOnce>
            <div className="additional-option-container">
              {
                additionalOption.map((option) => (
                  <AdditionalOptionCard {...option} />
                ))
              }
            </div>
          </ScrollAnimation>
        </div>
      </div>

      <span className="back-decoration back-decoration--dots1" />
      <span className="back-decoration back-decoration--cloud1" />

      <BaseModal
        toggle={showSkipComparison}
        onClose={() => setShowSkipComparison(false)}
      >
        <div className="plan-selector-modal-container">
          <PlanSelector />
        </div>
      </BaseModal>
    </section>
  )
})
