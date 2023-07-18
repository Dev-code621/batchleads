import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Form from '~components/Form'
import FormTitle from '~components/Layout/Dashboard/FormTitle'
import PropertyFilter from '~components/PropertyFilter'

import { setListPropertyFilter, initialState } from '~redux/modules/property'
import { listFilterSelector } from '~redux/selectors/propertySelector'

import './style.scss'

export default ({ close }) => {
  const [filter, setFilter] = useState(useSelector(listFilterSelector))
  const dispatch = useDispatch();
  const applyFilter = () => {
    dispatch(setListPropertyFilter(filter))
    close(filter)
  }
  const initialFilter = initialState().toJS().listFilter
  return (
    <Form className="property-filter">
      <FormTitle title="Filter By" hasRefresh refresh={() => setFilter(initialFilter)} />
      <PropertyFilter
        filter={filter}
        onChangeFilter={setFilter}
        applyFilter={applyFilter}
      />
    </Form>
  )
}
