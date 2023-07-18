import httpClient from '../httpClient'

export const getMessageBox = ({ page, search }) => {
  return httpClient.get(`sms/campaign/getMessageBox/${page}?search=${search}`)
}

export const getMessageHistory = ({ masterId, page, search }) => {
  return httpClient.get(`sms/campaign/getMessages/${masterId}/${page}?search=${search}`)
}

export const getMaster = ({ masterId }) => {
  return httpClient.get(`sms/campaign/getSmsMaster/${masterId}`)
}

export const sendMessage = ({ message, receiver }) => {
  return httpClient.post('sms/campaign/sendSms', {
    message,
    receiver,
  })
}

export const getTotalBadge = () => {
  return httpClient.get('sms/campaign/getTotalBadge')
}

export const markMessageRead = ({ id }) => {
  return httpClient.get(`sms/campaign/setMessagesRead/${id}`)
}

export const deleteMessageBoxApi = ({ masterId }) => {
  return httpClient.delete(`sms/campaign/deleteSmsMaster/${masterId}`)
}

export const getSmsMastersApi = ({ propertyId }) => {
  return httpClient.get(`property/phone/getSmsMastersByPropertyId?property_id=${propertyId}`)
}
