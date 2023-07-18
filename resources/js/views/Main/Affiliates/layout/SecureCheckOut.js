import React from 'react'
import KeyIcon from '~assets/icons/key.svg'
import './SecureCheckOut.style.scss'

export default () => (
  <div className="secure-check-out-container">
    <img src={KeyIcon} alt="key-icon" />
    <div>
        Secure
      <br />
        checkout
    </div>
  </div>
)
