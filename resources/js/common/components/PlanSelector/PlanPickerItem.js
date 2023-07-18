import React from 'react'
import classNames from 'classnames'

export default ({
  active, text, onClick,
}) => (
  <div
    onClick={onClick}
    className={classNames('plan-picker-item-container')}
    onKeyPress={() => {}}
    role="button"
    tabIndex="0"
  >
    <div
      className={active ? 'plan-picker-item active' : 'plan-picker-item'}
    >
      <div className="plan-title">
        {text}
      </div>
    </div>
  </div>
)
