import React from 'react'
import ScrollAnimation from 'react-animate-on-scroll'

import './style.scss'


export default () => (
  <section className="compare-section" id="whatsnew">
    <div className="container">
      <ScrollAnimation animateIn="bounceInLeft" animateOnce>
        <div className="card card--old_way">
          <h4 className="card__title">The Old Way</h4>
          <ul>
            <li>Compete With Thousands Of Other Investors For The Same Deal</li>
            <li>Spend Thousands on Marketing</li>
            <li>Never Know What your Team Is Actually Doing?</li>
          </ul>
        </div>
      </ScrollAnimation>
      <ScrollAnimation animateIn="bounceInRight" animateOnce>
        <div className="card card--new_way">
          <h4 className="card__title">The New Way</h4>
          <ul>
            <li>Find Off-Market Deals With Little-To-No Competition</li>
            <li>Reduce Costs & Boost Margins</li>
            <li>Track Your Team’s Driving Routes And What They’ve Accomplished</li>
          </ul>
        </div>
      </ScrollAnimation>
    </div>
  </section>
);
