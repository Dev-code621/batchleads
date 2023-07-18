import React from 'react'
import './style.scss'

export default ({ onClick, selected, tag }) => {
  return (
    <div onClick={() => onClick(tag.id)} className={`property-tag-item-container${selected ? ' selected' : ''}`}>
      <div className="tag-text">{tag.name}</div>
    </div>
  )
}
