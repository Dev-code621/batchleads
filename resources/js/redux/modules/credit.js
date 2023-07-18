import { createAction, handleActions } from 'redux-actions'
import immutable from 'immutability-helper'

const GET_CREDIT_PACKAGES = 'GET_CREDIT_PACKAGES'
const GET_CREDIT_PACKAGES_RESULT = 'GET_CREDIT_PACKAGES_RESULT'
const CHARGE_CREDIT = 'CHARGE_CREDIT'
const CHARGE_CREDIT_RESULT = 'CHARGE_CREDIT_RESULT'
const SUBSCRIBE = 'SUBSCRIBE'
const SUBSCRIBE_RESULT = 'SUBSCRIBE_RESULT'
const INIT_ADD_CARD = 'INIT_ADD_CARD'
const ADD_CARD = 'ADD_CARD'
const ADD_CARD_RESULT = 'ADD_CARD_RESULT'
const GET_PLANS = 'GET_PLANS'
const GET_PLANS_RESULT = 'GET_PLANS_RESULT'
const INIT_CHARGE_CREDIT = 'INIT_CHARGE_CREDIT'
const INIT_SUBSCRIBE_CHANGE = 'INIT_SUBSCRIBE_CHANGE'
const SUBSCRIBE_CHANGE = 'SUBSCRIBE_CHANGE'
const SUBSCRIBE_CHANGE_RESULT = 'SUBSCRIBE_CHANGE_RESULT'
const INIT_REMOVE_CARD = 'INIT_REMOVE_CARD'
const REMOVE_CARD = 'REMOVE_CARD'
const REMOVE_CARD_RESULT = 'REMOVE_CARD_RESULT'
const INIT_SET_DEFAULT_CARD = 'INIT_SET_DEFAULT_CARD'
const SET_DEFAULT_CARD = 'SET_DEFAULT_CARD'
const SET_DEFAULT_CARD_RESULT = 'SET_DEFAULT_CARD_RESULT'
const INIT_END_TRIAL = 'INIT_END_TRIAL'
const END_TRIAL = 'END_TRIAL'
const END_TRIAL_RESULT = 'END_TRIAL_RESULT'
const GET_UPCOMING_INVOICE = 'GET_UPCOMING_INVOICE'
const GET_UPCOMING_INVOICE_RESULT = 'GET_UPCOMING_INVOICE_RESULT'
const GET_ADDONS = 'GET_ADDONS'
const GET_ADDONS_RESULT = 'GET_ADDONS_RESULT'

export const constants = {
  GET_CREDIT_PACKAGES,
  GET_CREDIT_PACKAGES_RESULT,
  CHARGE_CREDIT,
  CHARGE_CREDIT_RESULT,
  SUBSCRIBE,
  SUBSCRIBE_RESULT,
  INIT_ADD_CARD,
  ADD_CARD,
  ADD_CARD_RESULT,
  GET_PLANS,
  GET_PLANS_RESULT,
  INIT_CHARGE_CREDIT,
  INIT_SUBSCRIBE_CHANGE,
  SUBSCRIBE_CHANGE,
  SUBSCRIBE_CHANGE_RESULT,
  INIT_REMOVE_CARD,
  REMOVE_CARD,
  REMOVE_CARD_RESULT,
  INIT_SET_DEFAULT_CARD,
  SET_DEFAULT_CARD,
  SET_DEFAULT_CARD_RESULT,
  INIT_END_TRIAL,
  END_TRIAL,
  END_TRIAL_RESULT,
  GET_UPCOMING_INVOICE,
  GET_UPCOMING_INVOICE_RESULT,
  GET_ADDONS,
  GET_ADDONS_RESULT,
}

// ------------------------------------
// Actions
// ------------------------------------
export const getCreditPackages = createAction(GET_CREDIT_PACKAGES, () => ({}))
export const getCreditPackagesResult = createAction(
  GET_CREDIT_PACKAGES_RESULT,
  (result) => ({ result })
)
export const chargeCredit = createAction(CHARGE_CREDIT, (packageId) => ({ packageId }))
export const chargeCreditResult = createAction(
  CHARGE_CREDIT_RESULT,
  (result) => ({ result })
)
export const subscribe = createAction(SUBSCRIBE, (data) => ({ data }))
export const subscribeResult = createAction(SUBSCRIBE_RESULT, (result) => ({
  result,
}))

export const initAddCard = createAction(INIT_ADD_CARD, () => ({}))
export const addCard = createAction(ADD_CARD, (data) => ({ data }))
export const addCardResult = createAction(ADD_CARD_RESULT, (result) => ({
  result,
}))

export const getPlans = createAction(GET_PLANS, (data) => ({ data }))
export const getPlansResult = createAction(GET_PLANS_RESULT, (result) => ({
  result,
}))
export const initChargeCredit = createAction(INIT_CHARGE_CREDIT, () => ({}))

export const initSubscribeChange = createAction(INIT_SUBSCRIBE_CHANGE, () => ({}))
export const subscribeChange = createAction(SUBSCRIBE_CHANGE, (planId) => ({ planId }))
export const subscribeChangeResult = createAction(SUBSCRIBE_CHANGE_RESULT, (result) => ({
  result,
}))

export const initRemoveCard = createAction(INIT_REMOVE_CARD, () => ({}))
export const removeCard = createAction(REMOVE_CARD, (cardId) => ({ cardId }))
export const removeCardResult = createAction(REMOVE_CARD_RESULT, (result) => ({
  result,
}))

export const initSetDefaultCard = createAction(INIT_SET_DEFAULT_CARD, () => ({}))
export const setDefaultCard = createAction(SET_DEFAULT_CARD, (cardId) => ({ cardId }))
export const setDefaultCardResult = createAction(SET_DEFAULT_CARD_RESULT, (result) => ({
  result,
}))

export const initEndTrial = createAction(INIT_END_TRIAL, () => ({}))
export const endTrial = createAction(END_TRIAL, () => ({}))
export const endTrialResult = createAction(END_TRIAL_RESULT, (result) => ({
  result,
}))

export const getUpcomingInvoice = createAction(GET_UPCOMING_INVOICE, () => ({}))
export const getUpcomingInvoiceResult = createAction(GET_UPCOMING_INVOICE_RESULT, (result) => ({
  result,
}))

export const getAddons = createAction(GET_ADDONS, () => ({}))
export const getAddonsResult = createAction(GET_ADDONS_RESULT, (result) => ({
  result,
}))

export const actions = {
  getCreditPackages,
  getCreditPackagesResult,
  chargeCredit,
  chargeCreditResult,
  subscribe,
  subscribeResult,
  initAddCard,
  addCard,
  addCardResult,
  getPlans,
  getPlansResult,
  initChargeCredit,
  initSubscribeChange,
  subscribeChange,
  subscribeChangeResult,
  initRemoveCard,
  removeCard,
  removeCardResult,
  initSetDefaultCard,
  setDefaultCard,
  setDefaultCardResult,
  initEndTrial,
  endTrial,
  endTrialResult,
  getUpcomingInvoice,
  getUpcomingInvoiceResult,
  getAddons,
  getAddonsResult,
}

export const reducers = {
  [GET_CREDIT_PACKAGES_RESULT]: (state, { payload }) => {
    return immutable(state, {
      packages: { $merge: payload.result },
    })
  },
  [CHARGE_CREDIT_RESULT]: (state, { payload }) => {
    return immutable(state, {
      chargeResult: { $set: payload.result },
    })
  },
  [INIT_CHARGE_CREDIT]: (state) => {
    return immutable(state, {
      chargeResult: { $set: null },
    })
  },
  [SUBSCRIBE]: (state) => {
    return immutable(state, {
      subscribeResult: { $set: null },
    })
  },
  [SUBSCRIBE_RESULT]: (state, { payload }) => {
    return immutable(state, {
      subscribeResult: { $set: payload.result },
    })
  },
  [INIT_ADD_CARD]: (state) => {
    return immutable(state, {
      addCardResult: { $set: null },
    })
  },
  [ADD_CARD]: (state) => {
    return immutable(state, {
      addCardResult: {
        $set: {
          loading: true,
          error: null,
          success: false,
        },
      },
    })
  },
  [ADD_CARD_RESULT]: (state, { payload }) => {
    return immutable(state, {
      addCardResult: { $set: payload.result },
    })
  },
  [GET_PLANS_RESULT]: (state, { payload }) => {
    return immutable(state, {
      plans: { $merge: payload.result },
    })
  },
  [SUBSCRIBE_CHANGE]: (state) => {
    return immutable(state, {
      subscribeChangeResult: {
        $set: {
          loading: true,
          error: null,
          success: false,
        },
      },
    })
  },
  [SUBSCRIBE_CHANGE_RESULT]: (state, { payload }) => {
    return immutable(state, {
      subscribeChangeResult: { $set: payload.result },
    })
  },
  [INIT_SUBSCRIBE_CHANGE]: (state) => {
    return immutable(state, {
      subscribeChangeResult: { $set: null },
    })
  },
  [INIT_REMOVE_CARD]: (state) => {
    return immutable(state, {
      removeCardResult: { $set: null },
    })
  },
  [REMOVE_CARD]: (state) => {
    return immutable(state, {
      removeCardResult: {
        $set: {
          loading: true,
          error: null,
          success: false,
        },
      },
    })
  },
  [REMOVE_CARD_RESULT]: (state, { payload }) => {
    return immutable(state, {
      removeCardResult: { $set: payload.result },
    })
  },
  [INIT_SET_DEFAULT_CARD]: (state) => {
    return immutable(state, {
      setDefaultCardResult: { $set: null },
    })
  },
  [SET_DEFAULT_CARD]: (state) => {
    return immutable(state, {
      setDefaultCardResult: {
        $set: {
          loading: true,
          error: null,
          success: false,
        },
      },
    })
  },
  [SET_DEFAULT_CARD_RESULT]: (state, { payload }) => {
    return immutable(state, {
      setDefaultCardResult: { $set: payload.result },
    })
  },
  [END_TRIAL]: (state) => {
    return immutable(state, {
      endTrialResult: {
        $set: {
          loading: true,
          error: null,
          success: false,
        },
      },
    })
  },
  [END_TRIAL_RESULT]: (state, { payload }) => {
    return immutable(state, {
      endTrialResult: { $set: payload.result },
    })
  },
  [INIT_END_TRIAL]: (state) => {
    return immutable(state, {
      endTrialResult: { $set: null },
    })
  },
  [GET_UPCOMING_INVOICE_RESULT]: (state, { payload }) => {
    return immutable(state, {
      upcomingInvoiceResult: { $set: payload.result },
    })
  },
  [GET_ADDONS_RESULT]: (state, { payload }) => {
    return immutable(state, {
      addons: { $merge: payload.result },
    })
  },
}

export const initialState = () => {
  return {
    plans: {
      error: null,
      success: false,
      status: 200,
      data: [],
    },
    packages: {
      error: null,
      success: false,
      status: 200,
      data: [],
    },
    chargeResult: {
      loading: false,
      error: null,
      success: false,
      status: 200,
      data: null,
    },
    subscribeResult: {
      loading: false,
      error: null,
      success: false,
      status: 200,
      data: null,
    },
    addCardResult: {
      loading: false,
    },
    subscribeChangeResult: {
      loading: false,
    },
    removeCardResult: {
      loading: false,
    },
    setDefaultCardResult: {
      loading: false,
    },
    endTrialResult: null,
    upcomingInvoiceResult: null,
    addons: {
      error: null,
      success: false,
      status: 200,
      data: [],
    },
  }
}

export default handleActions(reducers, initialState())
