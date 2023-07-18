import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Form from '~components/Form'
import FormTitle from '~components/Layout/Dashboard/FormTitle'
import PropertyFilter from '~components/PropertyFilter'

import { setMapPropertyFilter, initialState } from '~redux/modules/property'
import { mapFilterSelector } from '~redux/selectors/propertySelector'

const MapFilter = ({ close }) => {
  const [filter, setFilter] = useState(useSelector(mapFilterSelector))
  const dispatch = useDispatch();
  const applyFilter = () => {
    dispatch(setMapPropertyFilter(filter))
    close(filter)
  }
  const initialFilter = initialState().toJS().mapFilter
  return (
    <Form className="map-options-form filter">
      <FormTitle title="Filter By" hasRefresh refresh={() => setFilter(initialFilter)} />
      <PropertyFilter
        filter={filter}
        onChangeFilter={setFilter}
        applyFilter={applyFilter}
      />
    </Form>
  )
}

export default MapFilter
