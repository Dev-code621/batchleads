import React from 'react'

export default ({
  signature, onClickItem,
}) => {
  const onClickSignature = () => {
    onClickItem()
  }

  const temp = signature.toJS()
  const { label } = temp

  return (
    <div
      className="signature-info list-item"
      onClick={(event) => onClickSignature(event)}
      onKeyPress={() => {}}
      role="button"
      tabIndex="0"
    >
      <div className="list-item-title-container">
        <div className="list-item-title">{label}</div>
      </div>
    </div>
  )
}
