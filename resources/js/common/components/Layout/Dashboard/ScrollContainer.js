import React from 'react'
import './ScrollContainer.style.scss'

export default ({ children, className, id }) => (
  <div className={`form-scroll-container ${className}`} id={id || 'form-scroll-container'}>
    {
      children
    }
  </div>
)
