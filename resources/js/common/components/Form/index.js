import React from 'react'
import './style.scss'

export default ({ children, className = '' }) => {
  return (
    <div className={`form ${className}`}>
      {
        children
      }
    </div>
  )
}
