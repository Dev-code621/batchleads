import React, { useState, useEffect } from 'react'
import Collapsible from '~components/Collapsable'
import SelectItem from '../SelectItem'
import { propertyStatus, statusColor } from '~common/constants'
import STATUS_ICON from '~assets/icons/status_icon'

export default ({
  selectedStatus,
  onSelect,
  showAll,
  onToggle,
}) => {
  const [open, setOpen] = useState(false)
  const onSelectItem = (item) => {
    onSelect(item)
    setOpen(false)
  }
  useEffect(() => {
    if (onToggle) {
      setTimeout(() => {
        onToggle(open)
      }, open ? 0 : 500)
    }
  }, [open])

  const renderStatusIcon = (status) => {
    if (status === 'All Deals') {
      return null
    }
    const statusWrapperStyle = {
      backgroundColor: statusColor[status],
    }
    return (
      <div className="icon-container" style={statusWrapperStyle}>
        {status && <img className="status-icon" src={STATUS_ICON[status]} alt="status" />}
      </div>
    )
  }

  return (
    <Collapsible
      trigger={selectedStatus}
      statusIcon={renderStatusIcon(selectedStatus)}
      open={open}
      setOpenStatus={(flag) => setOpen(flag)}
    >
      {
        showAll && (
        <SelectItem
          item="All Deals"
          selected={selectedStatus === 'All Deals'}
          onSelect={onSelectItem}
        />
        )
      }
      {propertyStatus.map((status) => (
        <SelectItem
          item={status}
          selected={status === selectedStatus}
          onSelect={onSelectItem}
          key={status}
          icon={renderStatusIcon(status)}
        />
      ))}
    </Collapsible>
  )
}
