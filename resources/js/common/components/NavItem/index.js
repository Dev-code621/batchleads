import React from 'react'
import { MdChevronRight } from 'react-icons/md'
import './style.scss'

export default ({
  title, description, showNavIcon = true, onClick,
}) => (
  <div
    className="nav-item-container"
    onClick={onClick}
    onKeyPress={() => {}}
    role="button"
    tabIndex="0"
  >
    <div className="nav-item-left">
      <div className="nav-item-title">{title}</div>
      <div className="nav-item-description">{description}</div>
    </div>
    <div className="nav-item-right">
      {
        showNavIcon && <MdChevronRight />
      }
    </div>
  </div>
)
