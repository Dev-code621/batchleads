import React from 'react'
import ItemSelector from '~components/ItemSelector'

export default (props) => {
  const {
    text, checked, onChange, itemId,
  } = props

  return (
    <div className="list-item">
      <div className="list-item-title-container">
        <div className="list-item-title">{text}</div>
        <ItemSelector
          selected={checked}
          onSelect={() => onChange(itemId, !checked)}
        />
      </div>
    </div>
  )
}
