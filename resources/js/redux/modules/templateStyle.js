import { createAction, handleActions } from 'redux-actions'
import { Map, fromJS } from 'immutable'

const GET_STYLES = 'GET_STYLES'
const GET_STYLES_RESULT = 'GET_STYLES_RESULT'

export const constants = {
  GET_STYLES,
  GET_STYLES_RESULT,
}

// ------------------------------------
// Actions
// ------------------------------------
export const getStyles = createAction(GET_STYLES, () => ({
}))
export const getStylesResult = createAction(
  GET_STYLES_RESULT,
)


export const actions = {
  getStyles,
  getStylesResult,
}

export const reducers = {
  [GET_STYLES]: (state) => {
    return state.merge({
      loading: true,
    })
  },
  [GET_STYLES_RESULT]: (state, { payload }) => {
    return state.merge({
      loading: false,
      styles: fromJS(payload.styles),
    })
  },
}

export const initialState = () => Map({
  styles: null,
  loading: false,
})

export default handleActions(reducers, initialState())
