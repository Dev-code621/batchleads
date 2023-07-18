import React from 'react'
import {
  formatDateString2,
  formatPhoneNumber,
} from '~common/helper'

export default ({
  message,
  onClickItem,
  onDelete,
}) => {
  const onClickMessage = (event) => {
    if (event.target.className === 'btn-remove') {
      return
    }
    onClickItem()
  }

  const phoneNumber = message.phone_number
  const updatedAt = message.updated_at
  const latestMessage = message.latest_message
  const badgeNumber = message.badge_number

  return (
    <div
      className="message-box-info list-item"
      onClick={(event) => onClickMessage(event)}
      onKeyPress={() => {}}
      role="button"
      tabIndex="0"
    >
      <div className="list-item-title-container">
        <div className="list-item-title">{formatPhoneNumber(phoneNumber)}</div>
        <div className="date-time-info">{formatDateString2(updatedAt)}</div>
      </div>
      <div className="message-info description-item">
        <div className="latest-message">{latestMessage}</div>
        {
          badgeNumber !== 0 && <div className="badge">{badgeNumber}</div>
        }
        <div
          onClick={onDelete}
          className="btn-remove"
        />
      </div>
    </div>
  )
}
