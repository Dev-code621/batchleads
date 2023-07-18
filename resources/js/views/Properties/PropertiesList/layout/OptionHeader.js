import React, { Fragment, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'

import { toast } from '~common/helper'
import SkipTracingModal from './SkipTracingModal'
import StatusSelectorModal from './StatusSelectorModal'
import FolderSelectorModal from './FolderSelectorModal'
import Button from '~components/Button'

import {
  setAllPropertySelected,
  initSkipTracingMulti,
  initDeletePropertyMulti,
  deletePropertyMulti,
  initUpdateStatusMulti,
  updateStatusMulti,
  initUpdateFolderMulti,
  updateFolderMulti,
} from '~redux/modules/property'
import {
  isAllPropertySelectedSelector,
  listFilterSelector,
  selectedPropertiesIdsSelector,
  unSelectedPropertiesIdsSelector,
  deletePropertyMultiSelector,
  updateStatusMultiSelector,
  updateFolderMultiSelector,
} from '~redux/selectors/propertySelector';

export default ({
  history,
  showOption,
  showOptionMenu,
  onFinish,
  count,
}) => {
  const dispatch = useDispatch()
  const isAll = useSelector(isAllPropertySelectedSelector)
  const filter = useSelector(listFilterSelector)
  const propertyIds = useSelector(selectedPropertiesIdsSelector)
  const excludedPropertyIds = useSelector(unSelectedPropertiesIdsSelector)
  const {
    loading, success, error,
  } = useSelector(deletePropertyMultiSelector);
  const {
    loading: statusLoading,
    success: statusSuccess,
    error: statusError,
  } = useSelector(updateStatusMultiSelector);
  const {
    loading: folderLoading,
    success: folderSuccess,
    error: folderError,
  } = useSelector(updateFolderMultiSelector);
  const [showStatusSelector, setShowStatusSelector] = useState(false)
  const [showFolderSelector, setShowFolderSelector] = useState(false)
  const [showSkipTracing, setShowSkipTracing] = useState(false)
  useEffect(() => {
    if (!loading && success) {
      toast.success('Successfully removed properties.')
      dispatch(initDeletePropertyMulti())
      onFinish()
    }
    if (!loading && error) {
      toast.success(error.message)
      dispatch(initDeletePropertyMulti())
    }
  }, [success, loading, error])

  useEffect(() => {
    if (!statusLoading && statusSuccess) {
      toast.success('Successfully updated properties.')
      dispatch(initUpdateStatusMulti())
      onFinish()
    }
    if (!statusLoading && statusError) {
      toast.success(statusError.message)
      dispatch(initUpdateStatusMulti())
    }
  }, [statusSuccess, statusLoading, statusError])

  useEffect(() => {
    if (!folderLoading && folderSuccess) {
      toast.success('Successfully updated properties.')
      dispatch(initUpdateFolderMulti())
      onFinish()
    }
    if (!folderLoading && folderError) {
      toast.success(folderError.message)
      dispatch(initUpdateFolderMulti())
    }
  }, [folderSuccess, folderLoading, folderError])

  useEffect(() => {
    dispatch(setAllPropertySelected(false))
    dispatch(initSkipTracingMulti())
    dispatch(initDeletePropertyMulti())
    dispatch(initUpdateStatusMulti())
    dispatch(initUpdateFolderMulti())
  }, [])

  const gotoBuyCredit = () => {
    history.push('/dashboard/settings/credit/buy')
  }

  const onDeleteProperties = () => {
    if (!isAll && propertyIds.length < 1) {
      return
    }
    // eslint-disable-next-line no-restricted-globals
    const confirmDelete = confirm('Are you sure to delete properties?');
    if (confirmDelete) {
      dispatch(deletePropertyMulti({
        type: isAll ? 'all' : 'multi',
        property_ids: isAll ? [] : propertyIds,
        filter: {
          search: filter.search,
          folder_id: filter.folder.id,
          status: filter.status === 'All Deals' ? null : filter.status,
          user_id: filter.user.id,
          skip_traced: filter.skipTracing.id,
          owner_occupied: filter.owner.id,
          created_at: filter.created_at ? moment(filter.created_at).format('YYYY-MM-DD') : '',
          tags: filter.tags,
        },
        excluded_property_ids: isAll ? excludedPropertyIds : [],
      }))
    }
  }

  const updateStatus = (status) => {
    setShowStatusSelector(false);
    if (!isAll && propertyIds.length < 1) {
      return
    }
    dispatch(updateStatusMulti({
      status,
      property_ids: isAll ? [] : propertyIds,
      filter: {
        search: filter.search,
        folder_id: filter.folder.id,
        status: filter.status === 'All Deals' ? null : filter.status,
        user_id: filter.user.id,
        skip_traced: filter.skipTracing.id,
        owner_occupied: filter.owner.id,
        created_at: filter.created_at ? moment(filter.created_at).format('YYYY-MM-DD') : '',
        tags: filter.tags,
      },
      excluded_property_ids: isAll ? excludedPropertyIds : [],
    }))
  }

  const updateFolders = (folderId) => {
    setShowFolderSelector(false);
    if (!isAll && propertyIds.length < 1) {
      return
    }
    dispatch(updateFolderMulti({
      folder_id: folderId,
      property_ids: isAll ? [] : propertyIds,
      filter: {
        search: filter.search,
        folder_id: filter.folder.id,
        status: filter.status === 'All Deals' ? null : filter.status,
        user_id: filter.user.id,
        skip_traced: filter.skipTracing.id,
        owner_occupied: filter.owner.id,
        created_at: filter.created_at ? moment(filter.created_at).format('YYYY-MM-DD') : '',
        tags: filter.tags,
      },
      excluded_property_ids: isAll ? excludedPropertyIds : [],
    }))
  }
  return (
    <Fragment>
      <div className={`menu-btn ${count ? 'visisble' : 'invisible'}`} onClick={showOptionMenu}>
        <Button
          label="ACTION"
          height="40px"
          color="white"
          style={{
            fontSize: '14px',
          }}
        />
        {showOption && (
          <div className="menu-wrapper">
            <Fragment>
              <div className="menu-item" onClick={() => setShowStatusSelector(true)}>
                Status Change
              </div>
              <div className="menu-item" onClick={() => setShowFolderSelector(true)}>
                Folder Change
              </div>
              <div className="menu-item" onClick={() => setShowSkipTracing(true)}>
                Skip Tracing
              </div>
              <div className="menu-item" onClick={() => history.push('/dashboard/mailCampaign/new')}>
                Start Mailing
              </div>
              <div className="menu-item" onClick={() => history.push('/dashboard/smsCampaign/new')}>
                Start SMS
              </div>
              <div className="menu-item" onClick={onDeleteProperties}>
                Delete
              </div>
            </Fragment>
          </div>
        )}
      </div>
      <SkipTracingModal
        toggle={showSkipTracing}
        gotoBuyCredit={gotoBuyCredit}
        onClose={() => setShowSkipTracing(false)}
        onFinish={() => {
          setShowSkipTracing(false)
        }}
      />
      <StatusSelectorModal
        toggle={showStatusSelector}
        onClose={() => setShowStatusSelector(false)}
        onSelectStatus={(status) => updateStatus(status)}
      />
      <FolderSelectorModal
        toggle={showFolderSelector}
        onClose={() => setShowFolderSelector(false)}
        onSelectStatus={(folderId) => updateFolders(folderId)}
      />
    </Fragment>
  )
}
