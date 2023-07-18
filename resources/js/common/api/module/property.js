import axios from 'axios'
import httpClient from '../httpClient'

let cancelToken;

export const getPropertyList = ({ pageNumber, filters = [] }) => {
  if (typeof cancelToken !== typeof undefined) {
    cancelToken.cancel('axios canceled');
  }
  cancelToken = axios.CancelToken.source();
  return httpClient.post(`/property/filterByRegion/${pageNumber}`, { ...filters }, { cancelToken: cancelToken.token })
}

export const getPropertyByAddress = ({
  street, state, zip, city,
}) => {
  return httpClient.get(`/property/search?street=${street}&state=${state}&zip=${zip}&city=${city}`)
}

export const getPropertyId = ({ id }) => {
  return httpClient.get(`/property/read/${id}`)
}

export const getPropertyByDistance = ({ lat, lon, rad }) => {
  return httpClient.post(`/property/searchByDistance_?lat=${lat}&lon=${lon}&distance=${rad}`)
};

export const getPropertyByLatLng = ({ lat, lon }) => {
  return httpClient.post(`/property/searchByLatLng?lat=${lat}&lon=${lon}`)
};

export const createNewProperty = ({ property }) => {
  const formData = new FormData()
  const keys = Object.keys(property)
  keys.forEach((key) => {
    if (key !== 'images') {
      if (property[key]) {
        formData.append(key, property[key])
      }
    }
  })
  const { images } = property
  if (images) {
    images.forEach((image) => {
      formData.append('images[]', image)
    })
  }

  return httpClient.post('/property/create', formData)
}

export const updatePropertyApi = ({ property }) => {
  const formData = new FormData()
  const keys = Object.keys(property)
  keys.forEach((key) => {
    if (key !== 'images' || key !== 'removed_image_ids') {
      if (property[key]) {
        formData.append(key, property[key])
      }
    }
  })
  const { images } = property
  if (images && images.length > 0) {
    images.forEach((image) => {
      formData.append('images[]', image)
    })
  }
  const { removedImageIds } = property
  if (removedImageIds && removedImageIds.length > 0) {
    removedImageIds.forEach((image) => {
      formData.append('removed_image_ids[]', image)
    })
  }

  return httpClient.post(`/property/update/${property.id}`, formData)
}

export const deletePropertyApi = ({ id }) => {
  return httpClient.delete(`/property/delete/${id}`)
}

export const skipTracingItemApi = ({ id }) => {
  return httpClient.get(`/skipTracing/fetch/${id}`)
}

export const addContactApi = ({ type, contact }) => {
  const url = type === 'Email' ? 'email' : 'phone';
  return httpClient.post(`/property/${url}/create`, {
    ...contact,
  })
}

export const updateContactApi = ({ type, contact }) => {
  const url = type === 'Email' ? 'email' : 'phone';
  return httpClient.put(`/property/${url}/update/${contact.id}`, {
    ...contact,
  })
}

export const deleteContactApi = ({ type, id }) => {
  const url = type === 'Email' ? 'email' : 'phone';
  return httpClient.delete(`/property/${url}/delete/${id}`)
}

export function getAddressDetailfromLocation(lat, lng) {
  // const urlGetAddress = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyC_FWeQKfzUuWEarsF38d18O0YxtscOjO4`;
  const urlGetAddress = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${__CONFIG__.GOOGLE_MAP_API_KEY}`
  return new Promise((resolve, reject) => {
    fetch(urlGetAddress)
      .then((response) => response.json())
      .then((responseJson) => {
        resolve(responseJson.results[0]);
      })
      .catch((error) => {
        reject(Object.assign(error));
      });
  });
}

export const getPropertyActivitiesApi = ({ id, page = 1 }) => {
  return httpClient.get(`/property/history/${page}?property_id=${id}`)
}

export const addPropertyNoteApi = ({ id, note }) => {
  return httpClient.post('/property/history/create', {
    property_id: id,
    description: note,
  })
}

export const getMapRegionSearchApi = ({ page = 1, coords, filter }) => {
  let ownerStatus = filter.owner_status
  if (ownerStatus) {
    ownerStatus = filter.owner_status === 'Yes' ? 1 : 0
  }
  return httpClient.post(`/property/searchByRegion/${page}`, {
    region: coords,
    foreclosure_status: filter.foreclosure_status ? 1 : 0,
    owner_status: ownerStatus,
    vacant: filter.vacant ? 1 : 0,
    tax_default: filter.tax_default ? 1 : 0,
    building: filter.building,
    equity: filter.equity,
    dwelling_type: filter.dwelling_type,
    tired_landlord: filter.tired_landlord ? 1 : 0,
    inherited: filter.inherited ? 1 : 0,
    unknown_equity: filter.unknown_equity ? 1 : 0,
    on_market: filter.on_market,
    cash_buyer: filter.cash_buyer ? 1 : 0,
  })
}

export const getMapZipSearchApi = ({ page = 1, zip, filter }) => {
  let ownerStatus = filter.owner_status
  if (ownerStatus) {
    ownerStatus = filter.owner_status === 'Yes' ? 1 : 0
  }
  return httpClient.post(`/property/propertySearchByZipCode/${page}`, {
    zip_code: zip,
    foreclosure_status: filter.foreclosure_status ? 1 : 0,
    owner_status: ownerStatus,
    vacant: filter.vacant ? 1 : 0,
    tax_default: filter.tax_default ? 1 : 0,
    building: filter.building,
    equity: filter.equity,
    dwelling_type: filter.dwelling_type,
    tired_landlord: filter.tired_landlord ? 1 : 0,
    inherited: filter.inherited ? 1 : 0,
    unknown_equity: filter.unknown_equity ? 1 : 0,
    on_market: filter.on_market,
    cash_buyer: filter.cash_buyer ? 1 : 0,
  })
}

export const getMapCountySearchApi = ({ page = 1, county, filter }) => {
  let ownerStatus = filter.owner_status
  if (ownerStatus) {
    ownerStatus = filter.owner_status === 'Yes' ? 1 : 0
  }
  return httpClient.post(`/property/propertySearchByCounty/${page}`, {
    county,
    foreclosure_status: filter.foreclosure_status ? 1 : 0,
    owner_status: ownerStatus,
    vacant: filter.vacant ? 1 : 0,
    tax_default: filter.tax_default ? 1 : 0,
    building: filter.building,
    equity: filter.equity,
    dwelling_type: filter.dwelling_type,
    tired_landlord: filter.tired_landlord ? 1 : 0,
    inherited: filter.inherited ? 1 : 0,
    unknown_equity: filter.unknown_equity ? 1 : 0,
    on_market: filter.on_market,
    cash_buyer: filter.cash_buyer ? 1 : 0,
  })
}

export const saveSearchedResultApi = ({ folderId, properties }) => {
  return httpClient.post('/property/bulkAdd', {
    folder_id: folderId,
    properties,
  })
}

export const skipTracingMultiApi = ({
  properties,
  isAll,
  filter,
  excludedPropertyIds,
}) => {
  return httpClient.post('/skipTracing/fetch/bulk', {
    properties: isAll ? null : properties,
    filter,
    excluded_property_ids: excludedPropertyIds,
  })
}

export const skipTracingAllApi = () => httpClient.get('/skipTracing/fetch/all')

export const getPropertiesByPhoneNumber = ({ phoneNumber }) => {
  return httpClient.get(`/property/phone/getPropertiesByPhoneNumber?phone_number=${phoneNumber}`)
}

export const deletePropertyMultiApi = (data) => {
  return httpClient.delete('/property/delete', { data })
}

export const saveSearchedResultApi_ = ({
  folderId,
  searchMode,
  filter,
  excludedPropertyHashes,
  total,
}) => {
  return httpClient.post('/property/searchAdd', {
    folder_id: folderId,
    search_mode: searchMode,
    excluded_hashes: excludedPropertyHashes,
    filter,
    total,
  })
}

export const updateStatusMultiApi = (data) => {
  return httpClient.post('/property/bulkStatusUpdate', { ...data })
}

export const createPropertyTagApi = (data) => {
  return httpClient.post('/property/tag/create', { ...data })
}

export const deletePropertyTagApi = ({ id }) => {
  return httpClient.delete(`/property/tag/delete/${id}`)
}

export const fetchZillowData = (data) => {
  return httpClient.post('/zillow/getLink', { ...data })
}

export const updateFolderMultiApi = (data) => {
  return httpClient.post('/property/bulkFolderUpdate', { ...data })
}

export const stopPropertyCampaignsApi = ({ id }) => {
  return httpClient.get(`/property/stopAllCampaigns?property_id=${id}`)
}

export const getNotSkipTracedPropertyCountApi = (data) => {
  return httpClient.post('/property/getNotSkipTracedCount', { ...data })
}
