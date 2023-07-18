import httpClient from '../httpClient'

export const getTagsApi = () => {
  return httpClient.get('/tag/1?pageSize=100')
}

export const createTagApi = ({ name }) => {
  return httpClient.post('tag/create', {
    name,
  })
}

export const updateTagApi = (data) => {
  return httpClient.post(`tag/update/${data.id}`, data)
}

export const deleteTagApi = ({ id }) => {
  return httpClient.delete(`tag/delete/${id}`)
}
