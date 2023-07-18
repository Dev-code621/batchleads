import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { FaPlusCircle } from 'react-icons/fa'
import { folderSelector } from '~redux/selectors/folderSelector'
import { actions as folderActions } from '~redux/modules/folder'
import SelectItem from '~components/CollapsibleSelector/SelectItem'

const mapStateToProps = (state) => ({
  folders: folderSelector(state),
})

const mapDispatchToProps = {
  ...folderActions,
}

const FolderSelector = ({
  selectedFolder, onSelect, getFolders, folders, createFolder,
}) => {
  useEffect(() => {
    getFolders()
  }, [])

  const onCreateFolder = () => {
    const folderName = prompt('Folder Name')
    if (folderName) {
      createFolder(folderName)
    }
  }

  return (
    <React.Fragment>
      {folders && folders.map((folder) => {
        const { name, id } = folder

        return (
          <SelectItem
            item={name}
            selected={selectedFolder && id === selectedFolder.id}
            onSelect={() => onSelect(folder)}
            key={id}
          />
        )
      })}
      <div
        className="add-folder-container"
        onClick={onCreateFolder}
        onKeyPress={() => {}}
        role="button"
        tabIndex="0"
      >
        <FaPlusCircle />
        <div>Add New Folder</div>
      </div>
    </React.Fragment>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(FolderSelector)
