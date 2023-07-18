import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { toast } from '~common/helper'
import SelectItem from '~components/CollapsibleSelector/SelectItem'
import {
  folderSelector, folderUpdateSelector,
  folderDeleteSelector, folderLoadingSelector, folderErrorSelector,
} from '~redux/selectors/folderSelector'
import FolderRow from '~components/FolderRow'
import { actions as folderActions } from '~redux/modules/folder'
import Form from '~common/components/Form'
import FormTitle from '~components/Layout/Dashboard/FormTitle'
import ScrollContainer from '~components/Layout/Dashboard/ScrollContainer'
import ContainerRow from '~components/ContainerRow'
import LoadingActivity from '~components/LoadingActivity'
import './layout/style.scss'

const mapStateToProps = (state) => ({
  folders: folderSelector(state),
  updateResult: folderUpdateSelector(state),
  deleteResult: folderDeleteSelector(state),
  loading: folderLoadingSelector(state),
  folderError: folderErrorSelector(state),
})

const mapDispatchToProps = {
  ...folderActions,
}


const initialFolder = { id: null, name: 'Everything' }

const ManageFolders = withRouter(
  ({
    selectedFolder,
    onSelect,
    showAll,
    getFolders,
    folders,
    createFolder,
    updateResult,
    deleteResult,
    initFolderEdit,
    history,
    folderError,
    loading,
  }) => {
    useEffect(() => {
      getFolders()
    }, [])

    useEffect(() => {
      if (folderError && folderError.error) {
        toast.error('Same folder already exists.')
      }
    }, [folderError])

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

    const [newFolder, setNewFolder] = useState([])

    const onSelectItem = (item) => {
      onSelect(item);
    }
    const onCreateFolder = () => {
      const newValue = newFolder.length > 0 ? newFolder[newFolder.length - 1] + 1 : 1
      setNewFolder((prevArr) => ([...prevArr, newValue]))
    }


    const saveNewFolder = (id, folderName) => {
      if (folderName) {
        createFolder(folderName)
        setNewFolder(newFolder.filter((e) => (e !== id)))
      }
    }

    return (
      <Form className="manage-folder-page">
        <FormTitle
          title="Folder Manager"
          hasAdd
          onAdd={onCreateFolder}
          hasBack
          history={history}
        />
        <ScrollContainer>
          {
            showAll && (
              <SelectItem
                item={initialFolder.name}
                selected={selectedFolder.id === initialFolder.id}
                onSelect={() => onSelectItem(initialFolder)}
              />
            )
          }
          {(loading || folders.loading) && (
            <ContainerRow>
              <LoadingActivity />
            </ContainerRow>
          )}
          {folders && folders.map((folder) => {
            const { name, id } = folder
            return (
              <FolderRow
                item={folder}
                selected={selectedFolder && id === selectedFolder.id}
                onSelect={() => {}}
                key={id}
                folders={folders}
              />
            )
          })}
          {newFolder && newFolder.map((folder) => {
            const tempfolder = { name: `New Folder ${folder}`, id: folder }
            return (
              <FolderRow
                item={tempfolder}
                selected={false}
                onSelect={() => {}}
                key={tempfolder.name}
                folders={folders}
                newItem
                hideDelete
                onCreateFolder={saveNewFolder}
              />
            )
          })}
        </ScrollContainer>
      </Form>
    )
  }
)

export default connect(mapStateToProps, mapDispatchToProps)(ManageFolders)
