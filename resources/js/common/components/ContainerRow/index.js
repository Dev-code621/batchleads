import React from 'react'
import './style.scss'

export default ({
  children, title, className, onClick,
}) => {
  return (
    <div
      className={`content-row ${className}`}
      onClick={onClick}
      onKeyPress={() => {}}
      role="button"
      tabIndex="0"
    >
      {title && <div className="content-title">{title}</div>}
      {
        children
      }
    </div>
  )
}
