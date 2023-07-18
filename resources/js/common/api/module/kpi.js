import httpClient from '../httpClient'

export const getKpis = ({ filter }) => {
  const {
    start, end, user_id: userId, property_status: propertyStatus, prev_start: prevStart,
  } = filter
  const data = {
    start,
    end,
    prev_start: prevStart,
  }
  if (userId) {
    data.user_id = userId
  }
  if (propertyStatus[0] !== 'All Deals') {
    data.property_status = propertyStatus
  }

  return httpClient.post('/kpi/get', data)
}
