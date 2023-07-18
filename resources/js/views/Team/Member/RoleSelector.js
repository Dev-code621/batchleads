import React, { useState } from 'react'
import Collapsible from '~components/Collapsable'
import SelectItem from '~components/CollapsibleSelector/SelectItem'

const roles = [
  'admin',
  'member',
]

export default ({ selectedRole, onSelect }) => {
  const [selectRole, setSelectRole] = useState(selectedRole)
  const onSelectRole = (item) => {
    setSelectRole(item)
    onSelect(item)
  }

  return (
    <Collapsible trigger={selectedRole}>
      {roles.map((role) => (
        <SelectItem
          item={role}
          selected={role === selectRole}
          onSelect={() => onSelectRole(role)}
          key={role}
        />
      ))}
    </Collapsible>
  )
}
