import httpClient from '../httpClient'

export const getStyles = () => {
  return httpClient.get('/mail/campaign/template/style/1?pageSize=100')
}
