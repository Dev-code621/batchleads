import React from 'react'

export default ({ holder, expireDate }) => {
  return (
    <div className="card-info">
      <div>
        <div className="holder-name-title">CARDHOLDER NAME</div>
        <div className="holder-name">{holder}</div>
      </div>
      <div>
        <div className="holder-name-title">EXPIRE DATE</div>
        <div className="exp-date">{expireDate}</div>
      </div>
    </div>
  )
}
