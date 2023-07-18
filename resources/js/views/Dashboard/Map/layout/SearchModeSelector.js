import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import SearchOption from './SearchOption'

import { updateMapOption } from '~redux/modules/property'
import { searchModeSelector } from '~redux/selectors/propertySelector'

const searchModes = [
  { title: 'Location', type: 'address', subTypes: ['address', 'city', 'county', 'zip'] },
  { title: 'Boundary', type: 'region', subTypes: [] },
]

export default () => {
  const dispatch = useDispatch()
  const activeType = useSelector(searchModeSelector)

  const updateMode = (item) => {
    if (item.disabled) {
      return
    }
    dispatch(updateMapOption({ type: item.type }))
  }

  return (
    <div className="search-mode-selector">
      {searchModes.map((item) => (
        <SearchOption
          key={item.type}
          disabled={item.disabled}
          onClick={() => updateMode(item)}
          title={item.title}
          selectedLocationType={item.type}
          activeType={activeType}
          active={item.type === activeType || item.subTypes.includes(activeType)}
        />
      ))}
    </div>
  )
}
