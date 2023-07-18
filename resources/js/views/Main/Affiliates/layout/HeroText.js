import React from 'react'
import './HeroText.style.scss'

export default ({ transparent }) => (
  <div className={`hero-text-container ${transparent && 'transparent-hero'}`}>
    <div>
      <b>Yes</b>
      , you read that right - 50 Skip Traces for
      <b>
        <span className="black"> FREE</span>
      </b>
      .
    </div>
    <div>
      <i>Act now because this offer won&apos;t lost!</i>
    </div>
  </div>
)
