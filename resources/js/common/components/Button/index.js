import React from 'react'
import './style.scss'

export default ({
  label,
  onClick,
  width,
  height,
  color = 'blue',
  style,
  disabled = false,
  icon,
  id,
}) => {
  const className = `btn btn-${color} btn-${icon}`
  return (
    <input
      id={id}
      type="button"
      value={label}
      className={className}
      onClick={onClick}
      style={{
        width, height, ...style,
      }}
      disabled={disabled}
    />
  )
}
