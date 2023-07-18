/* eslint-disable react/no-danger */
import React from 'react'
import ReactTooltip from 'react-tooltip'

export default ({ title, status, planPeriod = 'month' }) => (
  <div className="plan-details-item">
    <div>
      <div className="plan-details-item-description">{title}</div>
      <div className="plan-details-item-detail">
        {
          status.map((item) => {
            if (item === 'yes') {
              return <div className="plan-details-item-detail-cell"><span className="green-yes" /></div>
            }
            if (item === 'has' && planPeriod === 'month') {
              return (
                <div className="plan-details-item-detail-cell item">
                  <b>7 days</b>
                  &nbsp;Trial&nbsp;+ &nbsp;
                  <b>10</b>
                  &nbsp;Skip Traces
                </div>
              )
            }
            if (item === 'has' && planPeriod === 'year') {
              return (
                <div className="plan-details-item-detail-cell item">
                  <b>2 months</b>
                  &nbsp;Trial&nbsp;+ &nbsp;
                  <b>10</b>
                  &nbsp;Skip Traces
                </div>
              )
            }
            if (item === 'no') {
              return <div className="plan-details-item-detail-cell"><span className="gray-no" /></div>
            }
            if (item === 'up to 10 users') {
              return (
                <div className="plan-details-item-detail-cell has-tooltip">
                  {item}
                  <span data-tip="Additional users<br> billed at $15">?</span>
                  <ReactTooltip place="right" html backgroundColor="rgba(54,131,188,0.7)" />
                </div>
              )
            }
            return <div className="plan-details-item-detail-cell item" dangerouslySetInnerHTML={{ __html: item }} />;
          })
        }
      </div>
    </div>
  </div>
)
