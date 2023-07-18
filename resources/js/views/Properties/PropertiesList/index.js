import React, { useEffect, useState } from 'react'
import Modal from 'react-modal'
import moment from 'moment'
import InfiniteScroll from '~components/Layout/Dashboard/InfiniteScroll'
import Property from './Property'
import Form from '~components/Form'
import FormTopHeader from '~components/Layout/Dashboard/FormTopHeader'
import FormTitle from '~components/Layout/Dashboard/FormTitle'
import BulkSelect from './layout/BulkSelect'
import Filter from '../PropertyListFilter'
import Button from '~components/Button'
import { useThemeState } from '~common/theme-context'
import './layout/style.scss'
import OptionHeader from './layout/OptionHeader'

const filterModalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    top: '50%',
    left: '100%',
    right: 'auto',
    bottom: 'auto',
    marginLeft: '-150px',
    transform: 'translate(-50%, -50%)',
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    border: 'none',
    background: 'transparent',
    borderRadius: 0,
  },
}

export default (props) => {
  const {
    getpProperties,
    selectProperty,
    initProperty,
    property,
    match,
    history,
    setPropertySelected,
    setAllPropertySelected,
    setVisiblePropertySelected,
    setCustomPropertySelected,
    setPropertySearch,
    initPropertySearch,
  } = props

  const { isSelect } = match.params

  const {
    result, isAllPropertySelected, search, listFilter,
  } = property
  const {
    propertyListData,
    total,
    page,
    count_per_page: countPerPage,
    count,
    loading,
  } = result

  const dataLength = count + (Number(page) - 1) * countPerPage
  const theme = useThemeState()
  let smsCampaignId = 0
  let mailCampaignId = 0
  let backOption = false
  const { state } = history.location
  if (state) {
    smsCampaignId = state.sms_campaign_id
    mailCampaignId = state.mail_campaign_id
    backOption = state.back_button || false
  }

  const [loaded, setLoaded] = useState(false)
  const [forceUpdate, setForceUpdate] = useState(false)
  const [showListFilter, setShowListFilter] = useState(false)
  const [showOption, setShowOption] = useState(false)
  const [showBulkOption, setShowBulkOption] = useState(false)
  const [editProperties, setEditProperties] = useState(true)

  const onChangeSearch = (e) => {
    setPropertySearch(e.target.value)
  }

  const clearSearch = () => {
    initPropertySearch()
  }

  const getProperties = (pageNumber, filter = listFilter) => {
    const filters = {
      search,
      folder_id: filter.folder.id,
      status: filter.status !== 'All Deals' ? filter.status : null,
      user_id: filter.user.id,
      skip_traced: filter.skipTracing.id,
      owner_occupied: filter.owner.id,
      created_at: filter.created_at ? moment(filter.created_at).format('YYYY-MM-DD') : '',
      tags: filter.tags,
    }
    if (smsCampaignId) {
      filters.sms_campaign_id = smsCampaignId
    }
    if (mailCampaignId) {
      filters.mail_campaign_id = mailCampaignId
    }
    getpProperties(pageNumber, filters)
  }

  useEffect(() => {
    if (dataLength === 0) {
      // initProperty()
      getProperties(1)
    }
  }, [])

  useEffect(() => {
    if (loaded) {
      // initProperty()
      getProperties(1)
    }
    setLoaded(true)
  }, [search])

  useEffect(() => {
    if (smsCampaignId) {
      initProperty()
      getProperties(1)
    }
  }, [smsCampaignId])

  useEffect(() => {
    if (mailCampaignId) {
      initProperty()
      getProperties(1)
    }
  }, [mailCampaignId])

  const fetchData = () => {
    getProperties(Number(page) + 1)
  }

  const refresh = () => {
    // initProperty()
    getProperties(1)
  }

  const onClickProperty = (item) => {
    selectProperty(item);
    history.push('/dashboard/properties/detail')
  }

  const onSelectProperty = (prop) => {
    setPropertySelected(prop)
    setForceUpdate(!forceUpdate)
  }

  const onSelectAll = () => {
    setAllPropertySelected(!isAllPropertySelected)
  }

  const onSelectVisible = () => {
    setVisiblePropertySelected();
  }

  const onUnselectAll = () => {
    setAllPropertySelected(false);
  }

  const onSelectCustomNumber = (num) => {
    setCustomPropertySelected(num)
  }

  const getSelectedCount = () => {
    let selectedCount = 0
    let unSelectedCount = 0
    if (propertyListData) {
      propertyListData.map((item) => {
        if (item.selected) {
          selectedCount += 1
        } else {
          unSelectedCount += 1
        }
        return true
      })
    }

    if (isAllPropertySelected) {
      selectedCount = total - unSelectedCount
    }

    return selectedCount
  }

  const applyNewFilter = (newFilter) => {
    setShowListFilter(false)
    getProperties(1, newFilter)
  }

  const hideBulkOptionMenu = (e) => {
    if (e.target.className !== 'option__input') {
      setShowBulkOption(false)
      document.removeEventListener('click', hideBulkOptionMenu);
    }
  }

  const showBulkOptionMenu = () => {
    if (!showBulkOption) {
      document.addEventListener('click', hideBulkOptionMenu);
    }
    setShowBulkOption(!showBulkOption)
  }

  const hideOptionMenu = () => {
    setShowOption(false)
    document.removeEventListener('click', hideOptionMenu);
  }

  const showOptionMenu = () => {
    if (!showOption) {
      document.addEventListener('click', hideOptionMenu);
    }
    setShowOption(!showOption)
  }

  const customHeader = () => {
    if (isSelect) return null
    return (
      <OptionHeader
        editProperties={editProperties}
        showOption={showOption}
        showOptionMenu={showOptionMenu}
        onEdit={() => setEditProperties(true)}
        onCancel={() => setEditProperties(false)}
        onFinish={refresh}
        history={history}
        count={getSelectedCount()}
      />
    )
  }

  return (
    <Form className="property-list-page">
      <FormTitle
        title={editProperties || isSelect ? 'Select Properties' : 'Properties'}
        hasRefresh
        refresh={refresh}
        loading={loading}
        hasBack={smsCampaignId || mailCampaignId || backOption || false}
        history={history}
      />
      <div className="property-list-header">
        {(isSelect || editProperties) && (
          <BulkSelect
            showOption={showBulkOption}
            showOptionMenu={showBulkOptionMenu}
            count={getSelectedCount()}
            total={total}
            visible={propertyListData && propertyListData.length}
            onSelectAll={onSelectAll}
            isSelectedAll={isAllPropertySelected}
            onSelectVisible={onSelectVisible}
            onUnselectAll={onUnselectAll}
            onSelectCustomNumber={onSelectCustomNumber}
          />
        )}
        {isSelect ? (
          <Button
            label="ADD TO CAMPAIGN"
            height="40px"
            icon="plus"
            style={{
              fontSize: '14px',
            }}
            onClick={() => history.goBack()}
          />
        ) : (
          <div className="option-header-container">
            {customHeader()}
          </div>
        )}
      </div>
      <FormTopHeader
        showSearch
        search={search}
        onChangeSearch={onChangeSearch}
        onClearSearch={clearSearch}
        showFilter
        onClickFilter={() => setShowListFilter(true)}
        // customHeader={customHeader()}
      />
      <InfiniteScroll
        dataLength={dataLength}
        next={fetchData}
        hasMore={total && total > countPerPage * page}
        refresh={refresh}
        loading={loading}
        noItemsMessage="No Properties"
      >
        {propertyListData && propertyListData.map((item) => (
          <Property
            {...item}
            key={item.id}
            isSelect={isSelect || editProperties}
            onSelect={() => onSelectProperty(item)}
            onClickItem={() => onClickProperty(item)}
          />
        ))}
      </InfiniteScroll>
      <Modal
        isOpen={showListFilter}
        onRequestClose={() => setShowListFilter(false)}
        style={filterModalStyles}
        ariaHideApp={false}
        bodyOpenClassName={theme.theme}
      >
        <Filter close={applyNewFilter} />
      </Modal>
    </Form>
  );
}
