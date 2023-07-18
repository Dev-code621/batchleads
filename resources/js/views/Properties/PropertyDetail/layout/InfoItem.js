import React, { Fragment } from 'react'
import ReactTooltip from 'react-tooltip'
import Copy from '~assets/images/copy.svg'

export default ({
  title, value,
  type, onClick,
  className,
  icon, onIconClick,
}) => {
  const isContact = type === 'email' || type === 'phone'
  const iconClick = (e) => {
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()
    onIconClick(icon, value)
  }
  return (
    <div
      className={`property-info-wrapper ${className}`}
      onClick={onClick}
      onKeyPress={() => { }}
      role="button"
      tabIndex="0"
    >
      <div className={`title-label ${isContact && 'contact'}`}>{title}</div>
      <div className={`value-label ${isContact && 'contact'}`}>{value}</div>
      { icon && value && icon === 'copy'
        && (
          <Fragment>
            <ReactTooltip html className="tool-tip" id={title} place="right" />
            <div
              className="icon"
              onClick={(e) => iconClick(e)}
              onHov
              data-tip={`<div>${icon}</div>`}
              data-for={title}
              onHover
            >
              <img src={Copy} alt={icon} />
            </div>
          </Fragment>
        )
      }
    </div>
  )
}
