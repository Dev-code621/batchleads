import httpClient from '../httpClient'

export const getSignatures = ({ page, search }) => {
  return httpClient.get(`/mail/campaign/signature/${page}?pageSize=100&search=${search}`)
}

export const newSignature = ({ signature }) => {
  return httpClient.post('mail/campaign/signature/create', {
    ...signature,
  })
}

export const updateSignature = ({ signature }) => {
  return httpClient.put(`mail/campaign/signature/update/${signature.id}`, {
    ...signature,
  })
}

export const removeSignature = ({ id }) => {
  return httpClient.delete(`mail/campaign/signature/delete/${id}`)
}
