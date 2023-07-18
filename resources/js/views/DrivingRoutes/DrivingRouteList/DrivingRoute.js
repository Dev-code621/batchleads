import React from 'react'
import moment from 'moment'
import { elapsedTime } from '~common/helper'
import './layout/style.scss'

import PersonSVG from '~assets/street_person.svg'

export default ({
  start_address: startAddress,
  created_at: createdAt,
  total_hours: totalHours,
  user,
  route_type: routeType,
  property_count: propertyCount,
  onClick,
  selected,
  onDelete,
}) => {
  return (
    <div
      className={`route-info-item list-item ${selected && 'list-item-active'}`}
      onClick={onClick}
      onKeyPress={() => {}}
      role="button"
      tabIndex="0"
    >
      {routeType === 'Virtual' && (
        <div className="virtual-route-marker">
          <img src={PersonSVG} alt="Virtual Route" />
        </div>
      )}
      <div className="list-item-title-container">
        <div className="list-item-title">{startAddress}</div>
        <div
          onClick={onDelete}
          className="btn-remove"
        />
      </div>
      <div className="bottom-container description-item">
        <div className="route-user">
          <div className="user-name">{user ? user.name : ''}</div>
        </div>
        <div className="route-property">
          <div className="property-count">{propertyCount}</div>
        </div>
        <div className="route-time-container">
          <div className="route-date">
            {moment(createdAt).format('DD MMM')}
          </div>
          ,&nbsp;
          <div className="route-hours">{`${elapsedTime(totalHours * 1000)}`}</div>
        </div>

      </div>
    </div>
  )
}
