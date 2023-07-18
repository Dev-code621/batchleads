import React from 'react'
import { Link } from 'react-router-dom'
import Banner from '~assets/images/banner.png'

import './style.scss'

const containerStyle = {
  backgroundImage: `url(${Banner})`,
};

export default () => (
  <div className="top-footer-container" style={containerStyle}>
    <div className="normal-description-container">
      <div className="description">Start Your 7 Days FREE TRIAL of Go </div>
      <div className="description">Knock and land your next deal on us!</div>
    </div>
    <div className="mobile-description-container">
      <div className="description">Start Your 7 Days FREE TRIAL of BatchDriven and land your next deal on us!</div>
    </div>
    <div className="button-container">
      <Link to="/signup">
        <input type="button" className="start-button" value="SART YOUR 7-DAY FREE TRIAL" />
      </Link>
    </div>
  </div>
);
