import React from 'react'
import Link from 'react-router-dom/Link'
import Facebook from '~assets/icons/facebook.svg'
import Instagram from '~assets/icons/instagram.svg'
import './style.scss'

export default () => (
  <section className="footer-section">
    <p>@BatchDriven 2020. All rights reserved.</p>
    <p className="footer-menu-container">
      <div className="footer-menu-links">
        <div className="footer-menu-item">
          <Link to="/tos">Terms of Service</Link>
        </div>
        <div className="footer-menu-item">
          |
        </div>
        <div className="footer-menu-item">
          <Link to="/privacy">Private Policy</Link>
        </div>
        <div className="footer-menu-item">
          |
        </div>
        <div className="footer-menu-item">
          <Link to="/personal">Personal Information</Link>
        </div>
      </div>
      <p className="footer-social-links">
        <a href="https://www.facebook.com/BatchDriven" rel="noopner noreferrer" target="_new" className="social-btn facebook">
          <img src={Facebook} alt="Facebook" />
        </a>
        <a href="https://www.instagram.com/batchdrivenapp/" rel="noopner noreferrer" target="_new" className="social-btn facebook">
          <img src={Instagram} alt="Instagram" />
        </a>
      </p>
    </p>
  </section>
)
