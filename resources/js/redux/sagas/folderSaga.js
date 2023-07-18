import {
  put, fork, takeLatest, call,
} from 'redux-saga/effects'
import {
  constants as folderConstants,
  actions as folderActions,
} from '../modules/folder'
import { actions as userActions } from '../modules/user'
import {
  getFolders,
  createNewFolder,
  updateFolderApi,
  deleteFolderApi,
} from '../../common/api/module/folder'

export function* fetchFolders() {
  try {
    const response = yield call(getFolders)
    const { data } = response.data
    if (response.status === 200) {
      yield put(
        folderActions.getFoldersResult({
          error: null,
          loading: false,
          success: true,
          folders: data.data,
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
        folderActions.getFoldersResult({
          error: error.response ? error.response.data : error,
          success: false,
          status: 200,
          loading: false,
          folders: [],
        })
      )
    } else {
      yield put(
        folderActions.getFoldersResult({
          error: error.response ? error.response.data : error,
          success: false,
          status: 200,
          loading: false,
          folders: [],
        })
      )
    }
  }
}

export function* createFolder({ payload }) {
  try {
    const { name } = payload
    const response = yield call(createNewFolder, { name })
    const { data } = response.data
    if (response.status === 200) {
      yield put(
        folderActions.createFolderResult({
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
        folderActions.createFolderResult({
          error: error.response ? error.response.data : error,
          success: false,
          status: 200,
          loading: false,
          data: null,
        })
      )
    } else {
      yield put(
        folderActions.createFolderResult({
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

export function* updateFolder({ payload }) {
  try {
    const response = yield call(updateFolderApi, payload)
    const { data } = response.data
    if (response.status === 200) {
      yield put(
        folderActions.updateFolderResult({
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
        folderActions.updateFolderResult({
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

export function* deleteFolder({ payload }) {
  const { id } = payload
  try {
    const response = yield call(deleteFolderApi, { id })
    const { data } = response.data
    if (response.status === 200) {
      yield put(
        folderActions.deleteFolderResult({
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
        folderActions.deleteFolderResult({
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

function* watchFetchFolders() {
  yield takeLatest(folderConstants.GET_FOLDERS, fetchFolders)
  yield takeLatest(folderConstants.CREATE_FOLDER, createFolder)
  yield takeLatest(folderConstants.UPDATE_FOLDER, updateFolder)
  yield takeLatest(folderConstants.DELETE_FOLDER, deleteFolder)
}

export const folderSaga = [fork(watchFetchFolders)]
