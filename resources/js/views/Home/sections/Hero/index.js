import React from 'react'
import { Link } from 'react-router-dom'
import Button from '~components/Button'
import WhiteDot from '~assets/images/white.png'

import './style.scss'

export default ({ children, utmCampaign }) => {
  const signUpUrl = utmCampaign ? `/signup?utm_campaign=${utmCampaign}` : '/signup'

  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-text">
          <div className="hero-icon"><img src={WhiteDot} alt="White-Dot" /></div>
          <h1 className="hero-logo">
            ALL-IN-ONE&nbsp;TOOL
          </h1>
          <h2 className="hero-title">
            for Real Estate Opportunities
          </h2>
          <div className="hero-button-container">
            <Link to={signUpUrl}>
              <Button
                label="START YOUR 7-DAY FREE TRIAL"
                width="100%"
                height={40}
                color="blue"
                style={
                  {
                    fontFamily: 'BebasNeue',
                    fontSize: '16px',
                    lineHeight: '24px',
                    padding: '10px 20px',
                    letterSpacing: '2px',
                  }
                }
              />
            </Link>
          </div>
        </div>
        {children}
      </div>
    </section>
  )
}
