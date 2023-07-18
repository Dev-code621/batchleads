import React from 'react'
import Button from './Button'
import './GetStartedNow.style.scss'
import SecureCheckOut from './SecureCheckOut'

export default ({ onGetStart }) => (
  <div className="get-started-now-container">
    <div className="offering">
      And now, for a limited time, we’re offering you&nbsp;
      <br />
      <span>50</span>
      &nbsp;Skip Trace for&nbsp;
      <span>FREE</span>
    </div>
    <div className="free-trial">
      7 days free trial
    </div>
    <Button onClick={onGetStart} />
    <SecureCheckOut />
  </div>
)
