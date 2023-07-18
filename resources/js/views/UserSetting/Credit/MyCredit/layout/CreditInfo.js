import React from 'react'
import BookIcon from '~assets/icons/book.svg'

export default ({ balance }) => {
  return (
    <div className="list-item">
      <div className="list-item-title-container">
        <img src={BookIcon} alt="book-icon" />
      </div>
      <div className="balance-info">
        {`${balance || 0}`}
        <span>Credits</span>
      </div>
    </div>
  )
}
