import React, { useState } from 'react'
import Collapsible from '~components/Collapsable'
import SelectItem from '../SelectItem'

const optionList = [
  { id: null, name: 'N/A' },
  { id: 'Y', name: 'Done' },
  { id: 'N', name: 'Not Done' },
]

export default ({
  selectedItem,
  onSelect,
}) => {
  const [open, setOpen] = useState(false);
  const onSelectItem = (item) => {
    onSelect(item);
    setOpen(false);
  }

  return (
    <Collapsible trigger={selectedItem.name} open={open} setOpenStatus={(flag) => setOpen(flag)}>
      {optionList.map((option) => (
        <SelectItem
          item={option.name}
          selected={option.id === selectedItem.id}
          onSelect={() => onSelectItem(option)}
          key={option.id}
        />
      ))}
    </Collapsible>
  )
}
