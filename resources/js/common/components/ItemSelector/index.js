import React from 'react'
import './style.scss'

export default ({
  selected, onSelect, parent,
}) => (
  <div
    className={`select-box ${selected ? 'checked' : ''} select-box--${parent}`}
    onClick={onSelect}
    onKeyPress={() => {}}
    role="button"
    tabIndex="0"
  />
)
