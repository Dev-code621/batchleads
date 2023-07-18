import { createSelector } from 'reselect'

const folderDataSelector = (state) => state.folder

const foldersSelector = createSelector(
  folderDataSelector,
  (payload) => payload.get('folders').toJS()
)

const updateSelector = createSelector(
  folderDataSelector,
  (payload) => payload.get('updateResult').toJS()
)

const deleteSelector = createSelector(
  folderDataSelector,
  (payload) => payload.get('deleteResult').toJS()
)

const loadSelector = createSelector(
  folderDataSelector,
  (payload) => payload.get('loading')
)

const errorSelector = createSelector(
  folderDataSelector,
  (payload) => payload.get('error').toJS()
)

export const folderSelector = (state) => foldersSelector(state)
export const folderUpdateSelector = (state) => updateSelector(state)
export const folderDeleteSelector = (state) => deleteSelector(state)
export const folderLoadingSelector = (state) => loadSelector(state)
export const folderErrorSelector = (state) => errorSelector(state)
