import React from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useSelector } from 'react-redux'
import { tagSelector } from '~redux/selectors/tagSelector'
import ContainerRow from '~components/ContainerRow'
import PropertyTagItem from '~components/PropertyTagItem'
import PropertyStatusSelector from '~components/CollapsibleSelector/PropertyStatusSelector'
import SkipTracingSelector from '~components/CollapsibleSelector/SkipTracingSelector'
import OwnerSelector from '~components/CollapsibleSelector/OwnerSelector'
import FolderSelector from '~components/CollapsibleSelector/FolderSelector'
import MemberSelector from '~components/CollapsibleSelector/MemberSelector'
import Button from '~components/Button'
import { useThemeState } from '~common/theme-context'
import './style.scss'

const PropertyFilter = ({ filter, onChangeFilter, applyFilter }) => {
  const tags = useSelector(tagSelector)
  const theme = useThemeState()
  const onTagToggle = (tagId) => {
    const filterTags = filter.tags
    if (filterTags) {
      if (filterTags.find((item) => item === tagId)) {
        const filtered = filterTags.filter((item) => item !== tagId)
        onChangeFilter({ ...filter, tags: filtered })
      } else {
        filterTags.push(tagId)
        onChangeFilter({ ...filter, tags: filterTags })
      }
    } else {
      onChangeFilter({ ...filter, tags: [tagId] })
    }
  }

  return (
    <div className={`property-filter-modal ${theme.theme}`}>
      <ContainerRow title="Deal Status">
        <PropertyStatusSelector
          showAll
          onSelect={(sItem) => onChangeFilter({ ...filter, status: sItem })}
          selectedStatus={filter.status}
        />
      </ContainerRow>
      <ContainerRow title="Skip Tracing">
        <SkipTracingSelector
          onSelect={(sItem) => onChangeFilter({ ...filter, skipTracing: sItem })}
          selectedItem={filter.skipTracing}
        />
      </ContainerRow>
      <ContainerRow title="Owner Type">
        <OwnerSelector
          onSelect={(sItem) => onChangeFilter({ ...filter, owner: sItem })}
          selectedItem={filter.owner}
        />
      </ContainerRow>
      <ContainerRow title="Folder Types">
        <FolderSelector
          showAll
          onSelect={(sItem) => onChangeFilter({ ...filter, folder: sItem })}
          selectedFolder={filter.folder}
        />
      </ContainerRow>
      <ContainerRow title="Team Members">
        <MemberSelector
          showAll
          onSelect={(sItem) => onChangeFilter({ ...filter, user: sItem })}
          selectedUser={filter.user}
        />
      </ContainerRow>
      <ContainerRow title="Added Date" className={theme.theme}>
        <DatePicker
          dateFormat="yyyy-MM-dd"
          selected={filter.created_at}
          onChange={(date) => onChangeFilter({ ...filter, created_at: date })}
          className={theme.theme}
        />
      </ContainerRow>
      <ContainerRow title="Tags">
        <div className="tags-container">
          {tags.map((tag) => (
            <PropertyTagItem
              key={tag.id}
              selected={filter.tags && filter.tags.find((item) => item === tag.id)}
              tag={tag}
              onClick={(tagId) => onTagToggle(tagId)}
            />
          ))}
          {tags.length === 0 && (
            <div className="tag-empty-text">No tags</div>
          )}
        </div>
      </ContainerRow>
      <ContainerRow>
        <Button label="APPLY" onClick={applyFilter} />
      </ContainerRow>
    </div>
  )
}

export default PropertyFilter
