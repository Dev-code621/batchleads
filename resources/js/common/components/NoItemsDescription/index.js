/* eslint-disable react/no-danger */
import React from 'react'
import './style.scss'

export default ({
  description,
  children,
}) => (
  <div className="no-items-container">
    <div className="no-items-description" dangerouslySetInnerHTML={{ __html: description }} />
    {children}
  </div>
)
