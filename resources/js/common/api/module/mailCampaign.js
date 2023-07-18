import httpClient from '../httpClient'

export const getMyCampaigns = ({ page, search }) => httpClient.get(`/mail/campaign/${page}?search=${search}`)

export const newCampaign = ({
  title,
  description,
  templateId,
  startDate,
  propertyIds,
  repeatEvery,
  totalMailers,
  isRepeatStep,
}) => {
  const formData = new FormData()
  formData.append('title', title)
  formData.append('description', description)
  formData.append('template_id', templateId)
  formData.append('send_date', startDate)
  formData.append('repeat_every', repeatEvery)
  formData.append('total_mailers', totalMailers)
  formData.append('is_repeat', isRepeatStep)
  propertyIds.map((propertyId) => formData.append('property_ids[]', propertyId))

  return httpClient.post('/mail/campaign/start', formData)
}

export const newCampaignBulk = ({
  title,
  description,
  templateId,
  startDate,
  propertyIds,
  filter,
  repeatEvery,
  totalMailers,
  isRepeatStep,
}) => {
  const data = {
    template_id: templateId,
    title,
    description,
    repeat_every: repeatEvery,
    send_date: startDate,
    excluded_property_ids: propertyIds,
    filter,
    total_mailers: totalMailers,
    is_repeat: isRepeatStep,
  }

  return httpClient.post('/mail/campaign/bulkStart', data)
}

export const cancelCampaign = ({ campaignId }) => {
  return httpClient.get(`/mail/campaign/cancel/${campaignId}`)
}
