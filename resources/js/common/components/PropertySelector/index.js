import React from 'react'
import ErrorMessage from '../ErrorMessage'
import './style.scss'

export default ({ onClick, count, error }) => {
  const propertyCountLabel = count === 1 ? 'Property' : 'Properties'

  return (
    <div className="property-selector-container">
      <div
        className="property-selector"
        onClick={onClick}
        onKeyPress={() => {}}
        role="button"
        tabIndex="0"
      >
        <div className="btn-add--round" />
        <div className="property-selector-label">
          {
            count === 0 ? 'Select Properties' : `${count} ${propertyCountLabel}`
          }
        </div>
      </div>
      <ErrorMessage message={error} />
    </div>
  )
}
