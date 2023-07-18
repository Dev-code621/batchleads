import { createAction, handleActions } from 'redux-actions'
import { fromJS, Map } from 'immutable'

const GET_PROPERTIES = 'GET_PROPERTIES'
const GET_PROPERTIES_RESULT = 'GET_PROPERTIES_RESULT'
const GET_MAP_PROPERTIES = 'GET_MAP_PROPERTIES'
const GET_MAP_PROPERTIES_RESULT = 'GET_MAP_PROPERTIES_RESULT'
const INIT_PROPERTY = 'INIT_PROPERTY'
const GET_PROPERTYBYADDRESS = 'GET_PROPERTYBYADDRESS'
const GET_PROPERTYBYADDRESS_RESULT = 'GET_PROPERTYBYADDRESS_RESULT'
const INIT_PROPERTYBYADDRESS = 'INIT_PROPERTYBYADDRESS'
const GET_PROPERTYBYID = 'GET_PROPERTYBYID'
const GET_PROPERTYBYID_RESULT = 'GET_PROPERTYBYID_RESULT'
const SET_PROPERTY_SELECTED = 'SET_PROPERTY_SELECTED'
const SET_VISIBLE_PROPERTY_SELECTED = 'SET_VISIBLE_PROPERTY_SELECTED'
const INIT_SELECTED_PROPERTIES = 'INIT_SELECTED_PROPERTIES'
const SET_ALL_PROPERTY_SELECTED = 'SET_ALL_PROPERTY_SELECTED'
const SET_CUSTOM_PROPERTY_SELECTED = 'SET_CUSTOM_PROPERTY_SELECTED'
const INIT_PROPERTY_SEARCH = 'INIT_PROPERTY_SEARCH'
const SET_PROPERTY_SEARCH = 'SET_PROPERTY_SEARCH'
const GET_PROPERTY_BY_DISTANCE = 'GET_PROPERTY_BY_DISTANCE'
const GET_PROPERTY_BY_DISTANCE_RESULT = 'GET_PROPERTY_BY_DISTANCE_RESULT'
const INIT_PROPERTY_BY_DISTANCE = 'INIT_PROPERTY_BY_DISTANCE'
const GET_PROPERTY_BY_LATLNG = 'GET_PROPERTY_BY_LATLNG'
const GET_PROPERTY_BY_LATLNG_RESULT = 'GET_PROPERTY_BY_LATLNG_RESULT'
const INIT_PROPERTY_BY_LATLNG = 'INIT_PROPERTY_BY_LATLNG'
const CREATE_PROPERTY = 'CREATE_PROPERTY'
const CREATE_PROPERTY_RESULT = 'CREATE_PROPERTY_RESULT'
const UPDATE_PROPERTY = 'UPDATE_PROPERTY'
const UPDATE_PROPERTY_RESULT = 'UPDATE_PROPERTY_RESULT'
const DELETE_PROPERTY = 'DELETE_PROPERTY'
const DELTE_PROPERTY_RESULT = 'DELTE_PROPERTY_RESULT'
const SELECT_PROPERTY = 'SELECT_PROPERTY'
const SET_MAP_PROPERTY_FILTER = 'SET_MAP_PROPERTY_FILTER'
const SET_LIST_PROPERTY_FILTER = 'SET_LIST_PROPERTY_FILTER'
const SKIP_TRACING_ITEM = 'SKIP_TRACING_ITEM'
const SKIP_TRACING_ITEM_RESULT = 'SKIP_TRACING_ITEM_RESULT'
const ADD_CONTACT = 'ADD_CONTACT'
const ADD_CONTACT_RESULT = 'ADD_CONTACT_RESULT'
const UPDATE_CONTACT = 'UPDATE_CONTACT'
const UPDATE_CONTACT_RESULT = 'UPDATE_CONTACT_RESULT'
const DELETE_CONTACT = 'DELETE_CONTACT'
const DELETE_CONTACT_RESULT = 'DELETE_CONTACT_RESULT'
const INIT_PROPERTY_ACTIVITIES = 'INIT_PROPERTY_ACTIVITIES'
const GET_PROPERTY_ACTIVITIES = 'GET_PROPERTY_ACTIVITIES'
const GET_PROPERTY_ACTIVITIES_RESULT = 'GET_PROPERTY_ACTIVITIES_RESULT'
const ADD_PROPERTY_NOTE = 'ADD_PROPERTY_NOTE'
const ADD_PROPERTY_NOTE_RESULT = 'ADD_PROPERTY_NOTE_RESULT'

const UPDATE_SEARCH_MODE = 'UPDATE_SEARCH_MODE'
const UPDATE_SEARCH_MODE_FILTER = 'UPDATE_SEARCH_MODE_FILTER'
const INIT_MAP_SEARCH = 'INIT_MAP_SEARCH'
const GET_MAP_SEARCH = 'GET_MAP_SEARCH'
const GET_MAP_SEARCH_RESULT = 'GET_MAP_SEARCH_RESULT'
const SAVE_SEARCHED_PROPERTIES = 'SAVE_SEARCHED_PROPERTIES'
const SAVE_SEARCHED_PROPERTIES_RESULT = 'SAVE_SEARCHED_PROPERTIES_RESULT'

const INIT_SKIP_TRACING_MULTI = 'INIT_SKIP_TRACING_MULTI'
const SKIP_TRACING_MULTI = 'SKIP_TRACING_MULTI'
const SKIP_TRACING_MULTI_RESULT = 'SKIP_TRACING_MULTI_RESULT'

const GET_PROPERTIES_BY_PHONE_NUMBER = 'GET_PROPERTIES_BY_PHONE_NUMBER'
const GET_PROPERTIES_BY_PHONE_NUMBER_RESULT = 'GET_PROPERTIES_BY_PHONE_NUMBER_RESULT'

const INIT_DELETE_PROPERTY_MULTI = 'INIT_DELETE_PROPERTY_MULTI'
const DELETE_PROPERTY_MULTI = 'DELETE_PROPERTY_MULTI'
const DELETE_PROPERTY_MULTI_RESULT = 'DELETE_PROPERTY_MULTI_RESULT'

const SAVE_SEARCHED_PROPERTIES_ = 'SAVE_SEARCHED_PROPERTIES_'
const SAVE_SEARCHED_PROPERTIES_RESULT_ = 'SAVE_SEARCHED_PROPERTIES_RESULT_'

const INIT_UPDATE_STATUS_MULTI = 'INIT_UPDATE_STATUS_MULTI'
const UPDATE_STATUS_MULTI = 'UPDATE_STATUS_MULTI'
const UPDATE_STATUS_MULTI_RESULT = 'UPDATE_STATUS_MULTI_RESULT'

const INIT_PROPERTY_TAG = 'INIT_PROPERTY_TAG'
const UPDATE_PROPERTY_TAG = 'UPDATE_PROPERTY_TAG'
const UPDATE_PROPERTY_TAG_RESULT = 'UPDATE_PROPERTY_TAG_RESULT'

const INIT_UPDATE_FOLDER_MULTI = 'INIT_UPDATE_FOLDER_MULTI'
const UPDATE_FOLDER_MULTI = 'UPDATE_FOLDER_MULTI'
const UPDATE_FOLDER_MULTI_RESULT = 'UPDATE_FOLDER_MULTI_RESULT'

const STOP_PROPERTY_CAMPAIGNS = 'STOP_PROPERTY_CAMPAIGNS'
const STOP_PROPERTY_CAMPAIGNS_RESULT = 'STOP_PROPERTY_CAMPAIGNS_RESULT'

const INIT_GET_NOT_SKIP_TRACED_COUNT = 'INIT_GET_NOT_SKIP_TRACED_COUNT'
const GET_NOT_SKIP_TRACED_COUNT = 'GET_NOT_SKIP_TRACED_COUNT'
const GET_NOT_SKIP_TRACED_COUNT_RESULT = 'GET_NOT_SKIP_TRACED_COUNT_RESULT'

export const initialState = () => fromJS({
  propertiesResult: {
    error: null,
    success: false,
    status: 200,
    loading: false,
    total: 0,
    page: 0,
    count: 0,
    count_per_page: 0,
    propertyListData: [],
  },
  mapPropertiesResult: {
    error: null,
    success: false,
    status: 200,
    loading: false,
    total: 0,
    page: 0,
    count: 0,
    count_per_page: 0,
    propertyListData: [],
  },
  propertyByAddressResult: {
    error: null,
    success: false,
    loading: false,
    item: null,
  },
  propertyByIdResult: {
    error: null,
    success: false,
    loading: false,
    propertyById: {},
  },
  propertyByDistanceResult: {
    error: null,
    success: false,
    loading: false,
    propertyByAddress: [],
  },
  propertyByLatLngResult: {
    error: null,
    success: false,
    loading: false,
    propertyByLatLng: {},
  },
  isAllPropertySelected: false,
  search: '',
  selectedProperty: {
    error: null,
    success: false,
    loading: false,
    item: {},
    skipTracing: {
      error: null,
      success: false,
      loading: false,
    },
    contact: {
      error: null,
      success: false,
      loading: false,
    },
    activities: {
      error: null,
      success: false,
      loading: false,
      total: 0,
      page: 0,
      count: 0,
      count_per_page: 0,
      items: [],
    },
  },
  mapFilter: {
    status: 'All Deals',
    skipTracing: { id: null, name: 'N/A' },
    owner: { id: null, name: 'All Owners' },
    folder: { id: null, name: 'Everything' },
    user: { id: null, name: 'EveryOne' },
    created_at: '',
  },
  listFilter: {
    status: 'All Deals',
    skipTracing: { id: null, name: 'N/A' },
    owner: { id: null, name: 'All Owners' },
    folder: { id: null, name: 'Everything' },
    user: { id: null, name: 'EveryOne' },
    created_at: '',
    tags: null,
  },
  mapOption: {
    searchMode: 'address', // can be 'address', 'city', 'region', 'zip', 'county'
    address: {},
    region: {
      visited: false,
      foreclosure_status: true,
      owner_status: null,
      on_market: null,
      vacant: false,
      tax_default: false,
      building: {
        min: 1900,
        max: 2020,
      },
      equity: {
        min: 0,
        max: 100,
      },
      dwelling_type: 'Residential',
      tired_landlord: false,
      inherited: false,
      unknown_equity: false,
      cash_buyer: false,
    },
    zip: {
      searchKey: '',
      visited: false,
      foreclosure_status: true,
      owner_status: null,
      on_market: null,
      vacant: false,
      tax_default: false,
      building: {
        min: 1900,
        max: 2020,
      },
      equity: {
        min: 0,
        max: 100,
      },
      dwelling_type: 'Residential',
      tired_landlord: false,
      inherited: false,
      unknown_equity: false,
      cash_buyer: false,
    },
    county: {
      searchKey: '',
      visited: false,
      foreclosure_status: true,
      owner_status: null,
      on_market: null,
      vacant: false,
      tax_default: false,
      building: {
        min: 1900,
        max: 2020,
      },
      equity: {
        min: 0,
        max: 100,
      },
      dwelling_type: 'Residential',
      tired_landlord: false,
      inherited: false,
      unknown_equity: false,
      cash_buyer: false,
    },
    city: {
      searchKey: '',
      visited: false,
      foreclosure_status: true,
      owner_status: null,
      on_market: null,
      vacant: false,
      tax_default: false,
      building: {
        min: 1900,
        max: 2020,
      },
      equity: {
        min: 0,
        max: 100,
      },
      dwelling_type: 'Residential',
      tired_landlord: false,
      inherited: false,
      unknown_equity: false,
      cash_buyer: false,
    },
  },
  mapSearchResult: {
    searchMode: 'region',
    error: null,
    success: false,
    loading: false,
    total: 0,
    page: 0,
    count: 0,
    count_per_page: 0,
    items: [],
  },
  saveSearchResult: {
    error: null,
    success: false,
    loading: false,
    data: {},
  },
  skipTracingMultiResult: {
    error: null,
    success: false,
    loading: false,
    data: {},
  },
  propertiesByPhoneNumberResult: {},
  deletePropertyMultiResult: {
    error: null,
    success: false,
    loading: false,
    data: {},
  },
  updateStatusMultiResult: {
    error: null,
    success: false,
    loading: false,
  },
  propertyTagResult: {
    error: null,
    success: false,
    loading: false,
    data: {},
  },
  updateFolderMultiResult: {
    error: null,
    success: false,
    loading: false,
  },
  stopPropertyCampaignsResult: {
    error: null,
    success: false,
    loading: false,
  },
  not_skip_traced_count: 0,
})

export const constants = {
  GET_PROPERTIES,
  GET_PROPERTIES_RESULT,
  GET_MAP_PROPERTIES,
  GET_MAP_PROPERTIES_RESULT,
  INIT_PROPERTY,
  GET_PROPERTYBYADDRESS,
  GET_PROPERTYBYADDRESS_RESULT,
  INIT_PROPERTYBYADDRESS,
  GET_PROPERTYBYID,
  GET_PROPERTYBYID_RESULT,
  SET_PROPERTY_SELECTED,
  SET_VISIBLE_PROPERTY_SELECTED,
  INIT_SELECTED_PROPERTIES,
  SET_ALL_PROPERTY_SELECTED,
  SET_CUSTOM_PROPERTY_SELECTED,
  INIT_PROPERTY_SEARCH,
  SET_PROPERTY_SEARCH,
  GET_PROPERTY_BY_DISTANCE,
  GET_PROPERTY_BY_DISTANCE_RESULT,
  INIT_PROPERTY_BY_DISTANCE,
  GET_PROPERTY_BY_LATLNG,
  GET_PROPERTY_BY_LATLNG_RESULT,
  INIT_PROPERTY_BY_LATLNG,
  CREATE_PROPERTY,
  CREATE_PROPERTY_RESULT,
  UPDATE_PROPERTY,
  UPDATE_PROPERTY_RESULT,
  DELETE_PROPERTY,
  DELTE_PROPERTY_RESULT,
  SELECT_PROPERTY,
  SET_MAP_PROPERTY_FILTER,
  SET_LIST_PROPERTY_FILTER,
  SKIP_TRACING_ITEM,
  SKIP_TRACING_ITEM_RESULT,
  ADD_CONTACT,
  ADD_CONTACT_RESULT,
  UPDATE_CONTACT,
  UPDATE_CONTACT_RESULT,
  DELETE_CONTACT,
  DELETE_CONTACT_RESULT,
  GET_PROPERTY_ACTIVITIES,
  ADD_PROPERTY_NOTE,
  INIT_MAP_SEARCH,
  GET_MAP_SEARCH,
  GET_MAP_SEARCH_RESULT,
  SAVE_SEARCHED_PROPERTIES,
  SAVE_SEARCHED_PROPERTIES_RESULT,
  INIT_SKIP_TRACING_MULTI,
  SKIP_TRACING_MULTI,
  SKIP_TRACING_MULTI_RESULT,
  GET_PROPERTIES_BY_PHONE_NUMBER,
  GET_PROPERTIES_BY_PHONE_NUMBER_RESULT,
  INIT_DELETE_PROPERTY_MULTI,
  DELETE_PROPERTY_MULTI,
  DELETE_PROPERTY_MULTI_RESULT,
  SAVE_SEARCHED_PROPERTIES_,
  SAVE_SEARCHED_PROPERTIES_RESULT_,
  INIT_UPDATE_STATUS_MULTI,
  UPDATE_STATUS_MULTI,
  UPDATE_STATUS_MULTI_RESULT,
  INIT_PROPERTY_TAG,
  UPDATE_PROPERTY_TAG,
  INIT_UPDATE_FOLDER_MULTI,
  UPDATE_FOLDER_MULTI,
  UPDATE_FOLDER_MULTI_RESULT,
  STOP_PROPERTY_CAMPAIGNS,
  STOP_PROPERTY_CAMPAIGNS_RESULT,
  INIT_GET_NOT_SKIP_TRACED_COUNT,
  GET_NOT_SKIP_TRACED_COUNT,
  GET_NOT_SKIP_TRACED_COUNT_RESULT,
}

// ------------------------------------
// Actions
// ------------------------------------
export const getpProperties = createAction(GET_PROPERTIES, (pageNumber, filters = null) => ({
  pageNumber,
  filters,
}))
export const gerPropertiesResult = createAction(
  GET_PROPERTIES_RESULT
)

export const getMapProperties = createAction(GET_MAP_PROPERTIES,
  (pageNumber, filters = null, fromMap = false) => ({ pageNumber, filters, fromMap }))
export const getMapPropertiesResult = createAction(
  GET_MAP_PROPERTIES_RESULT
)

export const initProperty = createAction(INIT_PROPERTY, () => ({}))

export const getPropertyByAddress = createAction(GET_PROPERTYBYADDRESS, (address) => (address))

export const getPropertyByAddressResult = createAction(
  GET_PROPERTYBYADDRESS_RESULT,
)
export const initPropertyByAddress = createAction(INIT_PROPERTYBYADDRESS)

export const getPropertyById = createAction(GET_PROPERTYBYID, (id) => ({ id }))
export const getPropertyByIdResult = createAction(
  GET_PROPERTYBYID_RESULT,
)

export const setPropertySelected = createAction(SET_PROPERTY_SELECTED, (property) => ({
  property,
}))

export const setVisiblePropertySelected = createAction(SET_VISIBLE_PROPERTY_SELECTED, () => ({}))

export const initSelectedProperties = createAction(INIT_SELECTED_PROPERTIES, () => ({}))

export const setAllPropertySelected = createAction(
  SET_ALL_PROPERTY_SELECTED, (selected) => ({ selected })
)

export const setCustomPropertySelected = createAction(SET_CUSTOM_PROPERTY_SELECTED, (count) => (
  { count }))

export const initPropertySearch = createAction(INIT_PROPERTY_SEARCH, () => ({}))
export const setPropertySearch = createAction(SET_PROPERTY_SEARCH, (search) => ({ search }))

export const getPropertyByDistance = createAction(GET_PROPERTY_BY_DISTANCE,
  (lat, lon, rad = 10) => ({ lat, lon, rad }))
export const getPropertyByDistanceResult = createAction(
  GET_PROPERTY_BY_DISTANCE_RESULT,
)
export const initPropertyByDistance = createAction(INIT_PROPERTY_BY_DISTANCE, () => ({}))

export const getPropertyByLatLng = createAction(GET_PROPERTY_BY_LATLNG,
  (lat, lon) => ({ lat, lon }))
export const getPropertyByLatLngResult = createAction(
  GET_PROPERTY_BY_LATLNG_RESULT,
)
export const initPropertyByLatLng = createAction(INIT_PROPERTY_BY_LATLNG, () => ({}))

export const createProperty = createAction(CREATE_PROPERTY, (property) => ({ property }))
export const createPropertyResult = createAction(CREATE_PROPERTY_RESULT)

export const updateProperty = createAction(UPDATE_PROPERTY, ((property) => ({ property })))
export const updatePropertyResult = createAction(UPDATE_PROPERTY_RESULT)

export const deleteProperty = createAction(DELETE_PROPERTY, ((id) => ({ id })))
export const deletePropertyResult = createAction(DELTE_PROPERTY_RESULT)

export const selectProperty = createAction(SELECT_PROPERTY, (property) => ({ property }))

export const setMapPropertyFilter = createAction(SET_MAP_PROPERTY_FILTER, (filter) => ({ filter }))
export const setListPropertyFilter = createAction(
  SET_LIST_PROPERTY_FILTER, (filter) => ({ filter })
)

export const skipTracingItem = createAction(SKIP_TRACING_ITEM, (id) => ({ id }))
export const skipTracingItemResult = createAction(SKIP_TRACING_ITEM_RESULT)

export const addContact = createAction(ADD_CONTACT, ((type, contact) => ({ type, contact })))
export const addContactResult = createAction(ADD_CONTACT_RESULT)
export const deleteContact = createAction(DELETE_CONTACT, ((type, id) => ({ type, id })))
export const deleteContactResult = createAction(DELETE_CONTACT_RESULT)
export const updateContact = createAction(UPDATE_CONTACT, ((type, contact) => ({ type, contact })))
export const updateContactResult = createAction(UPDATE_CONTACT_RESULT)

export const initPropertyActivities = createAction(INIT_PROPERTY_ACTIVITIES)
export const getPropertyActivities = createAction(
  GET_PROPERTY_ACTIVITIES, (id, page) => ({ id, page })
)
export const getPropertyActivitiesResult = createAction(GET_PROPERTY_ACTIVITIES_RESULT)
export const addPropertyNote = createAction(
  ADD_PROPERTY_NOTE, (id, note) => ({ id, note })
)
export const addPropertyNoteResult = createAction(ADD_PROPERTY_NOTE_RESULT)

export const updateMapOption = createAction(UPDATE_SEARCH_MODE)
export const updateSearchModeFilter = createAction(UPDATE_SEARCH_MODE_FILTER)

export const initMapSearch = createAction(INIT_MAP_SEARCH, (searchMode) => ({ searchMode }))
export const getMapSearch = createAction(
  GET_MAP_SEARCH,
  (page, searchMode, coords, filter, zip, county) => ({
    page, searchMode, coords, filter, zip, county,
  })
)
export const getMapSearchResult = createAction(GET_MAP_SEARCH_RESULT)
export const saveSearchedProperties = createAction(
  SAVE_SEARCHED_PROPERTIES,
  (folderId, properties) => ({ folderId, properties })
)
export const saveSearchedPropertiesResult = createAction(SAVE_SEARCHED_PROPERTIES_RESULT)

export const initSkipTracingMulti = createAction(INIT_SKIP_TRACING_MULTI)
export const skipTracingMulti = createAction(
  SKIP_TRACING_MULTI,
  (isAll, properties, filter, excludedPropertyIds) => ({
    isAll, properties, filter, excludedPropertyIds,
  })
)
export const skipTracingMultiResult = createAction(SKIP_TRACING_MULTI_RESULT)

export const getPropertiesByPhoneNumber = createAction(
  GET_PROPERTIES_BY_PHONE_NUMBER,
  (phoneNumber) => ({ phoneNumber })
)
export const getPropertiesByPhoneNumberResult = createAction(GET_PROPERTIES_BY_PHONE_NUMBER_RESULT)

export const initDeletePropertyMulti = createAction(INIT_DELETE_PROPERTY_MULTI)
export const deletePropertyMulti = createAction(
  DELETE_PROPERTY_MULTI,
  (payload) => ({ ...payload })
)
export const deletePropertyMultiResult = createAction(DELETE_PROPERTY_MULTI_RESULT)

export const saveSearchedProperties_ = createAction(
  SAVE_SEARCHED_PROPERTIES_,
  (folderId, searchMode, filter, excludedPropertyHashes, total) => ({
    folderId, searchMode, filter, excludedPropertyHashes, total,
  })
)
export const saveSearchedPropertiesResult_ = createAction(SAVE_SEARCHED_PROPERTIES_RESULT_)

export const initUpdateStatusMulti = createAction(INIT_UPDATE_STATUS_MULTI)
export const updateStatusMulti = createAction(
  UPDATE_STATUS_MULTI,
  (payload) => ({ ...payload })
)
export const updateStatusMultiResult = createAction(UPDATE_STATUS_MULTI_RESULT)

export const initPropertyTag = createAction(INIT_PROPERTY_TAG)
export const updatePropertyTag = createAction(UPDATE_PROPERTY_TAG, (payload) => ({ ...payload }))
export const updatePropertyTagResult = createAction(UPDATE_PROPERTY_TAG_RESULT)

export const initUpdateFolderMulti = createAction(INIT_UPDATE_FOLDER_MULTI)
export const updateFolderMulti = createAction(
  UPDATE_FOLDER_MULTI,
  (payload) => ({ ...payload })
)
export const updateFolderMultiResult = createAction(UPDATE_FOLDER_MULTI_RESULT)

export const stopPropertyCampaigns = createAction(STOP_PROPERTY_CAMPAIGNS, (id) => ({ id }))
export const stopPropertyCampaignsResult = createAction(STOP_PROPERTY_CAMPAIGNS_RESULT)

export const initGetNotSkipTracedCount = createAction(INIT_GET_NOT_SKIP_TRACED_COUNT, () => ({}))
export const getNotSkipTracedCount = createAction(
  GET_NOT_SKIP_TRACED_COUNT, (propertyIds, filter, excludedPropertyIds) => ({
    property_ids: propertyIds,
    filter,
    excluded_property_ids: excludedPropertyIds,
  })
)
export const getNotSkipTracedCountResult = createAction(
  GET_NOT_SKIP_TRACED_COUNT_RESULT,
)

export const actions = {
  getpProperties,
  gerPropertiesResult,
  getMapProperties,
  getMapPropertiesResult,
  initProperty,
  getPropertyByAddress,
  getPropertyByAddressResult,
  initPropertyByAddress,
  getPropertyById,
  getPropertyByIdResult,
  setPropertySelected,
  setVisiblePropertySelected,
  setCustomPropertySelected,
  initSelectedProperties,
  setAllPropertySelected,
  initPropertySearch,
  setPropertySearch,
  getPropertyByDistance,
  getPropertyByDistanceResult,
  getPropertyByLatLng,
  getPropertyByLatLngResult,
  createProperty,
  createPropertyResult,
  updateProperty,
  updatePropertyResult,
  deleteProperty,
  deletePropertyResult,
  initPropertyByDistance,
  selectProperty,
  setMapPropertyFilter,
  skipTracingItem,
  skipTracingItemResult,
  addContact,
  addContactResult,
  updateContact,
  updateContactResult,
  deleteContact,
  deleteContactResult,
  initPropertyActivities,
  getPropertyActivities,
  getPropertyActivitiesResult,
  addPropertyNote,
  addPropertyNoteResult,
  updateMapOption,
  updateSearchModeFilter,
  initMapSearch,
  getMapSearch,
  getMapSearchResult,
  saveSearchedProperties,
  saveSearchedPropertiesResult,
  initSkipTracingMulti,
  skipTracingMulti,
  skipTracingMultiResult,
  getPropertiesByPhoneNumber,
  getPropertiesByPhoneNumberResult,
  initDeletePropertyMulti,
  deletePropertyMulti,
  deletePropertyMultiResult,
  saveSearchedProperties_,
  saveSearchedPropertiesResult_,
  initUpdateStatusMulti,
  updateStatusMulti,
  updateStatusMultiResult,
  initPropertyTag,
  updatePropertyTag,
  updatePropertyTagResult,
  initUpdateFolderMulti,
  updateFolderMulti,
  updateFolderMultiResult,
  stopPropertyCampaigns,
  stopPropertyCampaignsResult,
  initGetNotSkipTracedCount,
  getNotSkipTracedCount,
  getNotSkipTracedCountResult,
}

export const reducers = {
  [GET_PROPERTIES]: (state) => {
    return state.mergeDeep({
      propertiesResult: {
        loading: true,
      },
    })
  },
  [GET_PROPERTIES_RESULT]: (state, { payload }) => {
    const resultState = state.get('propertiesResult').toJS()
    const { propertyListData } = resultState
    const isAllPropertySelected = state.get('isAllPropertySelected')
    const result = payload.propertyListData ? payload.propertyListData : null
    let newResult = null
    if (result) {
      newResult = result.map((item) => {
        return {
          ...item,
          selected: isAllPropertySelected,
        }
      })
      const { page } = payload
      if (Number(page) === 1) {
        return state.set('propertiesResult', fromJS({
          ...payload,
          propertyListData: newResult,
        }))
      }
      return state.mergeDeep({
        propertiesResult: {
          ...payload,
          propertyListData: propertyListData ? propertyListData.concat(newResult) : newResult,
        },
      })
    }
    return state.mergeDeep({
      propertiesResult: {
        ...payload,
      },
    })
  },
  [GET_MAP_PROPERTIES]: (state) => {
    return state.mergeDeep({
      mapPropertiesResult: {
        loading: true,
      },
    })
  },
  [GET_MAP_PROPERTIES_RESULT]: (state, { payload }) => {
    const resultState = state.get('mapPropertiesResult').toJS()
    const { propertyListData } = resultState
    const result = payload.propertyListData || null
    if (result) {
      const { page } = payload
      if (Number(page) === 1) {
        return state.set('mapPropertiesResult', fromJS({
          ...payload,
          propertyListData: result,
        }))
      }
      return state.set('mapPropertiesResult', fromJS({
        ...payload,
        propertyListData: propertyListData ? [...propertyListData, ...result] : result,
      }))
    }
    return state.mergeDeep({
      mapPropertiesResult: {
        ...payload,
      },
    })
  },
  [INIT_PROPERTY]: (state) => {
    const selectedProperty = state.get('selectedProperty').toJS()
    return state.merge({
      propertiesResult: {
        error: null,
        success: false,
        status: 200,
        loading: false,
        total: 0,
        page: 0,
        count: 0,
        count_per_page: 0,
        propertyListData: [],
      },
      selectedProperty: {
        ...selectedProperty,
        loading: false,
        success: false,
        error: null,
        skipTracing: {
          error: null,
          success: false,
          loading: false,
        },
        contact: {
          error: null,
          success: false,
          loading: false,
        },
        activities: {
          error: null,
          success: false,
          loading: false,
          total: 0,
          page: 0,
          count: 0,
          count_per_page: 0,
          items: [],
        },
      },
    })
  },
  [GET_PROPERTYBYADDRESS]: (state) => {
    return state.merge({
      propertyByAddressResult: {
        loading: true,
        success: false,
        error: null,
        item: null,
      },
    })
  },
  [GET_PROPERTYBYADDRESS_RESULT]: (state, { payload }) => {
    return state
      .merge({
        propertyByAddressResult: {
          ...payload,
        },
        propertyByLatLngResult: {
          ...payload,
          propertyByLatLng: payload.item,
        },
      })
  },
  [INIT_PROPERTYBYADDRESS]: (state) => {
    return state
      .set('propertyByAddressResult', fromJS(initialState().toJS().propertyByAddressResult))
      .merge({ propertyByLatLngResult: fromJS({ loading: false, error: null, success: false }) })
  },

  [GET_PROPERTYBYID]: (state) => {
    return state.merge(Map({
      propertyByIdResult: {
        loading: true,
      },
    }))
  },
  [GET_PROPERTYBYID_RESULT]: (state, { payload }) => {
    const mapState = state.get('mapPropertiesResult')
    const mapData = mapState.get('propertyListData').toJS() || []
    const newMapData = mapData.map((item) => (
      item.id === payload.propertyById.id ? payload.propertyById : item
    ))

    const selectedProperty = state.get('selectedProperty').toJS()
    return state
      .set('mapPropertiesResult', fromJS({ ...mapState, propertyListData: newMapData }))
      .set('selectedProperty', fromJS({
        ...selectedProperty,
        item: payload.propertyById,
      }))
      .merge(Map({
        propertyByIdResult: {
          ...payload,
        },
      }))
  },
  [SET_PROPERTY_SELECTED]: (state, { payload }) => {
    const { property } = payload
    property.selected = !property.selected

    const resultState = state.get('propertiesResult')
    const propertyListData = resultState.get('propertyListData').toJS()
    const newData = propertyListData.map((item) => (item.id === property.id ? property : item))

    return state.mergeDeep({
      propertiesResult: {
        propertyListData: newData,
      },
    })
  },
  [SET_VISIBLE_PROPERTY_SELECTED]: (state) => {
    const resultState = state.get('propertiesResult')
    const propertyListData = resultState.get('propertyListData').toJS()
    const newData = propertyListData.map((item) => ({ ...item, selected: true }))

    return state.mergeDeep({
      propertiesResult: {
        propertyListData: newData,
      },
      isAllPropertySelected: false,
    })
  },
  [INIT_SELECTED_PROPERTIES]: (state) => state.merge({
    isAllPropertySelected: false,
  }),
  [SET_ALL_PROPERTY_SELECTED]: (state, { payload }) => {
    const { selected } = payload
    const resultState = state.get('propertiesResult')
    const propertyListData = resultState.get('propertyListData').toJS()
    const newData = propertyListData.map((item) => {
      return {
        ...item,
        selected,
      }
    })

    return state.mergeDeep({
      propertiesResult: {
        propertyListData: newData,
      },
      isAllPropertySelected: selected,
    })
  },
  [SET_CUSTOM_PROPERTY_SELECTED]: (state, { payload }) => {
    const { count } = payload
    const resultState = state.get('propertiesResult')
    const propertyListData = resultState.get('propertyListData').toJS()
    const newData = propertyListData.map((item, index) => {
      return { ...item, selected: count > index }
    })
    return state.mergeDeep({
      propertiesResult: {
        propertyListData: newData,
      },
      isAllPropertySelected: false,
    })
  },
  [INIT_PROPERTY_SEARCH]: (state) => state.merge({
    search: '',
    isAllPropertySelected: false,
  }),
  [SET_PROPERTY_SEARCH]: (state, { payload }) => state.merge({
    search: payload.search,
    isAllPropertySelected: false,
  }),
  [GET_PROPERTY_BY_DISTANCE]: (state, { payload }) => {
    const { lat, lon } = payload
    return state.merge(Map({
      propertyByDistanceResult: {
        loading: true,
        latitude: lat,
        longitude: lon,
      },
    }))
  },
  [GET_PROPERTY_BY_DISTANCE_RESULT]: (state, { payload }) => {
    const propertyByDistanceResult = state.get('propertyByDistanceResult')
    return state.merge(Map({
      propertyByDistanceResult: {
        ...propertyByDistanceResult,
        ...payload,
      },
    }))
  },
  [INIT_PROPERTY_BY_DISTANCE]: (state) => {
    return state.merge(Map({
      propertyByDistanceResult: {
        success: true,
        error: null,
      },
    }))
  },
  [GET_PROPERTY_BY_LATLNG]: (state) => state.setIn(
    ['propertyByLatLngResult'],
    fromJS({
      loading: true, success: false, error: null, propertyByLatLng: {},
    }),
  ),
  [GET_PROPERTY_BY_LATLNG_RESULT]: (state, { payload }) => {
    return state.merge(Map({
      propertyByLatLngResult: fromJS({
        ...payload,
      }),
    }))
  },
  [INIT_PROPERTY_BY_LATLNG]: (state) => state.setIn(
    ['propertyByLatLngesult'],
    fromJS({
      loading: false, success: false, error: null, propertyByLatLng: {},
    }),
  ),
  [CREATE_PROPERTY]: (state) => state.mergeDeep({
    selectedProperty: {
      loading: true,
      success: false,
      error: null,
    },
  }),
  [CREATE_PROPERTY_RESULT]: (state, { payload }) => {
    const resultState = state.get('propertiesResult')
    const propertyListData = resultState.get('propertyListData').toJS() || []
    const mapResultState = state.get('mapPropertiesResult')
    const mapPropertyListData = mapResultState.get('propertyListData').toJS() || []
    if (payload.error) {
      return state.mergeDeep(fromJS({
        selectedProperty: {
          ...payload,
        },
      }))
    }
    return state.mergeDeep(fromJS({
      selectedProperty: {
        ...payload,
      },
      mapPropertiesResult: {
        propertyListData: mapPropertyListData.concat([payload.item]),
      },
      propertiesResult: {
        propertyListData: propertyListData.concat([payload.item]),
      },
    }))
  },

  [UPDATE_PROPERTY]: (state) => state.mergeDeep({
    selectedProperty: {
      loading: true,
      success: false,
      error: null,
    },
  }),
  [UPDATE_PROPERTY_RESULT]: (state, { payload }) => {
    const mapState = state.get('mapPropertiesResult')
    const mapData = mapState.get('propertyListData').toJS() || []
    const newMapData = mapData.map((item) => (item.id === payload.item.id ? payload.item : item))
    if (payload.error) {
      return state.mergeDeep({ selectedProperty: { ...payload } })
    }
    return state
      .set('mapPropertiesResult', fromJS({ ...mapState, propertyListData: newMapData }))
      .mergeDeep({ selectedProperty: { ...payload } })
      .setIn(['selectedProperty', 'item'], payload.item)
  },

  [DELETE_PROPERTY]: (state) => state.mergeDeep({
    selectedProperty: {
      loading: true,
      success: false,
      error: null,
    },
  }),
  [DELTE_PROPERTY_RESULT]: (state, { payload }) => {
    const mapState = state.get('mapPropertiesResult')
    const mapData = mapState.get('propertyListData').toJS() || []
    const newMapData = mapData.filter((item) => item.id !== payload.id)
    const listState = state.get('propertiesResult')
    const listData = listState.get('propertyListData').toJS() || []
    const newListData = listData.filter((item) => item.id !== payload.id)
    if (payload.error) {
      return state.mergeDeep({ selectedProperty: { ...payload } })
    }
    return state
      .set('mapPropertiesResult', fromJS({ ...mapState, propertyListData: newMapData }))
      .set('propertiesResult', fromJS({ ...listState, propertyListData: newListData }))
      .set('selectedProperty', fromJS({ ...payload }))
  },

  [SELECT_PROPERTY]: (state, { payload }) => state.set('selectedProperty', fromJS({
    loading: false,
    success: false,
    error: null,
    item: payload.property,
    skipTracing: initialState().toJS().selectedProperty.skipTracing,
    contact: initialState().toJS().selectedProperty.contact,
    activities: initialState().toJS().selectedProperty.activities,
  })),

  [SET_MAP_PROPERTY_FILTER]: (state, { payload }) => state.set('mapFilter', fromJS(payload.filter)),
  [SET_LIST_PROPERTY_FILTER]: (state, { payload }) => state
    .setIn(
      ['listFilter'], fromJS(payload.filter)
    ),

  [SKIP_TRACING_ITEM]: (state) => state.mergeDeep({
    selectedProperty: {
      skipTracing: {
        loading: true,
        success: false,
        error: null,
      },
    },
  }),
  [SKIP_TRACING_ITEM_RESULT]: (state, { payload }) => {
    if (payload.error) {
      return state.mergeDeep({ selectedProperty: { skipTracing: { ...payload } } })
    }
    return state.mergeDeep({
      selectedProperty: {
        skipTracing: { ...payload },
        item: { ...payload.result },
      },
    })
  },

  [ADD_CONTACT]: (state) => state.mergeDeep({
    selectedProperty: {
      contact: { loading: true, success: false, error: null },
    },
  }),
  [ADD_CONTACT_RESULT]: (state, { payload }) => {
    if (payload.error) return state.mergeDeep({ selectedProperty: { contact: { ...payload } } })
    const selectedProperty = state.get('selectedProperty').toJS()
    const type = payload.type === 'Email' ? 'emails' : 'phones'
    selectedProperty.item = {
      ...selectedProperty.item,
      [type]: selectedProperty.item[type].concat(payload.result),
    }
    return state
      .set('selectedProperty', fromJS(selectedProperty))
      .mergeDeep({ selectedProperty: { contact: { ...payload } } })
  },

  [UPDATE_CONTACT]: (state) => state.mergeDeep({
    selectedProperty: {
      contact: { loading: true, success: false, error: null },
    },
  }),
  [UPDATE_CONTACT_RESULT]: (state, { payload }) => {
    if (payload.error) return state.mergeDeep({ selectedProperty: { contact: { ...payload } } })
    const selectedProperty = state.get('selectedProperty').toJS()
    const type = payload.type === 'Email' ? 'emails' : 'phones'
    selectedProperty.item[type] = selectedProperty.item[type].map((contact) => (
      contact.id === payload.result.id ? payload.result : contact
    ))
    return state
      .set('selectedProperty', fromJS(selectedProperty))
      .mergeDeep({ selectedProperty: { contact: { ...payload } } })
  },

  [DELETE_CONTACT]: (state) => state.mergeDeep({
    selectedProperty: {
      contact: { loading: true, success: false, error: null },
    },
  }),
  [DELETE_CONTACT_RESULT]: (state, { payload }) => {
    if (payload.error) return state.mergeDeep({ selectedProperty: { contact: { ...payload } } })
    const selectedProperty = state.get('selectedProperty').toJS()
    const type = payload.type === 'Email' ? 'emails' : 'phones'
    selectedProperty.item[type] = selectedProperty.item[type].filter(
      (contact) => contact.id !== payload.id
    )
    return state
      .set('selectedProperty', fromJS(selectedProperty))
      .mergeDeep({ selectedProperty: { contact: { ...payload } } })
  },

  [INIT_PROPERTY_ACTIVITIES]: (state) => state.setIn(['selectedProperty', 'activities', 'items'], []),
  [GET_PROPERTY_ACTIVITIES]: (state) => {
    return state.mergeDeep({
      selectedProperty: {
        activities: {
          loading: true, success: false, error: null,
        },
      },
    })
  },
  [GET_PROPERTY_ACTIVITIES_RESULT]: (state, { payload }) => {
    if (payload.error) return state.mergeDeep({ selectedProperty: { activities: { ...payload } } })
    const path = ['selectedProperty', 'activities', 'items']
    const originItems = state.getIn(path)
    return state
      .mergeDeep({ selectedProperty: { activities: { ...payload } } })
      .setIn(path, [...originItems, ...payload.items])
  },
  [ADD_PROPERTY_NOTE]: (state, { payload }) => {
    const path = ['selectedProperty', 'activities', 'items']
    return state.setIn(path, [{ description: payload.note }, ...state.getIn(path)])
  },
  [ADD_PROPERTY_NOTE_RESULT]: (state, { payload }) => {
    const path = ['selectedProperty', 'activities', 'items']
    if (payload.error) {
      return state
    }
    const newItems = [payload.result, ...state.getIn(path).filter((a) => a.id)]
    return state.setIn(path, newItems)
  },

  [UPDATE_SEARCH_MODE]: (state, { payload }) => state.setIn(['mapOption', 'searchMode'], payload.type),
  [UPDATE_SEARCH_MODE_FILTER]: (state, { payload }) => state
    .setIn(['mapOption', payload.type, payload.key], payload.value)
    .setIn(['mapSearchResult', 'success'], false),

  [INIT_MAP_SEARCH]: (state, { payload }) => {
    return state
      .setIn(['mapSearchResult'], fromJS({ ...initialState().toJS().mapSearchResult, searchMode: payload.searchMode }))
      .setIn(['saveSearchResult'], fromJS({ loading: false, success: false, error: null }))
  },
  [GET_MAP_SEARCH]: (state, payload) => {
    const mapSearchResult = state.get('mapSearchResult').toJS()
    const { page, items } = mapSearchResult
    return state.merge({
      mapSearchResult: {
        searchMode: payload.searchMode,
        loading: true,
        success: false,
        error: null,
        items: page === 0 ? [] : items, // to disable pagination temporarily
      },
    })
  },
  [GET_MAP_SEARCH_RESULT]: (state, { payload }) => {
    if (payload.error) return state.mergeDeep({ mapSearchResult: { ...payload } })
    const { page } = payload
    if (Number(page) === 1) {
      return state.set('mapSearchResult', fromJS({ ...payload }))
    }
    const mapSearchResult = state.get('mapSearchResult').toJS()
    const { items } = mapSearchResult
    const properties = items.concat(payload.items)
    // const path = ['mapSearchResult', 'items']
    // const originItems = state.getIn(path)
    return state
      .mergeDeep({ mapSearchResult: { ...payload, items: properties } })
    // .setIn(path, [...originItems, ...payload.items])
  },
  [SAVE_SEARCHED_PROPERTIES]: (state) => state.setIn(
    ['saveSearchResult'],
    fromJS({ loading: true, success: false, error: null }),
  ),
  [SAVE_SEARCHED_PROPERTIES_RESULT]: (state, { payload }) => state.setIn(
    ['saveSearchResult'],
    fromJS({ ...payload }),
  ),

  [INIT_SKIP_TRACING_MULTI]: (state) => state.setIn(
    ['skipTracingMultiResult'],
    fromJS({
      loading: false, success: false, error: null, data: {},
    }),
  ),
  [SKIP_TRACING_MULTI]: (state) => state.setIn(
    ['skipTracingMultiResult'],
    fromJS({
      loading: true, success: false, error: null, data: {},
    }),
  ),
  [SKIP_TRACING_MULTI_RESULT]: (state, { payload }) => state.setIn(
    ['skipTracingMultiResult'],
    fromJS({ ...payload }),
  ),
  [GET_PROPERTIES_BY_PHONE_NUMBER]: (state) => {
    return state.set('propertiesByPhoneNumberResult', fromJS({}))
  },
  [GET_PROPERTIES_BY_PHONE_NUMBER_RESULT]: (state, { payload }) => state.setIn(
    ['propertiesByPhoneNumberResult'],
    fromJS({ ...payload }),
  ),
  [INIT_DELETE_PROPERTY_MULTI]: (state) => state.setIn(
    ['deletePropertyMultiResult'],
    fromJS({
      loading: false, success: false, error: null, data: {},
    }),
  ),
  [DELETE_PROPERTY_MULTI]: (state) => state.setIn(
    ['deletePropertyMultiResult'],
    fromJS({
      loading: true, success: false, error: null, data: {},
    }),
  ),
  [DELETE_PROPERTY_MULTI_RESULT]: (state, { payload }) => state.setIn(
    ['deletePropertyMultiResult'],
    fromJS({ ...payload }),
  ),
  [SAVE_SEARCHED_PROPERTIES_]: (state) => state.setIn(
    ['saveSearchResult'],
    fromJS({ loading: true, success: false, error: null }),
  ),
  [SAVE_SEARCHED_PROPERTIES_RESULT_]: (state, { payload }) => state.setIn(
    ['saveSearchResult'],
    fromJS({ ...payload }),
  ),
  [INIT_UPDATE_STATUS_MULTI]: (state) => state.setIn(
    ['updateStatusMultiResult'],
    fromJS({
      loading: false, success: false, error: null, data: {},
    }),
  ),
  [UPDATE_STATUS_MULTI]: (state) => state.setIn(
    ['updateStatusMultiResult'],
    fromJS({
      loading: true, success: false, error: null, data: {},
    }),
  ),
  [UPDATE_STATUS_MULTI_RESULT]: (state, { payload }) => state.setIn(
    ['updateStatusMultiResult'],
    fromJS({ ...payload }),
  ),
  [INIT_PROPERTY_TAG]: (state) => state.setIn(
    ['propertyTagResult'],
    fromJS({
      loading: false, success: false, error: null, data: {},
    }),
  ),
  [UPDATE_PROPERTY_TAG]: (state) => state.setIn(
    ['propertyTagResult'],
    fromJS({
      loading: true, success: false, error: null, data: {},
    }),
  ),
  [UPDATE_PROPERTY_TAG_RESULT]: (state, { payload }) => {
    if (payload.error) {
      return state.setIn(['propertyTagResult'], fromJS({ ...payload }));
    }
    const { tags } = state.get('selectedProperty').toJS().item
    let newTags = [];
    if (payload.id) {
      newTags = tags.filter((item) => item.id !== payload.id)
    } else {
      newTags = [payload.data, ...tags]
    }
    return state
      .setIn(['propertyTagResult'], fromJS({ ...payload }))
      .setIn(['selectedProperty', 'item', 'tags'], fromJS(newTags));
  },
  [INIT_UPDATE_FOLDER_MULTI]: (state) => state.setIn(
    ['updateFolderMultiResult'],
    fromJS({
      loading: false, success: false, error: null, data: {},
    }),
  ),
  [UPDATE_FOLDER_MULTI]: (state) => state.setIn(
    ['updateFolderMultiResult'],
    fromJS({
      loading: true, success: false, error: null, data: {},
    }),
  ),
  [UPDATE_FOLDER_MULTI_RESULT]: (state, { payload }) => state.setIn(
    ['updateFolderMultiResult'],
    fromJS({ ...payload }),
  ),
  [STOP_PROPERTY_CAMPAIGNS]: (state) => state.setIn(
    ['stopPropertyCampaignsResult'],
    fromJS({
      loading: true, success: false, error: null,
    }),
  ),
  [STOP_PROPERTY_CAMPAIGNS_RESULT]: (state, { payload }) => {
    if (payload.error) {
      return state.setIn(['stopPropertyCampaignsResult'], fromJS({ ...payload }));
    }
    return state
      .setIn(['stopPropertyCampaignsResult'], fromJS({ ...payload }))
      .setIn(['selectedProperty', 'item', 'sms_campaign_count'], 0)
      .setIn(['selectedProperty', 'item', 'mail_campaign_count'], 0);
  },
  [INIT_GET_NOT_SKIP_TRACED_COUNT]: (state) => state.merge({
    not_skip_traced_count: 0,
  }),
  [GET_NOT_SKIP_TRACED_COUNT]: (state) => state.merge({
    not_skip_traced_count: 0,
  }),
  [GET_NOT_SKIP_TRACED_COUNT_RESULT]: (state, { payload }) => {
    const { data } = payload

    return state.merge({
      not_skip_traced_count: data,
    })
  },
}

export default handleActions(reducers, initialState())
