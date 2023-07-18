import { createSelector } from 'reselect'

const kpiDataSelector = (state) => state.kpi

const kpisSelector = createSelector(
  kpiDataSelector,
  (payload) => {
    const result = payload.get('kpis')
    return {
      result,
      loading: payload.get('loading'),
    }
  }
)

export const kpiSelector = (state) => ({
  ...kpisSelector(state),
})
