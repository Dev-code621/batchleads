import { createSelector } from 'reselect'

const creditDataSelector = (state) => state

const resultPackagesSelector = createSelector(
  creditDataSelector,
  (payload) => payload.credit.packages
)

const resultPlansSelector = createSelector(
  creditDataSelector,
  (payload) => payload.credit.plans
)

const resultChargeResultSelector = createSelector(
  creditDataSelector,
  (payload) => payload.credit.chargeResult
)

const resultSubscribeResultSelector = createSelector(
  creditDataSelector,
  (payload) => payload.credit.subscribeResult
)

const loadingResultSelector = createSelector(
  creditDataSelector,
  (payload) => payload.credit.loading
)

const subscribeChangeResultSelector = createSelector(
  creditDataSelector,
  (payload) => payload.credit.subscribeChangeResult
)

const addCardResultSelector = createSelector(
  creditDataSelector,
  (payload) => payload.credit.addCardResult
)

const removeCardResultSelector = createSelector(
  creditDataSelector,
  (payload) => payload.credit.removeCardResult
)

const setDefaultCardResultSelector = createSelector(
  creditDataSelector,
  (payload) => payload.credit.setDefaultCardResult
)

const resultAddonsSelector = createSelector(
  creditDataSelector,
  (payload) => payload.credit.addons
)

export const endTrialResultSelector = createSelector(
  creditDataSelector,
  (payload) => payload.credit.endTrialResult
)

export const upcomingInvoiceResultSelector = createSelector(
  creditDataSelector,
  (payload) => payload.credit.upcomingInvoiceResult
)

export const creditSelector = (state) => ({
  packages: resultPackagesSelector(state),
  chargeResult: resultChargeResultSelector(state),
  subscribeResult: resultSubscribeResultSelector(state),
  plans: resultPlansSelector(state),
  loading: loadingResultSelector(state),
  subscribeChangeResult: subscribeChangeResultSelector(state),
  addCardResult: addCardResultSelector(state),
  removeCardResult: removeCardResultSelector(state),
  setDefaultCardResult: setDefaultCardResultSelector(state),
  endTrialResult: endTrialResultSelector(state),
  upcomingInvoice: upcomingInvoiceResultSelector(state),
  addons: resultAddonsSelector(state),
})
