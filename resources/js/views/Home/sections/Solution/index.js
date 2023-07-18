import React from 'react'
import { Link } from 'react-router-dom'
import ScrollAnimation from 'react-animate-on-scroll'

import Button from '~components/Button'

import './style.scss'


export default ({ utmCampaign }) => {
  const signUpUrl = utmCampaign ? `/signup?utm_campaign=${utmCampaign}` : '/signup'

  return (
    <section className="solution-section">
      <ScrollAnimation animateIn="fadeIn" animateOnce>
        <div className="container">
          <div className="block block--image">
            <div className="block--image__ornament block--image__ornament--4" />
            <div className="block--image___ornament-container">

              <ScrollAnimation animateIn="bounceIn" delay="50" animateOnce>
                <div className="block--image__ornament block--image__ornament--1" />
              </ScrollAnimation>
              <ScrollAnimation animateIn="bounceIn" delay="100" animateOnce>
                <div className="block--image__ornament block--image__ornament--2" />
              </ScrollAnimation>
              <ScrollAnimation animateIn="bounceIn" delay="150" animateOnce>
                <div className="block--image__ornament block--image__ornament--3" />
              </ScrollAnimation>
            </div>
          </div>
          <div className="block block--text">
            <h3 className="block__title">
              A Solution For Any Real Estate Investor
            </h3>
            <p>
              Whether you’re contacting thousands of leads every month, or just getting started,
            </p>
            <p>
              <i>
                <span>BatchDriven</span>
                has a solution for you!
              </i>
            </p>
            <Link to={signUpUrl}>
              <Button
                label="Start your 7 Days Free Trial"
                height={40}
                style={
                  {
                    fontSize: '16px',
                    lineHeight: '24px',
                    fontWeight: 'normal',
                    margin: '40px 0px',
                    padding: '7px 25px',
                    width: 'fit-content',
                    textTransform: 'inherit',
                  }
                }
              />
            </Link>
          </div>
        </div>
      </ScrollAnimation>
    </section>
  )
}
