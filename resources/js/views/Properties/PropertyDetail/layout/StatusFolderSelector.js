import React, { useState } from 'react'

import ContainerRow from '~common/components/ContainerRow'
import PropertyStatusSelector from '~components/CollapsibleSelector/PropertyStatusSelector'
import FolderSelector from '~components/CollapsibleSelector/FolderSelector'
import ErrorMessage from '~common/components/ErrorMessage'

export default ({
  status, setStatus,
  folder, errorFolder, setErrorFolder, setFolder,
}) => {
  const [statusOpen, setStatusOpen] = useState(false)
  const [folderOpen, setFolderOpen] = useState(false)
  return (
    <ContainerRow className="status-folder-container">
      <ContainerRow title="Status" className={`status-container ${folderOpen ? 'hide' : 'show'}`}>
        <PropertyStatusSelector
          onSelect={(sItem) => setStatus(sItem)}
          selectedStatus={status}
          onToggle={setStatusOpen}
        />
      </ContainerRow>
      <ContainerRow title="Folder" className={`folder-container ${statusOpen ? 'hide' : 'show'}`}>
        <FolderSelector
          selectedFolder={folder || {}}
          showAddOption
          onSelect={(fItem) => {
            setErrorFolder('')
            setFolder(fItem)
          }}
          onToggle={setFolderOpen}
        />
        <ErrorMessage message={errorFolder && errorFolder} />
      </ContainerRow>
    </ContainerRow>
  )
}
