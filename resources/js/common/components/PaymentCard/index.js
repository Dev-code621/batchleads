import React from 'react'
import BankInfo from './BankInfo'
import CardNumber from './CardNumber'
import CardInfo from './CardInfo'
import './style.scss'

export default ({
  paymentMethod,
  isDefault,
  setDefaultCard,
  removeCard,
  // editCard,
  // visibleSetAsDefault,
  onClick,
}) => {
  const onClickCard = () => {
    if (onClick) {
      onClick()
    }
  }

  return (
    <div className="payment-card" onClick={onClickCard}>
      <div className="payment-card__body">
        <BankInfo name={paymentMethod.card.brand} />
        <CardNumber number={paymentMethod.card.last4} />
        <CardInfo holder={paymentMethod.billing_details.name} expireDate={`${paymentMethod.card.exp_month} / ${paymentMethod.card.exp_year}`} />
      </div>
      {
        !isDefault && (
        <div className="bottom action-container">
          <div
            className="btn-remove--round_outline"
            onClick={() => removeCard(paymentMethod.id)}
            onKeyPress={() => {}}
            role="button"
            tabIndex="0"
          />
          {/* <div
            className="btn-edit--round_outline"
            onClick={() => editCard(paymentMethod.id)}
            onKeyPress={() => {}}
            role="button"
            tabIndex="0"
          /> */}
          <div
            className={`btn-star--round_outline ${!isDefault ? 'active' : ''}`}
            onClick={() => setDefaultCard(paymentMethod.id)}
            onKeyPress={() => {}}
            role="button"
            tabIndex="0"
          />
        </div>
        )
      }
    </div>
  )
}
