import { createAction, handleActions } from 'redux-actions'
import { fromJS } from 'immutable'

const GET_TAGS = 'GET_TAGS'
const GET_TAGS_RESULT = 'GET_TAGS_RESULT'
const INIT_TAG_RESULT = 'INIT_TAG_RESULT'
const CREATE_TAG = 'CREATE_TAG'
const CREATE_TAG_RESULT = 'CREATE_TAG_RESULT'
const UPDATE_TAG = 'UPDATE_TAG'
const UPDATE_TAG_RESULT = 'UPDATE_TAG_RESULT'
const DELETE_TAG = 'DELETE_TAG'
const DELETE_TAG_RESULT = 'DELETE_TAG_RESULT'
export const constants = {
  GET_TAGS,
  GET_TAGS_RESULT,
  INIT_TAG_RESULT,
  CREATE_TAG,
  CREATE_TAG_RESULT,
  UPDATE_TAG,
  UPDATE_TAG_RESULT,
  DELETE_TAG,
  DELETE_TAG_RESULT,
}

// ------------------------------------
// Actions
// ------------------------------------
export const getTags = createAction(GET_TAGS, () => ({
}))
export const getTagsResult = createAction(
  GET_TAGS_RESULT,
)

export const createTag = createAction(CREATE_TAG, (name) => ({
  name,
}))
export const createTagResult = createAction(
  CREATE_TAG_RESULT,
)

export const initTagResult = createAction(
  INIT_TAG_RESULT,
)

export const updateTag = createAction(UPDATE_TAG, (id, name) => ({
  id,
  name,
}))

export const updateTagResult = createAction(
  UPDATE_TAG_RESULT,
)

export const deleteTag = createAction(DELETE_TAG, (id) => ({ id }))

export const deleteTagResult = createAction(
  DELETE_TAG_RESULT,
)

export const actions = {
  getTags,
  getTagsResult,
  initTagResult,
  createTag,
  createTagResult,
  updateTag,
  updateTagResult,
  deleteTag,
  deleteTagResult,
}

export const reducers = {
  [GET_TAGS]: (state) => {
    return state.merge({
      loading: true,
      error: {},
    })
  },
  [GET_TAGS_RESULT]: (state, { payload }) => {
    if (payload.error) {
      return state.merge({ ...payload })
    }
    return state.merge({
      loading: false,
      items: fromJS(payload.items),
    })
  },
  [CREATE_TAG]: (state) => {
    return state.merge({
      loading: true,
      error: {},
    })
  },
  [CREATE_TAG_RESULT]: (state, { payload }) => {
    if (payload.error) {
      return state.merge({ ...payload })
    }
    const { data } = payload
    const tags = state.get('items').toJS()
    if (data) {
      tags.unshift(data)
    }

    return state.merge({
      loading: false,
      items: fromJS(tags),
    })
  },
  [INIT_TAG_RESULT]: (state) => {
    return state
      .merge({
        updateResult: {
          loading: false, success: false, error: null,
        },
        deleteResult: {
          loading: false, success: false, error: null,
        },
      })
      .setIn(['updateResult', 'data'], fromJS({}))
      .setIn(['deleteResult', 'data'], fromJS({}))
  },
  [UPDATE_TAG]: (state) => {
    return state.merge({
      updateResult: {
        loading: true, success: false, error: null,
      },
    })
  },
  [UPDATE_TAG_RESULT]: (state, { payload }) => {
    if (payload.error) {
      return state.merge({ updateResult: { ...payload } })
    }
    const newTags = state.get('items').toJS().map((tag) => (
      tag.id === payload.data.id ? payload.data : tag
    ))
    return state
      .merge({ updateResult: { ...payload } })
      .setIn(['items'], fromJS(newTags));
  },
  [DELETE_TAG]: (state) => {
    return state.merge({
      deleteResult: {
        loading: true, success: false, error: null,
      },
    })
  },
  [DELETE_TAG_RESULT]: (state, { payload }) => {
    if (payload.error) {
      return state.merge({ deleteResult: { ...payload } })
    }
    const newTags = state.get('items').toJS().filter((tag) => (
      tag.id !== payload.id
    ))
    return state
      .merge({ deleteResult: { ...payload } })
      .setIn(['items'], fromJS(newTags));
  },
}

export const initialState = () => fromJS({
  items: [],
  loading: false,
  error: {},
  updateResult: {
    success: false,
    loading: false,
    error: null,
    data: {},
  },
  deleteResult: {
    loading: false,
    success: false,
    error: null,
    data: {},
  },
})

export default handleActions(reducers, initialState())
