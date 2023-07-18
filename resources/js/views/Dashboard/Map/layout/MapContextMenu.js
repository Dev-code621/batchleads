import React from 'react'
import './style.scss'

export default ({
  onClickItem, items, itemsClassName = '',
}) => {
  const itemClicked = (event, item) => {
    onClickItem(event, item)
  }
  return (
    <div className={`context-menu-items ${itemsClassName}`}>
      {
        items.map((item) => (
          <div className="context-menu-item" key={item.value} onClick={(event) => itemClicked(event, item)}>
            {item.icon && <img src={item.icon} alt="item" />}
            <div className={`context-menu-item-label ${item.className}`}>
              {
                item.label
              }
            </div>
          </div>
        ))
      }
    </div>
  )
}
