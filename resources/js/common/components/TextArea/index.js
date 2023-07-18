import React from 'react'
import './style.scss'

export default ({
  label,
  secondLabel = '',
  placeholder,
  className,
  width,
  onChange,
  value,
  error,
  readOnly,
  fontSize,
}) => (
  <div className="text-area-component" style={{ width }}>
    {
      label
        && (
        <div className="label">
          <div>{label}</div>
          <div>{secondLabel}</div>
        </div>
        )
    }
    <textarea placeholder={placeholder} className={className} style={{ fontSize: `${fontSize}` }} onChange={onChange} value={value} readOnly={readOnly} />
    {
      error && (
      <div className="error">
        *
        {error}
      </div>
      )
    }
  </div>
);
