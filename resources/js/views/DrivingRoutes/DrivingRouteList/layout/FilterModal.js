import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import DatePicker from 'react-datepicker'

import BaseModal from '~components/BaseModal'
import Button from '~components/Button'
import ContainerRow from '~components/ContainerRow'
import MemberSelector from '~components/CollapsibleSelector/MemberSelector'
import Collapsible from '~components/Collapsable'
import SelectItem from '~components/CollapsibleSelector/SelectItem'

import { updateDrivingRouteFilter } from '~redux/modules/drivingRoutes'
import { drivingRouterFilterSelector } from '~redux/selectors/drivingRoutesSelector';

import './style.scss'

const staticList = {
  hasProperty: {
    title: 'By Properties Added',
    data: [
      { id: null, name: 'Everything' },
      { id: 1, name: 'Yes' },
      { id: 0, name: 'No' },
    ],
  },
  milesDriven: {
    title: 'By Miles Driven (up to)',
    data: [
      { id: null, name: 'Everything' },
      { id: 1, name: '1 mile' },
      { id: 10, name: '10 miles' },
      { id: 50, name: '50 miles' },
      { id: 100, name: '100 miles' },
    ],
  },
  routeType: {
    title: 'By Route Type',
    data: [
      { id: null, name: 'Everything' },
      { id: 'Physical', name: 'Physical' },
      { id: 'Virtual', name: 'Virtual' },
    ],
  },
}

export const FilterModal = ({ toggle, onClose }) => {
  const dispatch = useDispatch();
  const initialFilter = useSelector(drivingRouterFilterSelector)
  const [filter, setFilter] = useState(initialFilter);
  const [toggles, setToggles] = useState({});
  const onSelectItem = (key, item) => {
    setFilter({ ...filter, [key]: item })
    setToggles({ [key]: false });
  }
  useEffect(() => {
    setFilter(initialFilter)
  }, [toggle])
  const resetFilter = () => {
    setFilter({
      created_at: '',
      user: { id: null, name: 'Everyone' },
      hasProperty: { id: null, name: 'Everything' },
      milesDriven: { id: null, name: 'Everything' },
      routeType: { id: null, name: 'Everything' },
    })
  }
  const onApplyFilter = () => {
    dispatch(updateDrivingRouteFilter(filter))
    onClose();
  }
  return (
    <BaseModal
      toggle={toggle}
      onClose={onClose}
      modelClass="driving-route-filter-modal"
      title="FILTER BY"
    >
      <div className="driving-route-filter-body">
        <ContainerRow title="Added Date">
          <DatePicker
            placeholderText="Select Date"
            dateFormat="yyyy-MM-dd"
            selected={filter.created_at}
            onChange={(date) => setFilter({ ...filter, created_at: date })}
          />
        </ContainerRow>
        <ContainerRow title="By Team Members">
          <MemberSelector
            showAll
            onSelect={(sItem) => setFilter({ ...filter, user: sItem })}
            selectedUser={filter.user || {}}
          />
        </ContainerRow>
        {Object.keys(staticList).map((key) => (
          <ContainerRow title={staticList[key].title} key={key}>
            <Collapsible
              trigger={filter[key].name}
              open={toggles[key]}
              setOpenStatus={(flag) => setToggles({ [key]: flag })}
            >
              {staticList[key].data.map((option) => (
                <SelectItem
                  item={option.name}
                  selected={option.id === filter[key].id}
                  onSelect={() => onSelectItem(key, option)}
                  key={option.id}
                />
              ))}
            </Collapsible>
          </ContainerRow>
        ))}
        <ContainerRow>
          <Button label="APPLY FILTER" onClick={onApplyFilter} />
          <Button label="RESET FILTER" onClick={resetFilter} />
          <div className="cancel" onClick={onClose}>Cancel</div>
        </ContainerRow>
      </div>
    </BaseModal>
  )
}
