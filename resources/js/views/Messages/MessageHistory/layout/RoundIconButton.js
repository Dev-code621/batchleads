import React from 'react'

export default ({ onClick, className, children }) => {
  return (
    <div
      className={`round-icon-button ${className}`}
      onKeyPress={() => {}}
      role="button"
      tabIndex="0"
      onClick={onClick}
    >
      {children}
    </div>
  )
}
