import React, { useState } from 'react'
import ItemSelector from '~components/ItemSelector'

export default (props) => {
  const {
    name, description, enabled, onChange,
  } = props

  const [status, setStatus] = useState(enabled)
  const onChangeSetting = () => {
    setStatus(!status)
    onChange()
  }

  return (
    <div className="list-item">
      <div className="list-item-title-container">
        <div className="list-item-title">{name}</div>
        <ItemSelector
          selected={status}
          onSelect={onChangeSetting}
        />
      </div>
      <div className="bottom-container description-item">
        {
          description
        }
      </div>
    </div>
  )
}
