import React, { useState, useEffect } from 'react'
import Collapsible from 'react-collapsible'
import { MdKeyboardArrowRight, MdKeyboardArrowDown } from 'react-icons/md'
import './style.scss'

const getTrigger = (trigger, collapsed, icon) => {
  return (
    <div className="collapsable-trigger-container">
      <div className="trigger-title">
        {icon}
        <div>{trigger}</div>
      </div>
      {
        collapsed ? <MdKeyboardArrowRight /> : <MdKeyboardArrowDown />
      }
    </div>
  )
}

export default ({
  children, trigger, open, setOpenStatus, statusIcon,
}) => {
  const [collapsed, setCollapsed] = useState(open)

  useEffect(() => {
    setCollapsed(open)
  }, [open])

  return (
    <Collapsible
      trigger={getTrigger(trigger, !open, statusIcon)}
      className="collapsable-container"
      openedClassName="collapsable-container"
      onOpening={() => setOpenStatus(true)}
      onClosing={() => setOpenStatus(false)}
      open={collapsed}
    >
      {
        children
      }
    </Collapsible>
  )
}
