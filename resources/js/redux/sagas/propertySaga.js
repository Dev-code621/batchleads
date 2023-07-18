import {
  put, fork, takeLatest, call,
} from 'redux-saga/effects'
import {
  constants as propertyConstants,
  actions as propertyActions,
} from '../modules/property'
import {
  getPropertyList,
  getPropertyByAddress,
  getPropertyId,
  getPropertyByDistance,
  getPropertyByLatLng,
  createNewProperty,
  updatePropertyApi,
  deletePropertyApi,
  skipTracingItemApi,
  addContactApi,
  deleteContactApi,
  updateContactApi,
  getPropertyActivitiesApi,
  addPropertyNoteApi,
  getMapRegionSearchApi,
  getMapZipSearchApi,
  getMapCountySearchApi,
  saveSearchedResultApi,
  // skipTracingAllApi,
  skipTracingMultiApi,
  getPropertiesByPhoneNumber,
  deletePropertyMultiApi,
  saveSearchedResultApi_,
  updateStatusMultiApi,
  createPropertyTagApi,
  deletePropertyTagApi,
  updateFolderMultiApi,
  stopPropertyCampaignsApi,
  getNotSkipTracedPropertyCountApi,
} from '../../common/api/module/property'
import {
  actions as userActions,
} from '../modules/user'

export function* propertyList({ payload }) {
  const getResult = payload && payload.fromMap
    ? propertyActions.getMapPropertiesResult
    : propertyActions.gerPropertiesResult
  try {
    const { pageNumber, filters } = payload
    const response = yield call(getPropertyList, { pageNumber, filters })
    const { data } = response.data
    if (response.status === 200) {
      yield put(
        getResult({
          error: null,
          loading: false,
          success: true,
          page: data.page,
          total: data.total,
          count: data.count,
          count_per_page: data.count_per_page,
          propertyListData: data.data,
        })
      )
    }
  } catch (error) {
    if (error.response) {
      const { status } = error.response
      if (status === 401) {
        yield put(userActions.initUserResult())
      }
      yield put(
        getResult({
          error: null,
          success: false,
          status: 200,
          loading: false,
          total: 0,
          page: 0,
          count: 0,
          count_per_page: 0,
          propertyListData: [],
        })
      )
    } else {
      yield put(
        getResult({
          error: null,
          success: false,
          status: 200,
          loading: false,
          total: 0,
          page: 0,
          count: 0,
          count_per_page: 0,
          propertyListData: [],
        })
      )
    }
  }
}

export function* propertyByAddress({ payload }) {
  try {
    const {
      street, state, zip, city,
    } = payload
    const response = yield call(getPropertyByAddress, {
      street, state, zip, city,
    })
    if (response.status === 200) {
      yield put(
        propertyActions.getPropertyByAddressResult({
          error: null,
          success: true,
          loading: false,
          item: response.data.data,
        })
      )
    }
  } catch (error) {
    const { status } = error.response
    if (status === 401) {
      yield put(userActions.initUserResult())
    }
    yield put(
      propertyActions.getPropertyByAddressResult({
        loading: false,
        success: false,
        error,
        item: null,
      })
    )
  }
}

export function* propertyByDistance({ payload }) {
  try {
    const { lat, lon, rad } = payload
    const response = yield call(getPropertyByDistance, { lat, lon, rad })
    if (response.status === 200) {
      yield put(
        propertyActions.getPropertyByDistanceResult({
          error: null,
          success: true,
          loading: false,
          propertyByDistance: response.data.data.items,
        })
      )
    }
  } catch (error) {
    const { status } = error.response
    if (status === 401) {
      yield put(userActions.initUserResult())
    }
    yield put(
      propertyActions.getPropertyByDistanceResult({
        error,
        success: false,
        loading: false,
      })
    )
  }
}

export function* propertyByLatLng({ payload }) {
  try {
    const { lat, lon } = payload
    const response = yield call(getPropertyByLatLng, { lat, lon })
    if (response.status === 200) {
      yield put(
        propertyActions.getPropertyByLatLngResult({
          error: null,
          success: true,
          loading: false,
          propertyByLatLng: response.data.data,
        })
      )
    }
  } catch (error) {
    const { status } = error.response
    if (status === 401) {
      yield put(userActions.initUserResult())
    }
    yield put(
      propertyActions.getPropertyByLatLngResult({
        error,
        success: false,
        loading: false,
      })
    )
  }
}

export function* propertyById({ payload }) {
  try {
    const { id } = payload
    const response = yield call(getPropertyId, { id })
    if (response.status === 200) {
      yield put(
        propertyActions.getPropertyByIdResult({
          error: null,
          success: true,
          loading: false,
          propertyById: response.data.data,
        })
      )
    }
  } catch (error) {
    yield put(
      propertyActions.getPropertyByIdResult({
        error,
      })
    )
  }
}

export function* createProperty({ payload }) {
  try {
    const { property } = payload
    const response = yield call(createNewProperty, { property })
    if (response.status === 200) {
      yield put(
        propertyActions.createPropertyResult({
          error: null,
          success: true,
          loading: false,
          item: response.data.data,
        })
      )
    }
  } catch (error) {
    const { status } = error.response
    if (status === 401) {
      yield put(userActions.initUserResult())
    }
    yield put(
      propertyActions.createPropertyResult({
        error,
        success: false,
        loading: false,
      })
    )
  }
}

export function* updateProperty({ payload }) {
  try {
    const { property } = payload
    const response = yield call(updatePropertyApi, { property })
    if (response.status === 200) {
      yield put(
        propertyActions.updatePropertyResult({
          error: null,
          success: true,
          loading: false,
          item: response.data.data,
        })
      )
    }
  } catch (error) {
    const { status } = error.response
    if (status === 401) {
      yield put(userActions.initUserResult())
    }
    yield put(
      propertyActions.updatePropertyResult({
        error,
        success: false,
        loading: false,
      })
    )
  }
}

export function* deleteProperty({ payload }) {
  const { id } = payload
  try {
    const response = yield call(deletePropertyApi, { id })
    if (response.status === 200) {
      yield put(
        propertyActions.deletePropertyResult({
          error: null,
          success: true,
          loading: false,
          item: {},
          id,
        })
      )
    }
  } catch (error) {
    const { status } = error.response
    if (status === 401) {
      yield put(userActions.initUserResult())
    }
    yield put(
      propertyActions.deletePropertyResult({
        error,
        success: false,
        loading: false,
      })
    )
  }
}

export function* skipTracingItem({ payload }) {
  try {
    const { id } = payload
    const response = yield call(skipTracingItemApi, { id })
    if (response.status === 200) {
      yield put(
        propertyActions.skipTracingItemResult({
          id,
          error: null,
          success: true,
          loading: false,
          result: response.data.data,
        })
      )
    }
  } catch (error) {
    const { status } = error.response
    if (status === 401) {
      yield put(userActions.initUserResult())
    }
    yield put(
      propertyActions.skipTracingItemResult({
        error,
        success: false,
        loading: false,
      })
    )
  }
}

export function* addContact({ payload }) {
  try {
    const { type, contact } = payload
    const response = yield call(addContactApi, { type, contact })
    if (response.status === 200) {
      yield put(
        propertyActions.addContactResult({
          type,
          error: null,
          success: true,
          loading: false,
          result: response.data.data,
        })
      )
    }
  } catch (error) {
    const { status } = error.response
    if (status === 401) {
      yield put(userActions.initUserResult())
    }
    yield put(
      propertyActions.addContactResult({
        error,
        success: false,
        loading: false,
      })
    )
  }
}

export function* deleteContact({ payload }) {
  try {
    const { type, id } = payload
    const response = yield call(deleteContactApi, { type, id })
    if (response.status === 200) {
      yield put(
        propertyActions.deleteContactResult({
          type,
          error: null,
          success: true,
          loading: false,
          id,
          result: response.data.data,
        })
      )
    }
  } catch (error) {
    const { status } = error.response
    if (status === 401) {
      yield put(userActions.initUserResult())
    }
    yield put(
      propertyActions.addContactResult({
        error,
        success: false,
        loading: false,
      })
    )
  }
}

export function* updateContact({ payload }) {
  try {
    const { type, contact } = payload
    const response = yield call(updateContactApi, { type, contact })
    if (response.status === 200) {
      yield put(
        propertyActions.updateContactResult({
          type,
          error: null,
          success: true,
          loading: false,
          result: response.data.data,
        })
      )
    }
  } catch (error) {
    const { status } = error.response
    if (status === 401) {
      yield put(userActions.initUserResult())
    }
    yield put(
      propertyActions.updateContactResult({
        error,
        success: false,
        loading: false,
      })
    )
  }
}

export function* activityList({ payload }) {
  const { id, page } = payload

  try {
    const response = yield call(getPropertyActivitiesApi, { id, page })
    const { data } = response.data

    if (response.status === 200) {
      yield put(
        propertyActions.getPropertyActivitiesResult({
          error: null,
          loading: false,
          success: true,
          page: Number(data.page),
          total: data.total,
          count: data.count,
          count_per_page: data.count_per_page,
          items: data.data,
        })
      )
    }
  } catch (error) {
    if (error.response) {
      const { status } = error.response
      if (status === 401) {
        yield put(userActions.initUserResult())
      }
      yield put(
        propertyActions.getPropertyActivitiesResult({
          error: null,
          loading: false,
          success: false,
        })
      )
    } else {
      yield put(
        propertyActions.getPropertyActivitiesResult({
          error: null,
          loading: false,
          success: false,
        })
      )
    }
  }
}

export function* addNote({ payload }) {
  try {
    const { id, note } = payload
    const response = yield call(addPropertyNoteApi, { id, note })
    if (response.status === 200) {
      yield put(
        propertyActions.addPropertyNoteResult({
          error: null,
          success: true,
          loading: false,
          result: response.data.data,
        })
      )
    }
  } catch (error) {
    const { status } = error.response
    if (status === 401) {
      yield put(userActions.initUserResult())
    }
    yield put(
      propertyActions.addPropertyNoteResult({
        error,
        success: false,
        loading: false,
      })
    )
  }
}

export function* searchMap({ payload }) {
  const { searchMode } = payload
  let searchFunc = () => {}
  if (searchMode === 'region') {
    searchFunc = getMapRegionSearchApi
  }
  if (searchMode === 'zip') {
    searchFunc = getMapZipSearchApi
  }
  if (searchMode === 'county' || searchMode === 'city') {
    searchFunc = getMapCountySearchApi
  }
  try {
    const response = yield call(searchFunc, { ...payload })
    const { data } = response.data

    if (response.status === 200) {
      yield put(
        propertyActions.getMapSearchResult({
          error: null,
          loading: false,
          success: true,
          page: Number(data.page),
          total: data.total,
          count_per_page: data.count_per_page,
          items: data.items,
          ...payload,
        })
      )
    }
  } catch (error) {
    if (error.response) {
      const { status } = error.response
      if (status === 401) {
        yield put(userActions.initUserResult())
      }
      yield put(
        propertyActions.getMapSearchResult({
          error,
          loading: false,
          success: false,
        })
      )
    } else {
      yield put(
        propertyActions.getMapSearchResult({
          error,
          loading: false,
          success: false,
        })
      )
    }
  }
}

export function* saveSearchedProperties({ payload }) {
  try {
    const { folderId, properties } = payload
    const response = yield call(saveSearchedResultApi, { folderId, properties })
    if (response.status === 200) {
      yield put(
        propertyActions.saveSearchedPropertiesResult({
          error: null,
          success: true,
          loading: false,
          data: response.data.data,
        })
      )
    }
  } catch (error) {
    const { status } = error.response
    if (status === 401) {
      yield put(userActions.initUserResult())
    }
    yield put(
      propertyActions.saveSearchedPropertiesResult({
        error,
        success: false,
        loading: false,
        data: {},
      })
    )
  }
}

export function* skipTracingMulti({ payload }) {
  try {
    const {
      isAll, properties, filter, excludedPropertyIds,
    } = payload
    const apiFunc = skipTracingMultiApi
    const response = yield call(apiFunc, {
      properties, isAll, filter, excludedPropertyIds,
    })
    if (response.status === 200) {
      yield put(
        propertyActions.skipTracingMultiResult({
          error: null,
          success: true,
          loading: false,
          data: response.data.data,
        })
      )
    }
  } catch (error) {
    const { status } = error.response
    if (status === 401) {
      yield put(userActions.initUserResult())
    }
    yield put(
      propertyActions.skipTracingMultiResult({
        error,
        success: false,
        loading: false,
        data: {},
      })
    )
  }
}

export function* propertiesByPhoneNumber({ payload }) {
  try {
    const { phoneNumber } = payload
    const response = yield call(getPropertiesByPhoneNumber, { phoneNumber })
    if (response.status === 200) {
      yield put(
        propertyActions.getPropertiesByPhoneNumberResult({
          data: response.data.data,
        })
      )
    }
  } catch (error) {
    const { status } = error.response
    if (status === 401) {
      yield put(userActions.initUserResult())
    }
    yield put(
      propertyActions.getPropertiesByPhoneNumberResult({
        error,
        success: false,
        loading: false,
        data: null,
      })
    )
  }
}

export function* deletePropertyMulti({ payload }) {
  try {
    const {
      // eslint-disable-next-line camelcase
      type, property_ids, filter, excluded_property_ids,
    } = payload
    const response = yield call(deletePropertyMultiApi, {
      type, property_ids, filter, excluded_property_ids,
    })
    if (response.status === 200) {
      yield put(
        propertyActions.deletePropertyMultiResult({
          error: null,
          success: true,
          loading: false,
          data: response.data.data,
        })
      )
    }
  } catch (error) {
    const { status } = error.response
    if (status === 401) {
      yield put(userActions.initUserResult())
    }
    yield put(
      propertyActions.deletePropertyMultiResult({
        error,
        success: false,
        loading: false,
        data: {},
      })
    )
  }
}

export function* saveSearchedProperties_({ payload }) {
  try {
    const {
      folderId, searchMode, filter, excludedPropertyHashes, total,
    } = payload
    const response = yield call(saveSearchedResultApi_, {
      folderId, searchMode, filter, excludedPropertyHashes, total,
    })
    if (response.status === 200) {
      yield put(
        propertyActions.saveSearchedPropertiesResult_({
          error: null,
          success: true,
          loading: false,
          data: response.data.data,
        })
      )
    }
  } catch (error) {
    const { status } = error.response
    if (status === 401) {
      yield put(userActions.initUserResult())
    }
    yield put(
      propertyActions.saveSearchedPropertiesResult_({
        error,
        success: false,
        loading: false,
        data: {},
      })
    )
  }
}

export function* updateStatusMulti({ payload }) {
  try {
    const {
      // eslint-disable-next-line camelcase
      status, property_ids, filter, excluded_property_ids,
    } = payload
    const response = yield call(updateStatusMultiApi, {
      status, property_ids, filter, excluded_property_ids,
    })
    if (response.status === 200) {
      yield put(
        propertyActions.updateStatusMultiResult({
          error: null,
          success: true,
          loading: false,
          data: response.data.data,
        })
      )
    }
  } catch (error) {
    const { status } = error.response
    if (status === 401) {
      yield put(userActions.initUserResult())
    }
    yield put(
      propertyActions.updateStatusMultiResult({
        error,
        success: false,
        loading: false,
        data: {},
      })
    )
  }
}

export function* updatePropertyTag({ payload }) {
  try {
    const updateFunc = payload.property_id ? createPropertyTagApi : deletePropertyTagApi
    const response = yield call(updateFunc, {
      ...payload,
    })
    if (response.status === 200) {
      yield put(
        propertyActions.updatePropertyTagResult({
          error: null,
          success: true,
          loading: false,
          data: response.data.data,
          id: payload.id ? payload.id : null,
        })
      )
    }
  } catch (error) {
    const { status } = error.response
    if (status === 401) {
      yield put(userActions.initUserResult())
    }
    yield put(
      propertyActions.updatePropertyTagResult({
        error,
        success: false,
        loading: false,
        data: {},
      })
    )
  }
}

export function* updateFolderMulti({ payload }) {
  try {
    const {
      // eslint-disable-next-line camelcase
      folder_id, property_ids, filter, excluded_property_ids,
    } = payload
    const response = yield call(updateFolderMultiApi, {
      folder_id, property_ids, filter, excluded_property_ids,
    })
    if (response.status === 200) {
      yield put(
        propertyActions.updateFolderMultiResult({
          error: null,
          success: true,
          loading: false,
          data: response.data.data,
        })
      )
    }
  } catch (error) {
    const { status } = error.response
    if (status === 401) {
      yield put(userActions.initUserResult())
    }
    yield put(
      propertyActions.updateFolderMultiResult({
        error,
        success: false,
        loading: false,
        data: {},
      })
    )
  }
}

export function* stopPropertyCampaigns({ payload }) {
  const { id } = payload
  try {
    const response = yield call(stopPropertyCampaignsApi, { id })
    if (response.status === 200) {
      yield put(
        propertyActions.stopPropertyCampaignsResult({
          error: null,
          success: true,
          loading: false,
        })
      )
    }
  } catch (error) {
    const { status } = error.response
    if (status === 401) {
      yield put(userActions.initUserResult())
    }
    yield put(
      propertyActions.stopPropertyCampaignsResult({
        error,
        success: false,
        loading: false,
      })
    )
  }
}

export function* getNotSkipTracedCount({ payload }) {
  try {
    const response = yield call(getNotSkipTracedPropertyCountApi, { ...payload })
    if (response.status === 200) {
      yield put(
        propertyActions.getNotSkipTracedCountResult({
          error: null,
          success: true,
          loading: false,
          data: response.data.data,
        })
      )
    }
  } catch (error) {
    const { status } = error.response
    if (status === 401) {
      yield put(userActions.initUserResult())
    }
    yield put(
      propertyActions.getNotSkipTracedCountResult({
        error,
        success: false,
        loading: false,
      })
    )
  }
}

function* watchProperty() {
  yield takeLatest(propertyConstants.GET_PROPERTIES, propertyList)
  yield takeLatest(propertyConstants.GET_MAP_PROPERTIES, propertyList)
  yield takeLatest(propertyConstants.GET_PROPERTYBYADDRESS, propertyByAddress)
  yield takeLatest(propertyConstants.GET_PROPERTYBYID, propertyById)
  yield takeLatest(propertyConstants.GET_PROPERTY_BY_DISTANCE, propertyByDistance)
  yield takeLatest(propertyConstants.GET_PROPERTY_BY_LATLNG, propertyByLatLng)
  yield takeLatest(propertyConstants.CREATE_PROPERTY, createProperty)
  yield takeLatest(propertyConstants.UPDATE_PROPERTY, updateProperty)
  yield takeLatest(propertyConstants.DELETE_PROPERTY, deleteProperty)
  yield takeLatest(propertyConstants.SKIP_TRACING_ITEM, skipTracingItem)
  yield takeLatest(propertyConstants.ADD_CONTACT, addContact)
  yield takeLatest(propertyConstants.DELETE_CONTACT, deleteContact)
  yield takeLatest(propertyConstants.UPDATE_CONTACT, updateContact)
  yield takeLatest(propertyConstants.GET_PROPERTY_ACTIVITIES, activityList)
  yield takeLatest(propertyConstants.ADD_PROPERTY_NOTE, addNote)
  yield takeLatest(propertyConstants.GET_MAP_SEARCH, searchMap)
  yield takeLatest(propertyConstants.SAVE_SEARCHED_PROPERTIES, saveSearchedProperties)
  yield takeLatest(propertyConstants.SKIP_TRACING_MULTI, skipTracingMulti)
  yield takeLatest(propertyConstants.GET_PROPERTIES_BY_PHONE_NUMBER, propertiesByPhoneNumber)
  yield takeLatest(propertyConstants.DELETE_PROPERTY_MULTI, deletePropertyMulti)
  yield takeLatest(propertyConstants.SAVE_SEARCHED_PROPERTIES_, saveSearchedProperties_)
  yield takeLatest(propertyConstants.UPDATE_STATUS_MULTI, updateStatusMulti)
  yield takeLatest(propertyConstants.UPDATE_PROPERTY_TAG, updatePropertyTag)
  yield takeLatest(propertyConstants.UPDATE_FOLDER_MULTI, updateFolderMulti)
  yield takeLatest(propertyConstants.STOP_PROPERTY_CAMPAIGNS, stopPropertyCampaigns)
  yield takeLatest(propertyConstants.GET_NOT_SKIP_TRACED_COUNT, getNotSkipTracedCount)
}
export const propertySaga = [fork(watchProperty)]
