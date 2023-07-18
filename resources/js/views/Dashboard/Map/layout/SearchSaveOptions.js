import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { MdCheckBox, MdCheckBoxOutlineBlank } from 'react-icons/md'
import { FaMapMarkerAlt } from 'react-icons/fa'

import Form from '~components/Form'
import FormTitle from '~components/Layout/Dashboard/FormTitle'
import ContainerRow from '~components/ContainerRow'
import Button from '~components/Button';
import FolderSelector from '~components/CollapsibleSelector/FolderSelector'
import InfiniteScroll from '~components/Layout/Dashboard/InfiniteScroll'
import { mapSearchResultSelector, searchFilterSelector } from '~redux/selectors/propertySelector'
import { folderSelector } from '~redux/selectors/folderSelector'
import { saveSearchedProperties_, getMapSearch } from '~redux/modules/property'

export default ({ close, onClickItem }) => {
  const dispatch = useDispatch()
  const {
    items,
    searchMode,
    filter,
    coords,
    total,
    count_per_page: countPerPage,
    page,
    loading,
    zip,
    county,
  } = useSelector(mapSearchResultSelector)
  const mapSearchFilter = useSelector(searchFilterSelector)
  const folders = useSelector(folderSelector)
  const [folder, setFolder] = useState({})
  const [selectedItems, setSelectedItems] = useState([])

  useEffect(() => {
    setSelectedItems(items.map((item) => ({ ...item, selected: true })))
    if (folders && folders.length > 0) {
      setFolder(folders[0])
    }
  }, [])

  useEffect(() => {
    if (items) {
      setSelectedItems(items.map((item) => ({ ...item, selected: true })))
    }
  }, [items])

  const onCheckProperty = (index) => {
    setSelectedItems(selectedItems.map((item, sIndex) => ({
      ...item, selected: index === sIndex ? !item.selected : item.selected,
    })))
  }

  const onSaveProperties = () => {
    const folderId = folder.id
    const selectedProperties = selectedItems.filter((item) => item.selected)
    const excludedProperties = selectedItems.filter((item) => !item.selected)
    const addressHashes = excludedProperties.map(
      (excludedProperty) => excludedProperty.address_hash
    )
    filter.region = coords
    dispatch(saveSearchedProperties_(folderId, searchMode, filter, addressHashes, total))
    close(folder.id, selectedProperties)
  }

  const fetchData = () => {
    if (searchMode === 'zip') {
      dispatch(getMapSearch(page + 1, 'zip', [], mapSearchFilter.zip, zip))
    } else if (searchMode === 'county') {
      dispatch(getMapSearch(page + 1, 'county', [], mapSearchFilter.county, '', county))
    } else if (searchMode === 'city') {
      dispatch(getMapSearch(page + 1, 'county', [], mapSearchFilter.city, '', county))
    } else if (searchMode === 'region') {
      dispatch(getMapSearch(page + 1, 'region', coords, mapSearchFilter.region))
    }
  }

  const refresh = () => {
    if (searchMode === 'zip') {
      dispatch(getMapSearch(1, 'zip', [], mapSearchFilter.zip, zip))
    } else if (searchMode === 'county') {
      getMapSearch(1, 'county', [], mapSearchFilter.county, '', county)
    } else if (searchMode === 'city') {
      getMapSearch(1, 'county', [], mapSearchFilter.city, '', county)
    } else if (searchMode === 'region') {
      dispatch(getMapSearch(1, 'region', coords, mapSearchFilter.region))
    }
  }

  const disabled = !folder.id || selectedItems.filter((item) => item.selected).length < 1

  return (
    <Form className="search-save-options-form">
      <FormTitle title="Save Properties" />
      <ContainerRow title="Select Folder">
        <FolderSelector
          onSelect={(item) => setFolder(item)}
          showAddOption
          selectedFolder={folder || {}}
        />
      </ContainerRow>
      <ContainerRow title="Properties" className="property-list">
        <InfiniteScroll
          dataLength={total}
          next={fetchData}
          hasMore={total && total > countPerPage * page}
          refresh={refresh}
          loading={loading}
          noItemsMessage="No Properties"
          scrollableTarget="property-search-result-list"
        >
          {selectedItems.map((item, index) => (
            <div
              key={item.address_hash}
              className={`property-item${item.selected ? ' selected' : ''}`}
            >
              <div className="info" onClick={() => { onClickItem(item) }}>
                <div className="address-line">
                  <FaMapMarkerAlt />
                  <div className="text">{item.address1}</div>
                </div>
                <div className="owner-name">{item.Current_Owner_Name}</div>
              </div>
              <div className="check-mark" onClick={() => onCheckProperty(index)}>
                {item.selected && <MdCheckBox size={20} color="#0c7de3" />}
                {!item.selected && <MdCheckBoxOutlineBlank size={20} />}
              </div>
            </div>
          ))}
        </InfiniteScroll>
      </ContainerRow>
      <ContainerRow>
        <Button
          label="Save"
          style={{ width: 120, height: 40 }}
          disabled={disabled}
          onClick={onSaveProperties}
        />
      </ContainerRow>
    </Form>
  )
}
