import { createSelector } from 'reselect'

const campaignDataSelector = (state) => state.smsCampaign

const resultSelector = createSelector(
  campaignDataSelector,
  (payload) => {
    return {
      countPerPage: payload.get('count_per_page'),
      total: payload.get('total'),
      count: payload.get('count'),
      page: payload.get('page'),
      loading: payload.get('loading'),
      campaigns: payload.get('campaigns'),
      error: payload.get('error'),
      success: payload.get('success'),
    }
  }
)

const campaignSelector = createSelector(
  campaignDataSelector,
  (payload) => {
    const campaign = payload.get('campaign')
    const { title, description, start_date: startDate } = campaign

    return {
      title,
      description,
      startDate,
    }
  }
)

const searchSelector = createSelector(
  campaignDataSelector,
  (payload) => payload.get('search')
)

export const smsCampaignSelector = (state) => ({
  result: resultSelector(state),
  campaign: campaignSelector(state),
  search: searchSelector(state),
})
