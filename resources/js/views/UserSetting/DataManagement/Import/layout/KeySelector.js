import React, { useState, useEffect } from 'react'
import Collapsible from '~components/Collapsable'
import SelectItem from '~components/CollapsibleSelector/SelectItem'

const KeySelector = ({
  selectedKey,
  onSelect,
  keys,
  onToggle,
}) => {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (onToggle) {
      setTimeout(() => {
        onToggle(open)
      }, open ? 0 : 500)
    }
  }, [open])

  const onSelectItem = (item) => {
    onSelect(item);
    setOpen(false);
  }

  return (
    <Collapsible trigger={selectedKey} open={open} setOpenStatus={(flag) => setOpen(flag)}>
      {keys && keys.map((key) => {
        return (
          <SelectItem
            item={key}
            selected={selectedKey === key}
            onSelect={() => onSelectItem(key)}
            key={key}
          />
        )
      })}
    </Collapsible>
  )
}

export default KeySelector
