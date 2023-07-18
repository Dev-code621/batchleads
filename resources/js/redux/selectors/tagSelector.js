import { createSelector } from 'reselect'

const tagDataSelector = (state) => state.tag

const tagsSelector = createSelector(
  tagDataSelector,
  (payload) => payload.get('items').toJS()
)

const updateSelector = createSelector(
  tagDataSelector,
  (payload) => payload.get('updateResult').toJS()
)

const deleteSelector = createSelector(
  tagDataSelector,
  (payload) => payload.get('deleteResult').toJS()
)

const loadSelector = createSelector(
  tagDataSelector,
  (payload) => payload.get('loading')
)

const errorSelector = createSelector(
  tagDataSelector,
  (payload) => payload.get('error').toJS()
)

export const tagSelector = (state) => tagsSelector(state)
export const tagUpdateSelector = (state) => updateSelector(state)
export const tagDeleteSelector = (state) => deleteSelector(state)
export const tagLoadingSelector = (state) => loadSelector(state)
export const tagErrorSelector = (state) => errorSelector(state)
