/* eslint-disable react/no-danger */
import React from 'react'
import './Step.style.scss'

export default ({ icon, description, className }) => (
  <div className={`how-it-works-step-container ${className}`}>
    <img src={icon} alt="step" />
    <div className="description" dangerouslySetInnerHTML={{ __html: description }} />
  </div>
)
