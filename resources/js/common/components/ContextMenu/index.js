import React, { useState } from 'react'
import './style.scss'

export default ({
  children, onClickItem, items, itemsClassName = '', itemClassName = '', itemIcon,
}) => {
  const [show, setShow] = useState(false)
  const hideContextMenu = (e) => {
    setShow(false)
    document.removeEventListener('click', hideContextMenu);
  }

  const showContextMenu = () => {
    if (!show) {
      document.addEventListener('click', hideContextMenu);
    }
    setShow(!show)
  }

  return (
    <div className="context-menu-container">
      <div
        className="context-menu-trigger"
        onKeyPress={() => {}}
        role="button"
        tabIndex="0"
        onClick={showContextMenu}
      >
        {
          children
        }
      </div>
      {
        show && (
        <div className={`context-menu-items ${itemsClassName}`}>
          {
              items.map((item) => (
                <div className="context-menu-item">
                  {itemIcon && <img src={itemIcon} alt="item" />}
                  <div className={`context-menu-item-label ${itemClassName}`} onClick={() => onClickItem(item)} key={item.value}>
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
    </div>
  )
}
