import { createAction, handleActions } from 'redux-actions'
import { Map } from 'immutable'

const GET_MAIL_CAMPAIGNS = 'GET_MAIL_CAMPAIGNS'
const GET_MAIL_CAMPAIGNS_RESULT = 'GET_MAIL_CAMPAIGNS_RESULT'
const NEW_MAIL_CAMPAIGN = 'NEW_MAIL_CAMPAIGN'
const NEW_MAIL_CAMPAIGN_RESULT = 'NEW_MAIL_CAMPAIGN_RESULT'
const NEW_MAIL_CAMPAIGN_BULK = 'NEW_MAIL_CAMPAIGN_BULK'
const NEW_MAIL_CAMPAIGN_BULK_RESULT = 'NEW_MAIL_CAMPAIGN_BULK_RESULT'
const INIT_MAIL_CAMPAIGNS = 'INIT_MAIL_CAMPAIGNS'
const EDIT_MAIL_CAMPAIGN = 'EDIT_MAIL_CAMPAIGN'
const INIT_MAIL_CAMPAIGN = 'INIT_MAIL_CAMPAIGN'
const SET_CAMPAIGN_SEARCH = 'SET_CAMPAIGN_SEARCH'
const INIT_MAIL_CAMPAIGN_SEARCH = 'INIT_MAIL_CAMPAIGN_SEARCH'
const CANCEL_MAIL_CAMPAIGN = 'CANCEL_MAIL_CAMPAIGN'
const CANCEL_MAIL_CAMPAIGN_RESULT = 'CANCEL_MAIL_CAMPAIGN_RESULT'

export const constants = {
  GET_MAIL_CAMPAIGNS,
  GET_MAIL_CAMPAIGNS_RESULT,
  INIT_MAIL_CAMPAIGNS,
  EDIT_MAIL_CAMPAIGN,
  INIT_MAIL_CAMPAIGN,
  SET_CAMPAIGN_SEARCH,
  INIT_MAIL_CAMPAIGN_SEARCH,
  NEW_MAIL_CAMPAIGN,
  NEW_MAIL_CAMPAIGN_RESULT,
  NEW_MAIL_CAMPAIGN_BULK,
  NEW_MAIL_CAMPAIGN_BULK_RESULT,
  CANCEL_MAIL_CAMPAIGN,
  CANCEL_MAIL_CAMPAIGN_RESULT,
}

// ------------------------------------
// Actions
// ------------------------------------
export const getCampaigns = createAction(
  GET_MAIL_CAMPAIGNS,
  (page, search = '') => ({ page, search })
)
export const getCampaignsResult = createAction(GET_MAIL_CAMPAIGNS_RESULT)
export const initCampaigns = createAction(INIT_MAIL_CAMPAIGNS, () => ({}))

export const initCampaign = createAction(INIT_MAIL_CAMPAIGN, () => ({}))
export const editCampaign = createAction(EDIT_MAIL_CAMPAIGN, (campaign) => ({
  campaign,
}))

export const initCampaignSearch = createAction(
  INIT_MAIL_CAMPAIGN_SEARCH,
  () => ({})
)
export const setCampaignSearch = createAction(
  SET_CAMPAIGN_SEARCH,
  (search) => ({ search })
)

export const newCampaign = createAction(
  NEW_MAIL_CAMPAIGN,
  (
    title,
    description,
    repeatEvery,
    totalMailers,
    isRepeatStep,
    startDate,
    templateId,
    propertyIds
  ) => ({
    title,
    description,
    repeatEvery,
    totalMailers,
    isRepeatStep,
    startDate,
    templateId,
    propertyIds,
  })
)
export const newCampaignResult = createAction(NEW_MAIL_CAMPAIGN_RESULT)

export const cancelCampaign = createAction(
  CANCEL_MAIL_CAMPAIGN,
  (campaignId) => ({ campaignId })
)
export const cancelCampaignResult = createAction(CANCEL_MAIL_CAMPAIGN_RESULT)

export const newCampaignBulk = createAction(
  NEW_MAIL_CAMPAIGN_BULK,
  (
    title,
    description,
    repeatEvery,
    totalMailers,
    isRepeatStep,
    startDate,
    templateId,
    propertyIds,
    filter
  ) => ({
    title,
    description,
    repeatEvery,
    totalMailers,
    isRepeatStep,
    startDate,
    templateId,
    propertyIds,
    filter,
  })
)
export const newCampaignBulkResult = createAction(
  NEW_MAIL_CAMPAIGN_BULK_RESULT
)

export const actions = {
  getCampaigns,
  getCampaignsResult,
  initCampaigns,
  initCampaign,
  editCampaign,
  setCampaignSearch,
  initCampaignSearch,
  newCampaign,
  newCampaignResult,
  newCampaignBulk,
  newCampaignBulkResult,
  cancelCampaign,
  cancelCampaignResult,
}

export const reducers = {
  [GET_MAIL_CAMPAIGNS]: (state) => state.merge({
    loading: true,
  }),
  [GET_MAIL_CAMPAIGNS_RESULT]: (state, { payload }) => {
    const campaigns = state.get('campaigns')
    const result = payload.campaigns ? payload.campaigns : null

    if (result) {
      const { page } = payload
      if (Number(page) === 1) {
        return state.merge({ ...payload }).set('campaigns', result)
      }
      return state.mergeDeep({
        ...payload,
        campaigns: campaigns ? campaigns.concat(result) : result,
      })
    }

    return state.set({
      ...payload,
    })
  },
  [NEW_MAIL_CAMPAIGN]: (state) => state.merge({
    success: false,
    loading: true,
  }),
  [NEW_MAIL_CAMPAIGN_RESULT]: (state, { payload }) => {
    const { success } = payload
    if (success) {
      return state.merge({
        ...payload,
      })
    }

    return state.merge({
      ...payload,
    })
  },
  [NEW_MAIL_CAMPAIGN_BULK]: (state) => state.merge({
    success: false,
    loading: true,
  }),
  [NEW_MAIL_CAMPAIGN_BULK_RESULT]: (state, { payload }) => {
    const { success, data } = payload
    if (success) {
      let campaigns = state.get('campaigns')
      campaigns = campaigns.unshift(data)
      return state.merge({
        ...payload,
        campaigns,
      })
    }

    return state.merge({
      ...payload,
    })
  },
  [EDIT_MAIL_CAMPAIGN]: (state, { payload }) => {
    let campaign = state.get('campaign')
    campaign = {
      ...campaign,
      ...payload.campaign,
    }
    return state.set('campaign', campaign)
  },
  [INIT_MAIL_CAMPAIGNS]: (state) => state.merge({
    error: null,
    success: false,
    status: 200,
    loading: false,
    total: 0,
    page: 0,
    count: 0,
    count_per_page: 0,
    campaigns: [],
    campaign: {
      title: '',
      description: '',
      start_date: '',
      repeat_every: '',
      total_mailers: '',
      is_repeat: false,
    },
  }),

  [INIT_MAIL_CAMPAIGN]: (state) => state.merge({
    success: false,
    campaign: {
      title: '',
      description: '',
      start_date: '',
      repeat_every: '',
      total_mailers: '',
      is_repeat: false,
    },
  }),
  [INIT_MAIL_CAMPAIGN_SEARCH]: (state) => state.merge({
    search: '',
  }),
  [SET_CAMPAIGN_SEARCH]: (state, { payload }) => state.merge({
    search: payload.search,
  }),
  [CANCEL_MAIL_CAMPAIGN]: (state) => state.merge({
    success: false,
    loading: true,
  }),
  [CANCEL_MAIL_CAMPAIGN_RESULT]: (state, { payload }) => {
    const { success, data } = payload
    if (success) {
      let campaigns = state.get('campaigns')
      const index = campaigns.findIndex((campaign) => campaign.id === data.id)
      campaigns = campaigns.splice(index, 1, data)

      return state.merge({
        ...payload,
        campaigns,
      })
    }

    return state.merge({
      ...payload,
    })
  },
}

export const initialState = () => Map({
  error: null,
  success: false,
  status: 200,
  loading: false,
  total: 0,
  page: 0,
  count: 0,
  count_per_page: 0,
  campaigns: [],
  campaign: {
    title: '',
    description: '',
    start_date: '',
    repeat_every: '',
    total_mailers: '',
    is_repeat: false,
  },
  search: '',
})

export default handleActions(reducers, initialState())
