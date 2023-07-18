import React from 'react'
import ContextMenu from '~components/ContextMenu'
import RoundIconButton from './RoundIconButton'

export default ({ onClickItem, items, itemIcon }) => {
  return (
    <ContextMenu
      items={items}
      itemsClassName="menu-wrapper"
      onClickItem={(item) => onClickItem(item)}
      itemIcon={itemIcon}
    >
      <RoundIconButton
        className="message-history-right-home"
      />
    </ContextMenu>
  )
}
