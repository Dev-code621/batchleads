import React from 'react'
import ScrollAnimation from 'react-animate-on-scroll'

import Logo1 from '~assets/images/logo1.png'
import Logo2 from '~assets/images/logo2.png'
import Logo3 from '~assets/images/logo3.png'
import Logo4 from '~assets/images/logo4.png'
import Logo5 from '~assets/images/logo5.png'
import Logo6 from '~assets/images/logo7.png'

import './style.scss'

export default () => (
  <section className="partner-section">
    <ScrollAnimation animateIn="fadeIn" animateOnce>
      <div className="container">
        <div className="block block--text">
          <h3 className="block__title">
            Loved by
            <span>32,296</span>
            <br />
            Investors Nationwide
          </h3>
          <ul>
            <li className="item-mailer">
              1.6M
              <span>
                Real Estate
                <br />
                mailers delivered
              </span>
            </li>
            <li className="item-owners">
              9.1M
              <span>
                Property owners
                <br />
                found
              </span>
            </li>
          </ul>
        </div>
        <div className="block block--image">
          <ScrollAnimation animateIn="flash" delay="150" animateOnce>
            <p className="card__title">TRUSTED BY:</p>
          </ScrollAnimation>
          <div className="row-logo row-logo--1">
            <ScrollAnimation animateIn="flipInX" delay="30" animateOnce>
              <img src={Logo1} alt="subto" />
            </ScrollAnimation>
            <ScrollAnimation animateIn="flipInX" delay="90" animateOnce>
              <img src={Logo2} alt="wholesaling" />
            </ScrollAnimation>
          </div>
          <div className="row-logo row-logo--2">
            <ScrollAnimation animateIn="flipInX" delay="60" animateOnce>
              <img src={Logo3} alt="keyglee" />
            </ScrollAnimation>
            <ScrollAnimation animateIn="flipInX" delay="120" animateOnce>
              <img src={Logo4} alt="ttp" />
            </ScrollAnimation>
          </div>
          <div className="row-logo row-logo--3">
            <ScrollAnimation animateIn="flipInX" delay="30" animateOnce>
              <img src={Logo5} alt="real estate" />
            </ScrollAnimation>
            <ScrollAnimation animateIn="flipInX" delay="90" animateOnce>
              <img src={Logo6} alt="batchleads" />
            </ScrollAnimation>
          </div>
        </div>
      </div>
    </ScrollAnimation>
  </section>
)
