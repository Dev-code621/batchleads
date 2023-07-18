import { createAction, handleActions } from 'redux-actions'
import { Map } from 'immutable'

const GET_CAMPAIGNS = 'GET_CAMPAIGNS'
const GET_CAMPAIGNS_RESULT = 'GET_CAMPAIGNS_RESULT'
const INIT_NEW_CAMPAIGN = 'INIT_NEW_CAMPAIGN'
const NEW_CAMPAIGN = 'NEW_CAMPAIGN'
const NEW_CAMPAIGN_RESULT = 'NEW_CAMPAIGN_RESULT'
const NEW_CAMPAIGN_BULK = 'NEW_CAMPAIGN_BULK'
const NEW_CAMPAIGN_BULK_RESULT = 'NEW_CAMPAIGN_BULK_RESULT'
const INIT_CAMPAIGNS = 'INIT_CAMPAIGNS'
const EDIT_CAMPAIGN = 'EDIT_CAMPAIGN'
const INIT_CAMPAIGN = 'INIT_CAMPAIGN'
const SET_CAMPAIGN_SEARCH = 'SET_CAMPAIGN_SEARCH'
const INIT_CAMPAIGN_SEARCH = 'INIT_CAMPAIGN_SEARCH'
const CANCEL_CAMPAIGN = 'CANCEL_CAMPAIGN'
const CANCEL_CAMPAIGN_RESULT = 'CANCEL_CAMPAIGN_RESULT'

export const constants = {
  GET_CAMPAIGNS,
  GET_CAMPAIGNS_RESULT,
  INIT_CAMPAIGNS,
  EDIT_CAMPAIGN,
  INIT_CAMPAIGN,
  SET_CAMPAIGN_SEARCH,
  INIT_CAMPAIGN_SEARCH,
  INIT_NEW_CAMPAIGN,
  NEW_CAMPAIGN,
  NEW_CAMPAIGN_RESULT,
  NEW_CAMPAIGN_BULK,
  NEW_CAMPAIGN_BULK_RESULT,
  CANCEL_CAMPAIGN,
  CANCEL_CAMPAIGN_RESULT,
}

// ------------------------------------
// Actions
// ------------------------------------
export const getCampaigns = createAction(GET_CAMPAIGNS, (page, search = '') => ({ page, search }))
export const getCampaignsResult = createAction(
  GET_CAMPAIGNS_RESULT,
)
export const initCampaigns = createAction(INIT_CAMPAIGNS, () => ({}))

export const initCampaign = createAction(INIT_CAMPAIGN, () => ({}))
export const editCampaign = createAction(EDIT_CAMPAIGN, (campaign) => ({ campaign }))

export const initCampaignSearch = createAction(INIT_CAMPAIGN_SEARCH, () => ({}))
export const setCampaignSearch = createAction(SET_CAMPAIGN_SEARCH, (search) => ({ search }))

export const initNewCampaign = createAction(INIT_NEW_CAMPAIGN, () => ({}))

export const newCampaign = createAction(
  NEW_CAMPAIGN, (
    title,
    description,
    startDate,
    templateId,
    propertyIds,
    skiptracing,
  ) => ({
    title,
    description,
    startDate,
    templateId,
    propertyIds,
    skiptracing,
  })
)
export const newCampaignResult = createAction(
  NEW_CAMPAIGN_RESULT,
)

export const cancelCampaign = createAction(
  CANCEL_CAMPAIGN, (campaignId) => ({ campaignId })
)
export const cancelCampaignResult = createAction(
  CANCEL_CAMPAIGN_RESULT,
)

export const newCampaignBulk = createAction(
  NEW_CAMPAIGN_BULK, (
    title,
    description,
    startDate,
    templateId,
    propertyIds,
    filter,
    skiptracing,
  ) => ({
    title,
    description,
    startDate,
    templateId,
    propertyIds,
    filter,
    skiptracing,
  })
)
export const newCampaignBulkResult = createAction(
  NEW_CAMPAIGN_BULK_RESULT,
)

export const actions = {
  getCampaigns,
  getCampaignsResult,
  initCampaigns,
  initCampaign,
  editCampaign,
  setCampaignSearch,
  initCampaignSearch,
  initNewCampaign,
  newCampaign,
  newCampaignResult,
  newCampaignBulk,
  newCampaignBulkResult,
  cancelCampaign,
  cancelCampaignResult,
}

export const reducers = {
  [GET_CAMPAIGNS]: (state) => state.merge({
    loading: true,
  }),
  [GET_CAMPAIGNS_RESULT]: (state, { payload }) => {
    const campaigns = state.get('campaigns')
    const result = payload.campaigns ? payload.campaigns : null

    if (result) {
      const { page } = payload
      if (Number(page) === 1) {
        return state.merge({ ...payload })
          .set('campaigns', result)
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
  [INIT_NEW_CAMPAIGN]: (state) => state.merge({
    success: false,
    loading: false,
    error: null,
  }),
  [NEW_CAMPAIGN]: (state) => state.merge({
    success: false,
    loading: true,
  }),
  [NEW_CAMPAIGN_RESULT]: (state, { payload }) => {
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
  [NEW_CAMPAIGN_BULK]: (state) => state.merge({
    success: false,
    loading: true,
  }),
  [NEW_CAMPAIGN_BULK_RESULT]: (state, { payload }) => {
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
  [EDIT_CAMPAIGN]: (state, { payload }) => {
    let campaign = state.get('campaign')
    campaign = {
      ...campaign,
      ...payload.campaign,
    }
    return state.set('campaign', campaign)
  },
  [INIT_CAMPAIGNS]: (state) => state.merge({
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
    },
  }),

  [INIT_CAMPAIGN]: (state) => state.merge({
    success: false,
    campaign: {
      title: '',
      description: '',
      start_date: '',
    },
  }),
  [INIT_CAMPAIGN_SEARCH]: (state) => state.merge({
    search: '',
  }),
  [SET_CAMPAIGN_SEARCH]: (state, { payload }) => state.merge({
    search: payload.search,
  }),
  [CANCEL_CAMPAIGN]: (state) => state.merge({
    success: false,
    loading: true,
  }),
  [CANCEL_CAMPAIGN_RESULT]: (state, { payload }) => {
    const { success, data } = payload
    if (success) {
      const campaigns = state.get('campaigns')
      const index = campaigns.findIndex((campaign) => campaign.id === data.id)
      campaigns.splice(index, 1, data)

      return state.mergeDeep({
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
  },
  search: '',
})

export default handleActions(reducers, initialState())
