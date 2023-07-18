import React from 'react'
import { FaRegCircle, FaDotCircle } from 'react-icons/fa'
import { MdKeyboardArrowRight } from 'react-icons/md'
import './style.scss'

export default ({
  item,
  selected,
  onSelect,
  icon,
  arrow,
  isNavigation,
}) => {
  const getRightIcon = () => {
    if (isNavigation) {
      return arrow ? <MdKeyboardArrowRight /> : null
    }

    return selected ? (
      <FaDotCircle className="property-status-selected" />
    ) : (
      <FaRegCircle />
    )
  }

  return (
    <div
      className="property-status-item"
      onClick={() => onSelect(item)}
      onKeyPress={() => {}}
      role="button"
      tabIndex="0"
    >
      <div className={selected ? 'property-status-title property-status-selected' : 'property-status-title'}>
        {icon}
        {item}
      </div>
      {
        getRightIcon()
      }
    </div>
  )
}
