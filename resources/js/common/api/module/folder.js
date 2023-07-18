import httpClient from '../httpClient'

export const getFolders = () => {
  return httpClient.get('/folder/1?pageSize=100')
}

export const createNewFolder = ({ name }) => {
  return httpClient.post('folder/create', {
    name,
  })
}

export const updateFolderApi = (data) => {
  return httpClient.put(`folder/update/${data.id}`, data)
}

export const deleteFolderApi = ({ id }) => {
  return httpClient.delete(`folder/delete/${id}`)
}
