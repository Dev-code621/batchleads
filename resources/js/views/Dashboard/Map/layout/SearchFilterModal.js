import React, { useState, useEffect, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { MdCheckBox, MdCheckBoxOutlineBlank, MdEdit } from 'react-icons/md'
import { IoIosCheckmarkCircle, IoIosRadioButtonOff } from 'react-icons/io'
import { FiInfo } from 'react-icons/fi'
import InputRange from 'react-input-range';
import get from 'lodash.get'

import BaseModal from '~components/BaseModal'
import Button from '~components/Button'
import { searchFilterSelector, mapSearchResultSelector } from '~redux/selectors/propertySelector'
import { userSelector } from '~redux/selectors/userSelector';
import { updateSearchModeFilter, getMapSearch, saveSearchedProperties_ } from '~redux/modules/property'
import LoadingActivity from '~components/LoadingActivity'
import ContainerRow from '~common/components/ContainerRow'
import FolderSelector from '~components/CollapsibleSelector/FolderSelector'

import 'react-input-range/lib/css/index.css'

const filterOptions = [
  {
    title: 'Dwelling',
    key: 'dwelling_type',
    option: true,
    options: [
      { label: 'Any', value: null },
      { label: 'Residential', value: 'Residential' },
      { label: 'Commercial', value: 'Commercial' },
    ],
    forbidenPlan: ['BASE', 'Base - Grandfathered'],
  },
  {
    title: 'Owner Type',
    key: 'owner_status',
    option: true,
    options: [
      { label: 'Any', value: null },
      { label: 'Owner Occupied', value: 'Yes' },
      { label: 'Absentee Owner', value: 'No' },
    ],
  },
  {
    title: 'MLS',
    key: 'on_market',
    option: true,
    options: [
      { label: 'Any', value: null },
      { label: 'Not On Market', value: 'Not_On_Market' },
      { label: 'On Market', value: 'On_Market' },
    ],
    forbidenPlan: ['BASE'],
  },
  { title: 'Year Built', key: 'building', slider: true },
  {
    title: 'Equity', key: 'equity', slider: true, forbidenPlan: ['BASE', 'Base - Grandfathered'],
  },
  {
    title: 'Pre-Foreclosure', key: 'foreclosure_status', checkbox: true, forbidenPlan: ['BASE'],
  },
  {
    title: 'Vacant', key: 'vacant', checkbox: true,
  },
  {
    title: 'Tax Delinquent', key: 'tax_default', checkbox: true, forbidenPlan: ['BASE', 'Base - Grandfathered'],
  },
  {
    title: 'Tired Landlords', key: 'tired_landlord', checkbox: true, forbidenPlan: ['BASE', 'Base - Grandfathered'],
  },
  {
    title: 'Inherited Properties', key: 'inherited', checkbox: true, forbidenPlan: ['BASE', 'Base - Grandfathered'],
  },
  {
    title: 'Unknown Equity', key: 'unknown_equity', checkbox: true, forbidenPlan: ['BASE', 'Base - Grandfathered'],
  },
  {
    title: 'Cash Buyer', key: 'cash_buyer', checkbox: true, forbidenPlan: ['BASE', 'Base - Grandfathered'],
  },
]

export default ({ toggle, onClose, type }) => {
  const dispatch = useDispatch();
  const filter = useSelector(searchFilterSelector)[type]
  const { user } = useSelector(userSelector).result.user;
  const userPlan = get(user.subscription, 'nickname')
  const [year, setYear] = useState(filter.building)
  const [equity, setEquity] = useState(filter.equity)
  const [folderOpen, setFolderOpen] = useState(false)
  const [folder, setFolder] = useState()
  const [openFilter, setOpenFilter] = useState(true)
  const [filterUpdate, setFilterUpdate] = useState(false)
  const {
    loading,
    coords,
    total,
  } = useSelector(mapSearchResultSelector)

  const updateFilter = (key, value) => {
    dispatch(updateSearchModeFilter({
      type,
      key,
      value,
    }))
    setFilterUpdate(true)
  }

  useEffect(() => {
    if (userPlan === 'BASE') {
      updateFilter('foreclosure_status', false);
    }
  }, [])

  useEffect(() => {
    if (folderOpen) {
      setOpenFilter(false)
    }
  }, [folderOpen])

  const updateSlider = (key, value) => {
    if (key === 'building') {
      setYear(value)
    } else {
      setEquity(value)
    }
  }
  const formatLabel = (value, key) => {
    if (key === 'building') {
      return value
    }
    return `${value}%`
  }

  const searchZipCounty = () => {
    if (type === 'zip') {
      dispatch(getMapSearch(1, 'zip', [], filter, filter.searchKey))
    } else if (type === 'county' || type === 'city') {
      dispatch(getMapSearch(1, type, [], filter, '', filter.searchKey))
    }
  }

  useEffect(() => {
    if (filterUpdate && type !== 'address' && toggle) {
      setFilterUpdate(false)
      searchZipCounty()
    }
  }, [filter])

  useEffect(() => {
    if (type !== 'address' && toggle) {
      searchZipCounty()
    }
  }, [toggle])

  const editFilter = () => {
    setOpenFilter(true)
    setFolderOpen(false)
  }

  const onSaveProperties = () => {
    const folderId = folder.id
    filter.region = coords
    dispatch(saveSearchedProperties_(folderId, type, filter, [], total))
    onClose()
  }

  const footer = (
    folder
      ? (
        <div className="filter-option-row multi">
          <Button label="SAVE PROPERTIES" color="white" onClick={onSaveProperties} />
        </div>
      )
      : <Fragment />
  )

  const title = (
    openFilter
      ? (
        <div className="title-search-filter-model filter-title">
          <div className="search-key">
            {`Search in ${filter.searchKey}`}
          </div>
          <div>
            {`FILTER OPTIONS ${openFilter}`}
          </div>
        </div>
      )
      : (
        <div className="title-search-filter-model filter-title-single">
          {`FILTER OPTIONS ${openFilter}`}
          <span className="search-key">
            Search in&nbsp;
            {filter.searchKey}
          </span>
          <div className="edit">
            <MdEdit onClick={editFilter} />
          </div>
        </div>
      )
  )

  return (
    <BaseModal
      toggle={toggle}
      onClose={onClose}
      title={title}
      footer={footer}
      transparent
      modelClass="search-filter-model"
    >
      <div className="search-filter-modal-body">
        {openFilter
        && (
          <Fragment>
            {filterOptions.filter((item) => !!item.option).map(({
              title: optionTitle, key, options, forbidenPlan = [],
            }) => {
              const disabled = forbidenPlan.includes(userPlan);
              return (
                <div
                  key={key}
                  className={`filter-option-row multi${disabled ? ' disabled' : ''}`}
                >
                  <div className="option-title">{optionTitle}</div>
                  <div className="option-wrapper">
                    {options.map((item) => (
                      <div
                        key={item.value}
                        onClick={() => !disabled && updateFilter(key, item.value)}
                        className={`option-item${item.value ? '' : ' small'}`}
                      >
                        {item.value === filter[key] && <IoIosCheckmarkCircle size={20} color="#3683bc" />}
                        {item.value !== filter[key] && <IoIosRadioButtonOff size={20} color="#c3c3c3" />}
                        <div>{item.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
            {filterOptions.filter((item) => !!item.slider)
              .map(({ title: filterOptionTitle, key, forbidenPlan = [] }) => {
                const disabled = forbidenPlan.includes(userPlan);
                return (
                  <div
                    key={key}
                    className={`filter-option-row slider${disabled ? ' disabled' : ''}`}
                  >
                    <div className="option-title">{filterOptionTitle}</div>
                    <InputRange
                      disabled={disabled}
                      maxValue={key === 'building' ? 2020 : 100}
                      minValue={key === 'building' ? 1900 : 0}
                      value={key === 'building' ? year : equity}
                      formatLabel={(value) => formatLabel(value, key)}
                      onChange={(value) => updateSlider(key, value)}
                      onChangeComplete={(value) => updateFilter(key, value)}
                    />
                  </div>
                )
              })}
            <div className="filter-option-checkbox-container">
              <div className="filter-option-checkbox-column">
                {filterOptions
                  .filter((item) => item.checkbox).slice(0, 4)
                  .map(({ title: checkTitle, key, forbidenPlan = [] }) => {
                    const disabled = forbidenPlan.includes(userPlan);
                    return (
                      <div
                        key={key}
                        onClick={() => !disabled && updateFilter(key, !filter[key])}
                        className={`filter-option-row${disabled ? ' disabled' : ''}`}
                      >
                        {filter[key] && <MdCheckBox size={24} color="#3683bc" />}
                        {!filter[key] && <MdCheckBoxOutlineBlank size={24} />}
                        <div className="check-title">{checkTitle}</div>
                      </div>

                    )
                  })}
              </div>
              <div className="filter-option-checkbox-column">
                {filterOptions
                  .filter((item) => item.checkbox)
                  .slice(4).map(({ title: checkTitle, key, forbidenPlan = [] }) => {
                    const disabled = forbidenPlan.includes(userPlan);
                    return (
                      <div
                        key={key}
                        onClick={() => !disabled && updateFilter(key, !filter[key])}
                        className={`filter-option-row${disabled ? ' disabled' : ''}`}
                      >
                        {filter[key] && <MdCheckBox size={24} color="#3683bc" />}
                        {!filter[key] && <MdCheckBoxOutlineBlank size={24} />}
                        <div className="check-title">{checkTitle}</div>
                      </div>
                    )
                  })}
              </div>
            </div>
          </Fragment>
        )}
        <div className="folders">
          { !loading
            ? (
              <span className="property-count">
                {total}
                <span className="count-text"> PROPERTIES FOUND</span>
              </span>
            )
            : <LoadingActivity color="#fff" height="25" />
          }
          <ContainerRow className="folder-container">
            <FolderSelector
              selectedFolder={folder || {}}
              title="SELECT FOLDER TO SAVE IN "
              showAddOption
              onSelect={(fItem) => {
                setFolder(fItem)
              }}
              onToggle={setFolderOpen}
              toggle={folderOpen}
              showCount
            />
          </ContainerRow>
          <div className="info">
            <span><FiInfo className="info-icon" /></span>
            <span>
              Only properties that are not already in your database will be added to this folder.
            </span>
          </div>
        </div>
      </div>
    </BaseModal>
  )
}
