import React, { useState } from 'react'
import classNames from 'classnames'
import './style.scss'

export default ({
  label,
  type,
  placeholder,
  icon,
  className,
  width,
  height,
  onChange,
  value,
  error,
  readOnly,
  noIcon,
  fontSize,
  onKeyDown,
  onFocus,
}) => {
  const [visibleText, setVisibleText] = useState(false)

  const togglePasswordText = () => {
    setVisibleText(!visibleText)
  }

  return (
    <div className={`input-component input-component--${type} ${label ? 'has-label' : ''} ${error ? 'has-error' : ''}`} style={{ width }}>
      {label && <div className="label">{label}</div>}
      {
        <input
          type={visibleText ? 'text' : type}
          placeholder={placeholder}
          className={classNames(className, noIcon && 'no-icon')}
          style={{ backgroundImage: `url(${icon})`, fontSize: `${fontSize}`, height }}
          onChange={onChange}
          value={value}
          readOnly={readOnly}
          onKeyDown={onKeyDown}
          onFocus={onFocus}
        />
      }
      {error && <div className="error">{ `*${error}`}</div>}
      {(type === 'password' && value) && (
        <div className={`${visibleText ? 'show-text show-text--visible' : 'show-text'}`} type="button" onClick={togglePasswordText} />
      )}
    </div>
  )
}
