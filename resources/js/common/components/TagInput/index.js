import React from 'react'
import './style.scss'

export default ({
  label, onClick,
}) => {
  return (
    <div className="input-tags-container">
      <div
        className="input-tag"
        onClick={onClick}
        onKeyPress={() => {}}
        role="button"
        tabIndex="0"
      >
        {label}
      </div>
    </div>
  )
}
