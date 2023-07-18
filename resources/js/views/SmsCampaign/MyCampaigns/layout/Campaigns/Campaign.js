import React from 'react'
import moment from 'moment'

import CampaignStatus from '~components/CampaignStatus'

export default ({ campaign, onClickItem }) => {
  const {
    title,
    property_count: propertyCount,
    start_date: startDate,
    template_master: templateMaster,
    finished,
  } = campaign

  return (
    <div
      className="campaign-info list-item"
      onClick={() => onClickItem(campaign)}
      onKeyPress={() => {}}
      role="button"
      tabIndex="0"
    >
      <div className="list-item-title-container">
        <div className="list-item-title">{title}</div>
        <CampaignStatus status={finished} />
      </div>
      <div className="bottom-container description-item">
        <div className="campaign-template">
          <span>Template:</span>
          &nbsp;
          {templateMaster.name}
        </div>
        <div className="campaign-properties">
          <span>Properties:</span>
          &nbsp;
          {propertyCount}
        </div>
        <div className="campaign-date">
          {moment(startDate).format('DD MMM, YYYY')}
        </div>
      </div>
    </div>
  )
}
