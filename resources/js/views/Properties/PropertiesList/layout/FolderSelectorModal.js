import React, { useState } from 'react'

import BaseModal from '~components/BaseModal'
import Button from '~components/Button';
import FolderSelector from '~components/CollapsibleSelector/FolderSelector'

export default ({
  toggle, onClose, onSelectStatus,
}) => {
  if (!toggle) return null
  const [folder, setFolder] = useState({})

  const footer = (
    <div className="footer-wrapper" style={{ justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
      <Button
        disabled={!folder.id}
        onClick={() => onSelectStatus(folder.id)}
        label="Apply Folder"
        style={{ width: 247, height: 40 }}
      />
      <div style={{ cursor: 'pointer', marginTop: 14, color: 'gray' }} onClick={onClose}>Cancel</div>
    </div>
  )

  return (
    <BaseModal
      toggle={toggle}
      onClose={onClose}
      title="Update Folder"
      footer={footer}
    >
      <div className="status-update-modal-body folder-modal">
        <div
          className="status-update-modal-content"
        >
          <FolderSelector
            onSelect={(item) => setFolder(item)}
            selectedFolder={folder || {}}
            disableCollapsible
          />
        </div>
      </div>
    </BaseModal>
  )
}
