import React from 'react'

import Input from '~components/Input'
import Mail from '~assets/icons/mail.png'

export default () => (
  <div className="newsletter">
    <div className="newsletter-title">Sign up for our newsletter</div>
    <div className="newsletter-description">
      Leave your email and we will sending next fresh publics right into your Email
    </div>
    <Input type="email" placeholder="Your Email" icon={Mail} className="email-input" width="100%" />
    <div className="subscribe-button-container">
      <input type="button" value="SUBSCRIBE" className="subscribe-button" />
    </div>
  </div>
);
