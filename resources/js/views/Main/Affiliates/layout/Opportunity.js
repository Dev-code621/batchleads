import React from 'react'
import './Opportunity.style.scss'
import Button from './Button'
import SecureCheckOut from './SecureCheckOut'

export default ({ onGetStart }) => (
  <div className="opportunity-container">
    <div className="description">
      And, you can&nbsp;
      <b>cancel your trial at any time</b>
      , automatically and&nbsp;
      <br />
      without contacting our support team!
    </div>
    <div className="title">
      Don’t miss this opportunity!
    </div>
    <div className="trial">
      7 days free trial
    </div>
    <Button onClick={onGetStart} />
    <SecureCheckOut />
  </div>
)
