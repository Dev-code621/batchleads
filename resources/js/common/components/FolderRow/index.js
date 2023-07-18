import React, {
  useState,
  useRef,
  Fragment,
  useEffect,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './style.scss'

import { folderUpdateSelector } from '~redux/selectors/folderSelector'
import { updateFolder, deleteFolder } from '~redux/modules/folder'

const FolderRow = ({
  item,
  folders,
  newItem,
  hideDelete,
  onCreateFolder,
  onEditMode,
  setEdit,
}) => {
  const updateResult = useSelector(folderUpdateSelector)
  const dispatch = useDispatch()
  const [value, setValue] = useState(item.name)
  const inputElement = useRef(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (updateResult.error) {
      setValue(item.name)
    }
  }, [updateResult])
  useEffect(() => {
    if ( !saved) {
      setValue(item.name)
    }
    setSaved(false)
  }, [setEdit])
  const onSave = () => {
    setSaved(true)
    onEditMode(item.id, false)
    if (value.trim() === '') {
      if (newItem) {
        onEditMode(item.id, true)
      }
      setValue(item.name)
      return;
    }
    if (newItem) {
      onCreateFolder(item.id, value)
      return
    }
    const originFolder = folders.find(((fItem) => fItem.id === item.id))
    if (originFolder && originFolder.name !== value) {
      dispatch(updateFolder(item.id, value))
    }
  }
  const keyPressed = (e) => {
    if (e.key === 'Enter') {
      onSave()
    }
  }
  const onDelete = () => {
    onEditMode(item.id, false)
    // eslint-disable-next-line no-restricted-globals
    if (confirm('Are you sure to delete this property?')) {
      dispatch(deleteFolder(item.id))
    }
  }
  const onEditRow = () => {
    if (!setEdit) {
      onEditMode(item.id, true)
      if (inputElement.current) {
        inputElement.current.focus()
      }
    }
  }
  return (
    <div className="folder-row-item">
      <div className="folder-row-item-container">
        <div className="property-status-item folder-edit-item">
          {!setEdit && (
            <svg width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 14C4 15.1 3.1 16 2 16C0.9 16 0 15.1 0 14C0 12.9 0.9 12 2 12C3.1 12 4 12.9 4 14ZM2 6C0.9 6 0 6.9 0 8C0 9.1 0.9 10 2 10C3.1 10 4 9.1 4 8C4 6.9 3.1 6 2 6ZM2 0C0.9 0 0 0.9 0 2C0 3.1 0.9 4 2 4C3.1 4 4 3.1 4 2C4 0.9 3.1 0 2 0ZM8 4C9.1 4 10 3.1 10 2C10 0.9 9.1 0 8 0C6.9 0 6 0.9 6 2C6 3.1 6.9 4 8 4ZM8 6C6.9 6 6 6.9 6 8C6 9.1 6.9 10 8 10C9.1 10 10 9.1 10 8C10 6.9 9.1 6 8 6ZM8 12C6.9 12 6 12.9 6 14C6 15.1 6.9 16 8 16C9.1 16 10 15.1 10 14C10 12.9 9.1 12 8 12Z" fill="#AAAAAA" />
            </svg>
          )}
          <input
            type="text"
            ref={inputElement}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            readOnly={!setEdit}
            onClick={onEditRow}
            onKeyPress={keyPressed}
            className={`folder-edit-input${setEdit ? ' selected' : ''}`}
          />
          {setEdit ? (
            <Fragment>
              <div className="icon-container" onClick={onSave}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.5325 4.5325L15.4675 0.4675C15.28 0.28 15.05 0.1425 14.8 0.0674999V0H0.8C0.3575 0 0 0.3575 0 0.8V19.2C0 19.6425 0.3575 20 0.8 20H19.2C19.6425 20 20 19.6425 20 19.2V5.6625C20 5.2375 19.8325 4.8325 19.5325 4.5325ZM6.8 1.8H13.2V4.4H6.8V1.8ZM18.2 18.2H1.8V1.8H5.2V5.2C5.2 5.6425 5.5575 6 6 6H14C14.4425 6 14.8 5.6425 14.8 5.2V2.345L18.2 5.745V18.2ZM10 8.25C8.0125 8.25 6.4 9.8625 6.4 11.85C6.4 13.8375 8.0125 15.45 10 15.45C11.9875 15.45 13.6 13.8375 13.6 11.85C13.6 9.8625 11.9875 8.25 10 8.25ZM10 13.85C8.895 13.85 8 12.955 8 11.85C8 10.745 8.895 9.85 10 9.85C11.105 9.85 12 10.745 12 11.85C12 12.955 11.105 13.85 10 13.85Z" fill="#3683BC" />
                </svg>
              </div>
              {!hideDelete
              && (
              <div className="icon-container" onClick={onDelete}>
                <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 18C2 19.103 2.897 20 4 20H14C15.103 20 16 19.103 16 18V6H18V4H14V2C14 0.897 13.103 0 12 0H6C4.897 0 4 0.897 4 2V4H0V6H2V18ZM6 2H12V4H6V2ZM5 6H14L14.001 18H4V6H5Z" fill="#8F8F8F" />
                  <path d="M5.99902 7.99951H7.99902V15.9995H5.99902V7.99951ZM9.99902 7.99951H11.999V15.9995H9.99902V7.99951Z" fill="#8F8F8F" />
                </svg>
              </div>
              )
            }
            </Fragment>
          ) : (
            <div className="icon-container" onClick={onEditRow}>
              <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.6601 1.06886L15.1021 0.511238C14.9404 0.348672 14.7481 0.219559 14.5363 0.131844C14.3244 0.0441283 14.0973 -0.000676208 13.868 7.71318e-06C13.6385 -0.00067776 13.4112 0.0444396 13.1992 0.132332C12.9872 0.220224 12.7948 0.349348 12.6331 0.512215L1.52606 11.6392C1.45832 11.707 1.40521 11.7878 1.37006 11.877L0.0520655 15.2051C-2.15918e-05 15.3325 -0.0134004 15.4725 0.0136134 15.6074C0.0406272 15.7424 0.10684 15.8663 0.203952 15.9639C0.301063 16.0614 0.424762 16.1282 0.559603 16.1558C0.694444 16.1834 0.834441 16.1707 0.962069 16.1191L4.30008 14.812C4.39037 14.7764 4.47239 14.7224 4.54108 14.6538L15.6591 3.53712C15.986 3.20973 16.1697 2.76592 16.1699 2.30323C16.1701 1.84054 15.9868 1.39651 15.6601 1.06886ZM2.59906 12.5928L3.58707 13.5811L1.95508 14.2202L2.59906 12.5928ZM14.6661 2.542L4.96005 12.2481L3.93207 11.2202L13.6321 1.50587C13.6636 1.4743 13.7009 1.44922 13.7421 1.43214C13.7833 1.41505 13.8275 1.40626 13.8721 1.40626C13.9167 1.40626 13.9608 1.41505 14.002 1.43214C14.0432 1.44922 14.0806 1.4743 14.1121 1.50587L14.6691 2.06397C14.7316 2.12801 14.7663 2.21424 14.7657 2.30372C14.7652 2.3932 14.7294 2.47875 14.6661 2.542Z" fill="#454545" />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FolderRow
