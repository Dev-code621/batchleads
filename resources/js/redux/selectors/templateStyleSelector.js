import { createSelector } from 'reselect'

const styleDataSelector = (state) => state.templateStyle

const stylesSelector = createSelector(
  styleDataSelector,
  (payload) => {
    const result = payload.get('styles', [])
    return {
      result,
    }
  }
)

export const templateStyleSelector = (state) => ({
  ...stylesSelector(state),
})
