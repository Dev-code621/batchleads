import React from 'react'

import Input from '~components/Input'
import Mail from '~assets/icons/mail.png'

export default () => (
  <div className="newsletter">
    <div className="newsletter-title">Sign up for our newsletter:</div>
    <div className="newsletter-description">
      <div>Leave your email and we will sending next fresh</div>
      <div>publics right into your Email</div>
    </div>
    <Input type="email" placeholder="Your Email" icon={Mail} width={354} className="email-input" />
    <div>
      <input type="button" value="SUBSCRIBE" className="subscribe-button" />
    </div>
  </div>
);
