import React from 'react';

import RegUserSVG from '~assets/icons/reg-user.svg'
import RegPlanSVG from '~assets/icons/reg-plan.svg'
import RegPaymentSVG from '~assets/icons/reg-payment.svg'
import RegPaymenActivetSVG from '~assets/icons/reg-payment-active.svg'


import './style.scss';

export default ({ active, userName, planName = '' }) => (
  <div className="step-container">
    <div className="step step--0 active">
      <img src={RegUserSVG} alt="personal data" />
      <div className="step__label">
        Personal data:
        <span className="value">{userName}</span>
      </div>
    </div>
    <div className={`step step--1 ${active > 0 ? 'active' : undefined}`}>
      <img src={RegPlanSVG} alt="plan" />
      <div className="step__label">
        {planName ? 'Plan:' : 'Select your plan'}
        <span className="value">{planName}</span>
      </div>
    </div>
    <div className={`step step--2 ${active === 2 ? 'active' : undefined}`}>
      <img src={active === 2 ? RegPaymenActivetSVG : RegPaymentSVG} alt="payment" />
      <div className="step__label">
        Payment details
      </div>
    </div>
  </div>
);
