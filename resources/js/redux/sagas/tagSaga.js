import {
  put, fork, takeLatest, call,
} from 'redux-saga/effects'
import {
  constants as tagConstants,
  actions as tagActions,
} from '../modules/tag'
import { actions as userActions } from '../modules/user'
import { getTagsApi, createTagApi, updateTagApi, deleteTagApi } from '../../common/api/module/tag'

export function* fetchTags() {
  try {
    const response = yield call(getTagsApi)
    const { data } = response.data
    if (response.status === 200) {
      yield put(
        tagActions.getTagsResult({
          error: null,
          loading: false,
          success: true,
          items: data.data,
        })
      )
    }
  } catch (error) {
    if (error.response) {
      const { status } = error.response
      if (status === 401) {
        yield put(userActions.initUserResult())
      }
      yield put(
        tagActions.getTagsResult({
          error: error.response ? error.response.data : error,
          success: false,
          status: 200,
          loading: false,
          items: [],
        })
      )
    } else {
      yield put(
        tagActions.getTagsResult({
          error: error.response ? error.response.data : error,
          success: false,
          status: 200,
          loading: false,
          items: [],
        })
      )
    }
  }
}

export function* createTag({ payload }) {
  try {
    const { name } = payload
    const response = yield call(createTagApi, { name })
    const { data } = response.data
    if (response.status === 200) {
      yield put(
        tagActions.createTagResult({
          error: null,
          loading: false,
          success: true,
          data,
        })
      )
    }
  } catch (error) {
    if (error.response) {
      const { status } = error.response
      if (status === 401) {
        yield put(userActions.initUserResult())
      }
      yield put(
        tagActions.createTagResult({
          error: error.response ? error.response.data : error,
          success: false,
          status: 200,
          loading: false,
          data: null,
        })
      )
    } else {
      yield put(
        tagActions.createTagResult({
          error: error.response ? error.response.data : error,
          success: false,
          status: 200,
          loading: false,
          data: null,
        })
      )
    }
  }
}

export function* updateTag({ payload }) {
  try {
    const response = yield call(updateTagApi, payload)
    const { data } = response.data
    if (response.status === 200) {
      yield put(
        tagActions.updateTagResult({
          error: null,
          loading: false,
          success: true,
          data,
        })
      )
    }
  } catch (error) {
    const { status } = error.response
    if (status === 401) {
      yield put(userActions.initUserResult())
    } else {
      yield put(
        tagActions.updateTagResult({
          error: error.response ? error.response.data : error,
          success: false,
          status: 200,
          loading: false,
          data: null,
        })
      )
    }
  }
}

export function* deleteTag({ payload }) {
  const { id } = payload
  try {
    const response = yield call(deleteTagApi, { id })
    const { data } = response.data
    if (response.status === 200) {
      yield put(
        tagActions.deleteTagResult({
          error: null,
          loading: false,
          success: true,
          data,
          id,
        })
      )
    }
  } catch (error) {
    const { status } = error.response
    if (status === 401) {
      yield put(userActions.initUserResult())
    } else {
      yield put(
        tagActions.deleteTagResult({
          error: error.response ? error.response.data : error,
          success: false,
          status: 200,
          loading: false,
          data: null,
        })
      )
    }
  }
}


function* watchFetchTags() {
  yield takeLatest(tagConstants.GET_TAGS, fetchTags)
  yield takeLatest(tagConstants.CREATE_TAG, createTag)
  yield takeLatest(tagConstants.UPDATE_TAG, updateTag)
  yield takeLatest(tagConstants.DELETE_TAG, deleteTag)
}

export const tagSaga = [fork(watchFetchTags)]
