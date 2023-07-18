import React, { useState } from 'react'

export default (props) => {
  const {
    name, price, enabled, onChange,
  } = props

  const [status, setStatus] = useState(enabled)
  const onChangeSetting = () => {
    onChange(!status)
    setStatus(!status)
  }

  return (
    <div
      className={`list-item list-item--addon ${status ? 'checked' : ''}`}
      onClick={onChangeSetting}
    >
      <div className={`list-item__checkbox ${status ? 'checked' : ''}`} />
      <div className="list-item__title">{name}</div>
      <div className="list-item__price">{price}</div>
    </div>
  )
}
