import { createAction, handleActions } from 'redux-actions'
import { Map, fromJS } from 'immutable'

const GET_KPIS = 'GET_KPIS'
const GET_KPIS_RESULT = 'GET_KPIS_RESULT'

export const constants = {
  GET_KPIS,
  GET_KPIS_RESULT,
}

// ------------------------------------
// Actions
// ------------------------------------
export const getKpis = createAction(GET_KPIS, (filter) => ({ filter }))
export const getKpisResult = createAction(
  GET_KPIS_RESULT,
)

export const actions = {
  getKpis,
  getKpisResult,
}

export const reducers = {
  [GET_KPIS]: (state) => {
    return state.merge({
      loading: true,
    })
  },
  [GET_KPIS_RESULT]: (state, { payload }) => {
    return state.merge({
      loading: false,
    }).set(
      'kpis', fromJS(payload.kpis)
    )
  },
}

export const initialState = () => Map({
  loading: false,
  kpis: null,
})

export default handleActions(reducers, initialState())
