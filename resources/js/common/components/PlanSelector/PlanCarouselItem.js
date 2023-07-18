import React from 'react'
// import ReactTooltip from 'react-tooltip';

export default ({
  plan, planDetails, activeIndex, planPeriod = 'month',
}) => (
  <div className="plan-carousel-item">
    <div className="plan-carousel-container">
      <div className="plan-carousel-header">
        <div className="plan-name">{plan.nickname}</div>
        <div className="plan-price">
          {`$ ${plan.amount / 100}`}
          <span>{plan.interval === 'year' ? 'per year' : 'per month'}</span>
        </div>
      </div>
      <div className="plan-details">
        {
          planDetails.map((detail) => (
            <div className="plan-detail-info" key={detail.title}>
              <div className="plan-detail-info__title">{detail.title}</div>
              {
                detail.status[activeIndex] === 'yes' && <span className="green-yes" />
              }
              {
                detail.status[activeIndex] === 'no' && <span className="gray-no" />
              }
              {
                detail.status[activeIndex] === 'has' && planPeriod === 'month' && (
                  <div className="plan-details-item-detail-cell item">
                    <b>7 days</b>
                    &nbsp;Trial&nbsp;+ &nbsp;
                    <b>10</b>
                    &nbsp;Skip Traces
                  </div>
                )
              }
              {
                detail.status[activeIndex] === 'has' && planPeriod === 'year' && (
                  <div className="plan-details-item-detail-cell item">
                    <b>2 months</b>
                    &nbsp;Trial&nbsp;+ &nbsp;
                    <b>10</b>
                    &nbsp;Skip Traces
                  </div>
                )
              }
              {
                detail.status[activeIndex] === 'up to 10 users' && (
                  <div className="plan-details-item-detail-cell has-tooltip">
                    {detail.status[activeIndex]}
                    <span data-tip="Additional users billed at $15">?</span>
                  </div>
                )
              }
              {
                ['has', 'no', 'yes', 'up to 10 users'].indexOf(detail.status[activeIndex]) === -1 && (
                  <div className="plan-details-item-detail-cell item">
                    {detail.status[activeIndex]}
                  </div>
                )
              }
            </div>
          ))
        }
      </div>
    </div>
  </div>
)
