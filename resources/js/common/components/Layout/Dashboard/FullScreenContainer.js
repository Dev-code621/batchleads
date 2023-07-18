import React from 'react'
import './FullScreenContainer.style.scss'

export default ({ children, className }) => (
  <div className={`full-screen-container ${className}`}>
    {
      children
    }
  </div>
)
