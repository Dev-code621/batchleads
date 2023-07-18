import React from 'react'
import { Link } from 'react-router-dom';
import ScrollAnimation from 'react-animate-on-scroll'

import Button from '~components/Button'
import './style.scss'
import iPhone0 from '~assets/images/iphone0.png'
import iPhone1 from '~assets/images/iphone1.png'
import iPhone2 from '~assets/images/iphone2.png'
import iPhone3 from '~assets/images/iphone3.png'


export default ({ utmCampaign }) => {
  const signUpUrl = utmCampaign ? `/signup?utm_campaign=${utmCampaign}` : '/signup'

  return (
    <section className="addition-section">
      <div className="container">
        <div className="block block--image">
          <ScrollAnimation animateIn="fadeInLeft" delay={50} animateOnce>
            <img className="iphone-1" src={iPhone0} alt="iphone" />
          </ScrollAnimation>
          <div className="v-align">
            <ScrollAnimation animateIn="fadeIn" animateOnce>
              <img className="iphone-2" src={iPhone1} alt="iphone" />
            </ScrollAnimation>
            <ScrollAnimation animateIn="fadeInUp" delay={100} animateOnce>
              <img className="iphone-2" src={iPhone2} alt="iphone" />
            </ScrollAnimation>
          </div>
          <ScrollAnimation animateIn="fadeInRight" delay={150} animateOnce>
            <img className="iphone-1" src={iPhone3} alt="iphone" />
          </ScrollAnimation>

        </div>
        <ScrollAnimation animateIn="bounceIn" animateOnce>
          <div className="block block--text">
            <h3>
              Try BatchDriven For Free For 7 Days
            </h3>
            <p>No Obligation, No Contracts, Cancel at any time.</p>
            <ul>
              <li>Plot Driving Routes</li>
              <li>Tracking & Scalability</li>
              <li>Owner Look Ups</li>
              <li>Bulk Upload - Import & Export Data From Spreadsheets</li>
              <li>Data lists - Pre-Foreclosures, High Equity, and Vacants</li>
              <li>Direct Mail & SMS Marketing Automation</li>
            </ul>
            <Link to={signUpUrl}>
              <Button
                label="Start your 7-Day Free Trial Now"
                height={40}
                color="gray"
                style={
                  {
                    width: 'fit-content',
                    fontSize: '16px',
                    lineHeight: '24px',
                    padding: '8px 20px',
                    textTransform: 'inherit',
                  }
                }
              />
            </Link>

          </div>
        </ScrollAnimation>

      </div>
    </section>
  )
}
