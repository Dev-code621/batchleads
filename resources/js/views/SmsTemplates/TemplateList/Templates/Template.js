import React from 'react'
import ItemSelector from '~components/ItemSelector'

export default ({
  template, isSelect, onSelect, selected, onClickItem,
}) => {
  const onClickTemplate = (event) => {
    if (event.target.className.startsWith('select-box')) {
      return
    }
    onClickItem()
  }

  const name = template.get('name')
  const templateDetails = template.get('template_details')

  return (
    <div
      className="template-info list-item"
      onClick={(event) => onClickTemplate(event)}
      onKeyPress={() => {}}
      role="button"
      tabIndex="0"
    >
      <div className="list-item-title-container">
        <div className="list-item-title">{name}</div>
        {
          !isSelect && <div className="description-item">{`Details: ${templateDetails.size}`}</div>
        }
        {
          isSelect && (
            <ItemSelector selected={selected} onSelect={onSelect} size={30} />
          )
        }
      </div>
    </div>
  )
}
