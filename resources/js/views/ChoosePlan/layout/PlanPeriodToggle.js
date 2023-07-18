import React from 'react';
import classNames from 'classnames';

export default ({
  active, onClickMonth, onClickYear,
}) => (
  <div
    className={classNames('plan-period-toggle')}
  >
    <div className={active === 'month' ? 'btn-period active' : 'btn-period'} onClick={onClickMonth}>MONTH</div>
    <div className={active === 'year' ? 'btn-period active' : 'btn-period'} onClick={onClickYear}>YEAR</div>
  </div>
);
