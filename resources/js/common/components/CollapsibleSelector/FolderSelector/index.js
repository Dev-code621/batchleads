import React, {
  useState, useEffect, Fragment, useRef,
} from 'react'
import { connect } from 'react-redux'

import { toast } from '~common/helper'
import Collapsible from '~components/Collapsable'
import SelectItem from '../SelectItem'
import { folderSelector, folderUpdateSelector, folderDeleteSelector } from '~redux/selectors/folderSelector'
import FolderRow from './FolderRow'
import Button from '~components/Button'
import { actions as folderActions } from '~redux/modules/folder'
import './style.scss'

const mapStateToProps = (state) => ({
  folders: folderSelector(state),
  updateResult: folderUpdateSelector(state),
  deleteResult: folderDeleteSelector(state),
})

const mapDispatchToProps = {
  ...folderActions,
}

const initialFolder = { id: null, name: 'Everything' }

const FolderSelector = ({
  selectedFolder,
  onSelect,
  showAll,
  getFolders,
  folders,
  createFolder,
  showAddOption,
  onToggle,
  updateResult,
  deleteResult,
  initFolderEdit,
  disableCollapsible = false,
  title,
  toggle,
  showCount,
}) => {
  const myRef = useRef(null)
  const [open, setOpen] = useState(toggle || false);
  const [editMode, setEditMode] = useState(false);
  const [newFolder, setNewFolder] = useState([])

  useEffect(() => {
    getFolders()
  }, [])

  useEffect(() => {
    if (editMode) {
      // eslint-disable-next-line no-use-before-define
      onCancelFolder()
    }
  }, [folders])

  useEffect(() => {
    if (updateResult.success) {
      toast.success('Successfully updated folder')
      initFolderEdit()
    }
    if (updateResult.error) {
      toast.error('Same folder already exists.')
      initFolderEdit()
    }
  }, [updateResult])

  useEffect(() => {
    if (deleteResult.success) {
      toast.success('Successfully deleted folder')
      initFolderEdit()
    }
    if (deleteResult.error) {
      toast.error(deleteResult.error.message)
      initFolderEdit()
    }
  }, [deleteResult])

  useEffect(() => {
    if (onToggle) {
      setTimeout(() => {
        onToggle(open)
      }, open ? 0 : 500)
    }
  }, [open])

  useEffect(() => {
    setOpen(toggle)
  }, [toggle])

  useEffect(() => {
    if (newFolder && newFolder.length > 0) {
      myRef.current.scroll({
        top: myRef.current.offsetHeight,
        behavior: 'smooth',
      })
    }
  }, [newFolder])

  const onSelectItem = (item) => {
    onSelect(item);
    setOpen(false);
  }
  const onCreateFolder = () => {
    const newValue = newFolder.length > 0 ? newFolder[newFolder.length - 1] + 1 : 1
    setNewFolder((prevArr) => ([...prevArr, newValue]))
  }

  const onCancelFolder = () => {
    setEditMode(false)
    setNewFolder([])
  }

  const saveNewFolder = (id, folderName) => {
    if (folderName) {
      createFolder(folderName)
      setNewFolder(newFolder.filter((e) => (e !== id)))
    }
  }

  const tiggerTitle = () => {
    if (selectedFolder.name) {
      return selectedFolder.name
    }
    if (title) {
      return title
    }
    return ''
  }

  return (
    <Fragment>
      {!disableCollapsible && (
        <Collapsible
          trigger={tiggerTitle()}
          open={open}
          setOpenStatus={(flag) => setOpen(flag)}
        >
          <div className="folder-list" ref={myRef}>
            {
              showAll && (
                <SelectItem
                  item={initialFolder.name}
                  selected={selectedFolder.id === initialFolder.id}
                  onSelect={() => onSelectItem(initialFolder)}
                />
              )
            }
            {folders && folders.map((folder) => {
              const { name, id, property_count: propertyCount } = folder
              if (!editMode) {
                return (
                  <SelectItem
                    item={showCount ? (
                      <span>
                        {name}
                        <span className="folder-count">
                          {` (${propertyCount})`}
                        </span>
                      </span>
                    ) : name}
                    selected={selectedFolder && id === selectedFolder.id}
                    onSelect={() => onSelectItem(folder)}
                    key={id}
                  />
                )
              }
              return (
                <FolderRow
                  item={folder}
                  selected={selectedFolder && id === selectedFolder.id}
                  onSelect={() => { }}
                  key={id}
                  folders={folders}
                  hideDelete
                  showCount={showCount}
                />
              )
            })}
            {newFolder && editMode && newFolder.map((folder) => {
              const tempfolder = { name: `New Folder ${folder}`, id: folder }
              return (
                <FolderRow
                  item={tempfolder}
                  selected={false}
                  onSelect={() => { }}
                  key={tempfolder.name}
                  folders={folders}
                  newItem
                  hideDelete
                  onCreateFolder={saveNewFolder}
                  showCount={showCount}
                />
              )
            })}
          </div>
          {showAddOption && !editMode && (
            <div className="add-folder-container button">
              <Button
                label="EDIT FOLDERS"
                height="34px"
                color="white"
                style={{
                  fontSize: '16px',
                }}
                onClick={() => setEditMode(true)}
              />
            </div>
          )}
          {showAddOption && editMode && (
            <Fragment>
              <div className="add-folder-container button">
                <Button
                  label="NEW FOLDER"
                  height="34px"
                  style={{
                    fontSize: '16px',
                  }}
                  onClick={onCreateFolder}
                />
              </div>
              <div className="add-folder-container button">
                <Button
                  label="CANCEL"
                  color="white"
                  onClick={onCancelFolder}
                  height="34px"
                  style={{
                    fontSize: '16px',
                  }}
                />
              </div>
            </Fragment>
          )}
        </Collapsible>
      )}
      {disableCollapsible && (
        <Fragment>
          { folders && folders.map((folder) => {
            const { name, id } = folder
            if (!editMode) {
              return (
                <SelectItem
                  item={name}
                  selected={selectedFolder && id === selectedFolder.id}
                  onSelect={() => onSelectItem(folder)}
                  key={id}
                />
              )
            }
            return (
              <FolderRow
                item={folder}
                selected={selectedFolder && id === selectedFolder.id}
                onSelect={() => { }}
                key={id}
                folders={folders}
                hideDelete
                showCount={showCount}
              />
            )
          })}
        </Fragment>
      )}
    </Fragment>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(FolderSelector)
