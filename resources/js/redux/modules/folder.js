import { createAction, handleActions } from 'redux-actions'
import { fromJS } from 'immutable'

const GET_FOLDERS = 'GET_FOLDERS'
const GET_FOLDERS_RESULT = 'GET_FOLDERS_RESULT'
const CREATE_FOLDER = 'CREATE_FOLDER'
const CREATE_FOLDER_RESULT = 'CREATE_FOLDER_RESULT'
const INIT_FOLDER_EDIT = 'INIT_FOLDER_EDIT'
const UPDATE_FOLDER = 'UPDATE_FOLDER'
const UPDATE_FOLDER_RESULT = 'UPDATE_FOLDER_RESULT'
const DELETE_FOLDER = 'DELETE_FOLDER'
const DELETE_FOLDER_RESULT = 'DELETE_FOLDER_RESULT'

export const constants = {
  GET_FOLDERS,
  GET_FOLDERS_RESULT,
  CREATE_FOLDER,
  CREATE_FOLDER_RESULT,
  INIT_FOLDER_EDIT,
  UPDATE_FOLDER,
  UPDATE_FOLDER_RESULT,
  DELETE_FOLDER,
  DELETE_FOLDER_RESULT,
}

// ------------------------------------
// Actions
// ------------------------------------
export const getFolders = createAction(GET_FOLDERS, () => ({
}))
export const getFoldersResult = createAction(
  GET_FOLDERS_RESULT,
)

export const createFolder = createAction(CREATE_FOLDER, (name) => ({
  name,
}))
export const createFolderResult = createAction(
  CREATE_FOLDER_RESULT,
)

export const initFolderEdit = createAction(
  INIT_FOLDER_EDIT,
)

export const updateFolder = createAction(UPDATE_FOLDER, (id, name) => ({
  id,
  name,
}))

export const updateFolderResult = createAction(
  UPDATE_FOLDER_RESULT,
)

export const deleteFolder = createAction(DELETE_FOLDER, (id) => ({ id }))

export const deleteFolderResult = createAction(
  DELETE_FOLDER_RESULT,
)

export const actions = {
  getFolders,
  getFoldersResult,
  createFolder,
  createFolderResult,
  initFolderEdit,
  updateFolder,
  updateFolderResult,
  deleteFolder,
  deleteFolderResult,
}

export const reducers = {
  [GET_FOLDERS]: (state) => {
    return state.merge({
      loading: true,
      error: {},
    })
  },
  [GET_FOLDERS_RESULT]: (state, { payload }) => {
    if (payload.error) {
      return state.merge({ ...payload })
    }
    return state.merge({
      loading: false,
      folders: fromJS(payload.folders),
    })
  },
  [CREATE_FOLDER]: (state) => {
    return state.merge({
      loading: true,
      error: {},
    })
  },
  [CREATE_FOLDER_RESULT]: (state, { payload }) => {
    if (payload.error) {
      return state.merge({ ...payload })
    }
    const { data } = payload
    const folders = state.get('folders').toJS()
    if (data) {
      folders.unshift(data)
    }

    return state.merge({
      loading: false,
      folders: fromJS(folders),
    })
  },
  [INIT_FOLDER_EDIT]: (state) => {
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
  [UPDATE_FOLDER]: (state) => {
    return state.merge({
      updateResult: {
        loading: true, success: false, error: null,
      },
    })
  },
  [UPDATE_FOLDER_RESULT]: (state, { payload }) => {
    if (payload.error) {
      return state.merge({ updateResult: { ...payload } })
    }
    const newFolders = state.get('folders').toJS().map((folder) => (
      folder.id === payload.data.id ? payload.data : folder
    ))
    return state
      .merge({ updateResult: { ...payload } })
      .setIn(['folders'], fromJS(newFolders));
  },
  [DELETE_FOLDER]: (state) => {
    return state.merge({
      deleteResult: {
        loading: true, success: false, error: null,
      },
    })
  },
  [DELETE_FOLDER_RESULT]: (state, { payload }) => {
    if (payload.error) {
      return state.merge({ deleteResult: { ...payload } })
    }
    const newFolders = state.get('folders').toJS().filter((folder) => (
      folder.id !== payload.id
    ))
    return state
      .merge({ deleteResult: { ...payload } })
      .setIn(['folders'], fromJS(newFolders));
  },
}

export const initialState = () => fromJS({
  folders: [],
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
