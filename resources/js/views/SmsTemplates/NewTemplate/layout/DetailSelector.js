import React from 'react'
import ErrorMessage from '~components/ErrorMessage'

export default ({ onClick, error }) => {
  return (
    <div className="sms-detail-selector-container">
      <div
        className="sms-detail-selector"
        onClick={onClick}
        onKeyPress={() => {}}
        role="button"
        tabIndex="0"
      >
        <div className="btn-add--round" />
        <div className="sms-detail-selector-label">
          Add Message
        </div>
      </div>
      <ErrorMessage message={error && `*${error}`} />
    </div>
  )
}
