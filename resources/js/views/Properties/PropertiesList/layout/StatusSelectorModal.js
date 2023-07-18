import React, { useState } from 'react'

import BaseModal from '~components/BaseModal'
import Button from '~components/Button';
import { propertyStatus, statusColor } from '~common/constants'
import STATUS_ICON from '~assets/icons/status_icon'
import SelectItem from '~components/CollapsibleSelector/SelectItem'

export default ({
  toggle, onClose, onSelectStatus,
}) => {
  if (!toggle) return null
  const [status, setStatus] = useState(null);

  const footer = (
    <div className="footer-wrapper" style={{ justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
      <Button
        disabled={!status}
        onClick={() => onSelectStatus(status)}
        label="Apply Status"
        style={{ width: 247, height: 40 }}
      />
      <div style={{ cursor: 'pointer', marginTop: 14, color: 'gray' }} onClick={onClose}>Cancel</div>
    </div>
  )
  const renderStatusIcon = (item) => {
    const statusWrapperStyle = {
      backgroundColor: statusColor[item],
    }
    return (
      <div className="icon-container" style={statusWrapperStyle}>
        <img className="status-icon" src={STATUS_ICON[item]} alt="status" />
      </div>
    )
  }

  return (
    <BaseModal
      toggle={toggle}
      onClose={onClose}
      title="Update Status"
      footer={footer}
    >
      <div className="status-update-modal-body">
        <div
          className="status-update-modal-content"
        >
          {propertyStatus.map((item) => (
            <SelectItem
              item={item}
              selected={item === status}
              onSelect={setStatus}
              key={item}
              icon={renderStatusIcon(item)}
            />
          ))}
        </div>
      </div>
    </BaseModal>
  )
}
