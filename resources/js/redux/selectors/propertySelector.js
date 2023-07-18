import { createSelector } from 'reselect'

const propertyDataSelector = (state) => state.property

const resultSelector = createSelector(
  propertyDataSelector,
  (payload) => {
    const result = payload.get('propertiesResult')
    return {
      ...result.toJS(),
    }
  }
)

const mapResultSelector = createSelector(
  propertyDataSelector,
  (payload) => {
    const result = payload.get('mapPropertiesResult')
    return {
      ...result.toJS(),
    }
  }
)

const resultPropertyByAddressSelector = createSelector(
  propertyDataSelector,
  (payload) => {
    return {
      ...payload.get('propertyByAddressResult').toJS(),
    }
  }
)

const resultPropertyByDistanceSelector = createSelector(
  propertyDataSelector,
  (payload) => {
    return {
      ...payload.get('propertyByDistanceResult'),
    }
  }
)

const resultPropertyByLatLngSelector = createSelector(
  propertyDataSelector,
  (payload) => {
    return {
      ...payload.get('propertyByLatLngResult').toJS(),
    }
  }
)

const resultPropertyByIdSelector = createSelector(
  propertyDataSelector,
  (payload) => {
    return {
      propertyByIdResult: payload.get('propertyByIdResult'),
    }
  }
)

const selectedPropertiesSelector = createSelector(
  propertyDataSelector,
  (payload) => {
    return payload.get('selectedProperties')
  }
)

const excludedPropertiesSelector = createSelector(
  propertyDataSelector,
  (payload) => {
    return payload.get('excludedProperties')
  }
)

export const isAllPropertySelectedSelector = createSelector(
  propertyDataSelector,
  (payload) => {
    return payload.get('isAllPropertySelected')
  }
)

export const selectedPropertiesIdsSelector = createSelector(
  propertyDataSelector,
  (payload) => {
    return payload
      .getIn(['propertiesResult', 'propertyListData'])
      .toJS()
      .filter((item) => item.selected)
      .map((item) => item.id)
  }
)

export const unSelectedPropertiesIdsSelector = createSelector(
  propertyDataSelector,
  (payload) => {
    return payload
      .getIn(['propertiesResult', 'propertyListData'])
      .toJS()
      .filter((item) => !item.selected)
      .map((item) => item.id)
  }
)

export const searchSelector = createSelector(
  propertyDataSelector,
  (payload) => payload.get('search')
)

export const selectedPropertySelector = createSelector(
  propertyDataSelector,
  (payload) => ({ ...payload.get('selectedProperty').toJS() })
)

export const mapFilterSelector = createSelector(
  propertyDataSelector,
  (payload) => ({ ...payload.get('mapFilter').toJS() })
)

export const listFilterSelector = createSelector(
  propertyDataSelector,
  (payload) => ({ ...payload.get('listFilter').toJS() })
)

export const contactSelector = createSelector(
  propertyDataSelector,
  (payload) => ({ ...payload.get('selectedProperty').toJS().contact })
)

export const activitiesSelector = createSelector(
  propertyDataSelector,
  (payload) => ({ ...payload.getIn(['selectedProperty', 'activities']).toJS() })
)

export const searchModeSelector = createSelector(
  propertyDataSelector,
  (payload) => payload.getIn(['mapOption', 'searchMode'])
)

export const searchFilterSelector = createSelector(
  [propertyDataSelector],
  (payload) => payload.getIn(['mapOption']).toJS()
)

export const mapSearchResultSelector = createSelector(
  propertyDataSelector,
  (payload) => ({ ...payload.getIn(['mapSearchResult']).toJS() })
)

export const saveSearchedResultSelector = createSelector(
  propertyDataSelector,
  (payload) => ({ ...payload.getIn(['saveSearchResult']).toJS() })
)

export const skipTracingMultiResultSelector = createSelector(
  propertyDataSelector,
  (payload) => ({ ...payload.getIn(['skipTracingMultiResult']).toJS() })
)

export const propertiesByPhoneNumberSelector = createSelector(
  propertyDataSelector,
  (payload) => ({ ...payload.getIn(['propertiesByPhoneNumberResult']).toJS() })
)

export const deletePropertyMultiSelector = createSelector(
  propertyDataSelector,
  (payload) => ({ ...payload.getIn(['deletePropertyMultiResult']).toJS() })
)

export const updateStatusMultiSelector = createSelector(
  propertyDataSelector,
  (payload) => ({ ...payload.getIn(['updateStatusMultiResult']).toJS() })
)

export const updatePropertyTagSelector = createSelector(
  propertyDataSelector,
  (payload) => ({ ...payload.getIn(['propertyTagResult']).toJS() })
)

export const updateFolderMultiSelector = createSelector(
  propertyDataSelector,
  (payload) => ({ ...payload.getIn(['updateFolderMultiResult']).toJS() })
)

export const stopPropertyCamapigns = createSelector(
  propertyDataSelector,
  (payload) => ({ ...payload.getIn(['stopPropertyCampaignsResult']).toJS() })
)

export const mapResultListSelector = createSelector(
  propertyDataSelector,
  (payload) => payload.getIn(['mapPropertiesResult', 'propertyListData']).toJS()
)

export const notSkipTracedCountSelector = createSelector(
  propertyDataSelector,
  (payload) => ({ count: payload.get('not_skip_traced_count') })
)

export const propertySelector = (state) => ({
  result: resultSelector(state),
  mapResult: mapResultSelector(state),
  resultPropertyByAddress: resultPropertyByAddressSelector(state),
  resultPropertyByDistance: resultPropertyByDistanceSelector(state),
  resultPropertyByLatLng: resultPropertyByLatLngSelector(state),
  resultPropertyById: resultPropertyByIdSelector(state),
  selectedProperties: selectedPropertiesSelector(state),
  excludedProperties: excludedPropertiesSelector(state),
  isAllPropertySelected: isAllPropertySelectedSelector(state),
  search: searchSelector(state),
  selectedProperty: selectedPropertySelector(state),
  mapFilter: mapFilterSelector(state),
  listFilter: listFilterSelector(state),
  propertiesByPhoneNumber: propertiesByPhoneNumberSelector(state),
  tagResult: updatePropertyTagSelector(state),
  stopCampaignsResult: stopPropertyCamapigns(state),
  notSkipTracedCount: notSkipTracedCountSelector(state),
})
