import React from 'react'
import './style.scss'

export default ({
  onClick, email, loading,
}) => {
  return (
    <div className="verify-needed-banner-container">
      <div>
        Please, verify your email address
        &nbsp;
        <b>{email}</b>
        .&nbsp;
        Didn&apos;t receive email?&nbsp;&nbsp;
      </div>
      {
        loading ? <div className="resend-now-button">Sending...</div> : <div className="resend-now-button" onClick={onClick}>Resend now</div>
      }
    </div>
  )
}
