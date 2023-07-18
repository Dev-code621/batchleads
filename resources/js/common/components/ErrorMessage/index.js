import React from 'react'
import './style.scss'

export default ({ message }) => {
  return (
    <div className="error-message-container">
      {
        message
      }
    </div>
  )
}
