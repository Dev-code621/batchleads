import React from 'react'
import {
  formatDateString2,
} from '~common/helper'

export default ({
  transaction,
}) => {
  const { other, created_at: createdAt, credit_amount: amount } = transaction
  let className = ''
  if (amount > 0) {
    className = 'charged-credit'
  } else if (amount < 0) {
    className = 'spent-credit'
  }

  return (
    <div className="transaction-info list-item">
      <div className="list-item-title-container">
        <div className="list-item-title">{other}</div>
        <div className={className}>{amount}</div>
      </div>
      <div className="date-time-info">{formatDateString2(createdAt)}</div>
    </div>
  )
}
