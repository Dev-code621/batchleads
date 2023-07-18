import httpClient from '../httpClient'

export const getMyCampaigns = ({ page, search }) => httpClient.get(`/sms/campaign/${page}?search=${search}`)

export const newCampaign = ({
  title,
  description,
  templateId,
  startDate,
  propertyIds,
  skiptracing = 0,
}) => {
  const formData = new FormData()
  formData.append('title', title)
  formData.append('description', description)
  formData.append('template_master_id', templateId)
  formData.append('start_date', startDate)
  formData.append('skiptracing', skiptracing)
  propertyIds.map((propertyId) => formData.append('property_ids[]', propertyId))

  return httpClient.post('/sms/campaign/start', formData)
}

export const newCampaignBulk = ({
  title,
  description,
  templateId,
  startDate,
  propertyIds,
  filter,
  skiptracing = 0,
}) => {
  const data = {
    template_master_id: templateId,
    title,
    description,
    start_date: startDate,
    excluded_property_ids: propertyIds,
    skiptracing,
    filter,
  }

  return httpClient.post('/sms/campaign/bulkStart', data)
}

export const cancelCampaign = ({ campaignId }) => {
  return httpClient.get(`/sms/campaign/cancel/${campaignId}`)
}
