import httpClient from '../httpClient'

export const getMyTemplates = ({ page, search }) => {
  return httpClient.get(`/sms/campaign/template/${page}?search=${search}`)
}

export const newTemplate = ({ template }) => {
  const { name, template_details: details } = template
  return httpClient.post('sms/campaign/template/create', {
    name,
    details,
  })
}

export const updateTemplate = ({ template }) => {
  const { name, template_details: details, id } = template
  return httpClient.put(`sms/campaign/template/update/${id}`, {
    name,
    details,
  })
}

export const removeTemplate = ({ id }) => {
  return httpClient.delete(`sms/campaign/template/delete/${id}`)
}
