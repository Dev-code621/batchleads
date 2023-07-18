import React from 'react'
import ScrollAnimation from 'react-animate-on-scroll'
import { Link } from 'react-router-dom';

import './style.scss'


export default () => (
  <section className="feature-section">
    <div className="container" id="features">

      <div className="slogan-container">
        <ScrollAnimation animateIn="shakeX" animateOnce>
          <p>Start Now</p>
        </ScrollAnimation>
      </div>
      <h3>
        Turn Your Phone Into The Ultimate Real Estate Investing Tool
      </h3>
      <ScrollAnimation animateIn="bounceInLeft" animateOnce>
        <div className="card card--driving">
          <h4 className="card__title">
            Driving Routes/Tracking
          </h4>
          <ul>
            <li>Plot properties on a map and find the quickest route</li>
            <li>Track Your Routes and Notes as you drive</li>
            <li>Never drive the same route twice</li>
          </ul>
          <Link to="/signup" className="card__arrow" />
        </div>
      </ScrollAnimation>

      <ScrollAnimation animateIn="bounceInLeft" animateOnce>
        <div className="card card--team">
          <h4 className="card__title">
            Team Management
          </h4>
          <ul>
            <li>Create Tasks & Timelines</li>
            <li>Improve communication and productivity</li>
            <li>Easily stay on top of everything with KPI Reports</li>
          </ul>
          <Link to="/signup" className="card__arrow" />
        </div>
      </ScrollAnimation>

      <ScrollAnimation animateIn="bounceInLeft" animateOnce>
        <div className="card card--lookup">
          <h4 className="card__title">
            Unlimited Owner Lookups
          </h4>
          <ul>
            <li> See owner details, get mortgage info, estimate property value & equity</li>
            <li>Determine your prospect’s financial “wiggle room” in negotiations</li>
            <li>Instantly search for any property in the app or select it on an interactive map</li>
          </ul>
          <Link to="/signup" className="card__arrow" />
        </div>
      </ScrollAnimation>

      <ScrollAnimation animateIn="bounceInLeft" animateOnce>
        <div className="card card--data_list">
          <h4 className="card__title">
            Data Lists
          </h4>
          <ul>
            <li>Search 150+ million off-market properties </li>
            <li>Find Vacants, Pre-foreclosures, Tax Defaults, High Equity and More</li>
            <li>Search for Properties Via Custom Region, Zip Code, City, County</li>
          </ul>
          <Link to="/signup" className="card__arrow" />
        </div>
      </ScrollAnimation>

      <ScrollAnimation animateIn="bounceInLeft" animateOnce>
        <div className="card card--skip_tracing">
          <h4 className="card__title">
            Built in Skip Tracing
          </h4>
          <ul>
            <li>Instant access to homeowner contact information</li>
            <li>Includes names, mailing addresses, phone numbers and more</li>
            <li>Highly accurate data, and no minimums or maximums required</li>
          </ul>
          <Link to="/signup" className="card__arrow" />
        </div>
      </ScrollAnimation>

      <ScrollAnimation animateIn="bounceInLeft" animateOnce>
        <div className="card card--sms_campaign">
          <h4 className="card__title">
            SMS Campaigns
          </h4>
          <ul>
            <li>Contact Owners & Set Appointments within the app via SMS</li>
            <li>Create Customized Text Templates & Automated Sequences</li>
          </ul>
          <Link to="/signup" className="card__arrow" />
        </div>
      </ScrollAnimation>

      <ScrollAnimation animateIn="bounceInLeft" animateOnce>
        <div className="card card--mail_campaign">
          <h4 className="card__title">
            Direct Mail Campaigns
          </h4>
          <ul>
            <li>Send postcards via Direct Mail within the app</li>
            <li>Choose from templates or customize your own mail piece.</li>
            <li>No minimum mail amount required</li>
          </ul>
          <Link to="/signup" className="card__arrow" />
        </div>
      </ScrollAnimation>

      <ScrollAnimation animateIn="bounceInLeft" animateOnce>
        <div className="card card--lead_management">
          <h4 className="card__title">
            Lead Management
          </h4>
          <ul>
            <li>Organize properties into segmented lists</li>
            <li>Keep track of your follow up sequences and always know your next move</li>
            <li>Zapier Integrations Available</li>
          </ul>
          <Link to="/signup" className="card__arrow" />
        </div>
      </ScrollAnimation>

      <ScrollAnimation animateIn="bounceInLeft" animateOnce>
        <div className="card card--bulk_upload">
          <h4 className="card__title">
            Bulk Upload
          </h4>
          <ul>
            <li>Import data from external spreadsheets</li>
          </ul>
          <Link to="/signup" className="card__arrow" />
        </div>
      </ScrollAnimation>

    </div>
    <span className="back-decoration back-decoration--dots1" />
    <span className="back-decoration back-decoration--dots2" />
    <span className="back-decoration back-decoration--cloud1" />
    <span className="back-decoration back-decoration--cloud2" />
  </section>
);
