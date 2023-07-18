import React from 'react'
import LoadingActivity from '~components/LoadingActivity'
import {
  formatDateString1,
} from '~common/helper'

export default ({ message, isReceive }) => {
  const messageTxt = message.message
  const updatedAt = message.updated_at
  const isSending = message.loading
  const className = isReceive ? 'received-message' : 'sent-message'

  return (
    <div className="message-history-item">
      <div className={`message ${className}`}>
        <div className="message-text">{messageTxt}</div>
        <div className="message-date-time-info">{formatDateString1(updatedAt)}</div>
        {
          isSending && <LoadingActivity type="ThreeDots" />
        }
      </div>
    </div>
  )
}
