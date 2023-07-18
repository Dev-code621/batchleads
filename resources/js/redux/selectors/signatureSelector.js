import { createSelector } from 'reselect'

const signatureDataSelector = (state) => state.signature

const signaturesSelector = createSelector(
  signatureDataSelector,
  (payload) => {
    const result = payload.get('signatures')
    const loading = payload.get('loading')
    const error = payload.get('error')
    const success = payload.get('success')
    const count = payload.get('count')
    const page = payload.get('page')
    const search = payload.get('search')
    const total = payload.get('total')
    const countPerPage = payload.get('count_per_page')
    const signature = payload.get('signature')

    return {
      result,
      loading,
      error,
      success,
      count,
      search,
      total,
      page,
      count_per_page: countPerPage,
      signature,
    }
  }
)

export const signatureSelector = (state) => ({
  ...signaturesSelector(state),
})
