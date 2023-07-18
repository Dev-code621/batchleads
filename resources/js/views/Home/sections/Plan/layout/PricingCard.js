import React from 'react'
import { Link } from 'react-router-dom'
import checkBlue from '~assets/icons/check_blue.svg'
import checkBlack from '~assets/icons/check_black.svg'
import Button from '~components/Button'
import { planDetailsItem } from '~common/constants'

const buttonStyles = {
  width: 'fit-content',
  fontSize: '16px',
  lineHeight: '24px',
  padding: '8px 20px',
  textTransform: 'inherit',
}

export default ({
  id,
  name,
  description,
  newPrice,
  paidType,
  activeItem,
  setActiveItem,
  history,
  index,
  toolTipId,
}) => {
  // const toolTip = '<div>TEST HTML</div>'
  const tooltips = planDetailsItem.map((item) => (
    `<div class="tool-tip-detail">
      <div><img src="${checkBlack}" /></div>
      <div class="${item.status[index - 1] === 'no' ? 'disabled' : ''}">${item.is_price ? `${item.status[index - 1]} Per ${item.title_for_price}` : item.title}</div>
    </div>`
  ))
  const tooltip = tooltips.join('')
  const CheckIcon = () => {
    return <img src={checkBlue} alt="check" />
  }
  // const buttonLabel = activeItem === id ? 'CHOOSE PLAN' : 'SUBSCRIBE NOW'
  const buttonLabel = 'SUBSCRIBE NOW'
  return (
    <div className={`pricing-card ${activeItem === id ? 'active' : ''}`}>
      <div className="pricing-card-header" onClick={() => { setActiveItem(id) }}>
        <h1>{name}</h1>
        <div className="arrow-down" />
      </div>
      <div className="pricing-card-body">
        <div className="pricing-amount-text">
          <div className="package__title">
            <span>
              {`$${newPrice}`}
            </span>
              /mo
          </div>
          <div className="package-type">
            {
                paidType ? `Paid ${paidType}` : ''
              }
          </div>
        </div>
        <ul className="pricing-include">
          {
              description.map((item) => (
                <li key={item.text} className={`${item.disabled ? 'disabled' : ''}`}>
                  <span className="check_blue">
                    <CheckIcon />
                  </span>
                  {item.text}
                </li>
              ))
            }
        </ul>
        <div className="pricing-card-footer">
          <div className="view-more">
            <Link to="/pricing">
              <span onHov data-tip={`<div>${tooltip}</div>`} data-for={toolTipId}>View all features</span>
            </Link>
          </div>

          <div className="subscribe-button">
            <Button
              label={buttonLabel}
              height={40}
              color="blue"
              style={buttonStyles}
              onClick={() => { history.push('/signup', { plan_id: index }) }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
