import React from 'react'
import moment from 'moment'
import { FaUser } from 'react-icons/fa'

export default ({ item, currentUser }) => {
  const {
    description, type, user: itemUser, created_at: createdAt,
  } = item
  const user = itemUser || currentUser

  const userName = currentUser.id === user.id ? 'You' : itemUser.name;
  return (
    <div className="message-history-item">
      {user && (
        <div className="avatar">
          {user.photo_url && <img src={user.photo_url} alt="avatar" />}
          {!user.photo_url && <FaUser name="account" size={20} />}
        </div>
      )}
      <div className="content-container">
        <div className="title">
          <div className="description">{`${user ? userName : ''} ${type === 'note' ? 'added note.' : description}`}</div>
        </div>
        {type === 'note' && (
          <div className="note">{`"${description}"`}</div>
        )}
        <div className="date">
          {moment
            .utc(createdAt)
            .local()
            .format('M/DD/YYYY H:mm a')}
        </div>
      </div>
    </div>
  )
}
