import {
  put, fork, takeLatest, call,
} from 'redux-saga/effects'
import {
  constants as creditConstants,
  actions as creditActions,
} from '../modules/credit'
import { actions as userActions } from '../modules/user'

import {
  getCreditPackages,
  chargeCredit,
  subscribe,
  addCard,
  getPlans,
  subscribeUpdate,
  removeCard,
  setDefaultCard,
  endUserTrial,
  getUpcomingInvoiceApi,
  getAddons,
} from '~api/module/credit'

export function* getPackages() {
  yield put(
    creditActions.getCreditPackagesResult({
      error: null,
      loading: true,
      success: false,
    })
  )

  try {
    const response = yield call(getCreditPackages)
    if (response.status === 200) {
      yield put(
        creditActions.getCreditPackagesResult({
          error: null,
          loading: false,
          success: true,
          data: response.data.data.data,
        })
      )
    }
  } catch (error) {
    const { status } = error.response
    if (status === 401) {
      yield put(userActions.initUserResult())
    }
    yield put(
      creditActions.getCreditPackagesResult({
        error: error.response.data,
        loading: false,
        success: false,
        data: [],
      })
    )
  }
}

export function* charge({ payload }) {
  yield put(
    creditActions.chargeCreditResult({
      error: null,
      loading: true,
      success: false,
    })
  )

  const { packageId } = payload
  try {
    const response = yield call(chargeCredit, { packageId })
    if (response.status === 200) {
      yield put(
        creditActions.chargeCreditResult({
          error: null,
          loading: false,
          success: true,
          credit: response.data,
        })
      )
    }
  } catch (error) {
    const { status } = error.response
    if (status === 401) {
      yield put(userActions.initUserResult())
    }
    yield put(
      creditActions.chargeCreditResult({
        error: error.response.data,
        loading: false,
        success: false,
        data: null,
      })
    )
  }
}

export function* subscribePlan({ payload }) {
  yield put(
    creditActions.subscribeResult({
      error: null,
      loading: true,
      success: false,
    })
  )

  const {
    planId, stripeToken, customerName, promoCode, addOns,
  } = payload.data
  try {
    const response = yield call(subscribe, {
      stripeToken,
      planId,
      customerName,
      promoCode,
      addOns,
    })
    if (response.status === 200) {
      yield put(
        creditActions.subscribeResult({
          error: null,
          loading: false,
          success: true,
          data: response.data,
        })
      )
    }
  } catch (error) {
    const { status } = error.response
    if (status === 401) {
      yield put(userActions.initUserResult())
    }
    yield put(
      creditActions.subscribeResult({
        error: error.response.data,
        loading: false,
        success: false,
        data: null,
      })
    )
  }
}

export function* addNewCard({ payload }) {
  const { stripeToken } = payload.data
  try {
    const response = yield call(addCard, { stripeToken })
    if (response.status === 200) {
      yield put(
        creditActions.addCardResult({
          error: null,
          loading: false,
          success: true,
          data: response.data,
        })
      )
    }
  } catch (error) {
    const { status } = error.response
    if (status === 401) {
      yield put(userActions.initUserResult())
    }
    yield put(
      creditActions.addCardResult({
        error: error.response.data,
        loading: false,
        success: false,
        data: null,
      })
    )
  }
}

export function* getAddonList({ payload }) {
  const period = payload.data
  yield put(
    creditActions.getAddonsResult({
      error: null,
      loading: true,
      success: false,
    })
  )

  try {
    const response = yield call(getAddons, { period })
    if (response.status === 200) {
      yield put(
        creditActions.getAddonsResult({
          error: null,
          loading: false,
          success: true,
          data: response.data,
        })
      )
    }
  } catch (error) {
    yield put(
      creditActions.getAddonsResult({
        error: error.response.data,
        loading: false,
        success: false,
        data: null,
      })
    )
  }
}

export function* getPlanList({ payload }) {
  const period = payload.data
  yield put(
    creditActions.getPlansResult({
      error: null,
      loading: true,
      success: false,
    })
  )

  try {
    const response = yield call(getPlans, { period })
    if (response.status === 200) {
      yield put(
        creditActions.getPlansResult({
          error: null,
          loading: false,
          success: true,
          data: response.data,
        })
      )
    }
  } catch (error) {
    yield put(
      creditActions.getPlansResult({
        error: error.response.data,
        loading: false,
        success: false,
        data: null,
      })
    )
  }
}

export function* subscribeChange({ payload }) {
  const { planId } = payload
  try {
    const response = yield call(subscribeUpdate, { planId })
    if (response.status === 200) {
      yield put(
        creditActions.subscribeChangeResult({
          error: null,
          loading: false,
          success: true,
          data: response.data,
        })
      )
    }
  } catch (error) {
    const { status } = error.response
    if (status === 401) {
      yield put(userActions.initUserResult())
    }
    yield put(
      creditActions.subscribeChangeResult({
        error: error.response.data,
        loading: false,
        success: false,
        data: null,
      })
    )
  }
}

export function* removePaymentMethod({ payload }) {
  const { cardId } = payload
  try {
    const response = yield call(removeCard, { cardId })
    if (response.status === 200) {
      yield put(
        creditActions.removeCardResult({
          error: null,
          loading: false,
          success: true,
          data: response.data,
        })
      )
    }
  } catch (error) {
    const { status } = error.response
    if (status === 401) {
      yield put(userActions.initUserResult())
    }
    yield put(
      creditActions.removeCardResult({
        error: error.response.data,
        loading: false,
        success: false,
        data: null,
      })
    )
  }
}

export function* setDefaultPaymentMethod({ payload }) {
  const { cardId } = payload
  try {
    const response = yield call(setDefaultCard, { cardId })
    if (response.status === 200) {
      yield put(
        creditActions.setDefaultCardResult({
          error: null,
          loading: false,
          success: true,
          data: response.data,
        })
      )
    }
  } catch (error) {
    const { status } = error.response
    if (status === 401) {
      yield put(userActions.initUserResult())
    }
    yield put(
      creditActions.setDefaultCardResult({
        error: error.response.data,
        loading: false,
        success: false,
        data: null,
      })
    )
  }
}

export function* endTrial() {
  try {
    const response = yield call(endUserTrial)
    if (response.status === 200) {
      yield put(
        creditActions.endTrialResult({
          error: null,
          loading: false,
          success: true,
          data: response.data,
        })
      )
    }
  } catch (error) {
    const { status } = error.response
    if (status === 401) {
      yield put(userActions.initUserResult())
    }
    yield put(
      creditActions.endTrialResult({
        error: error.response.data,
        loading: false,
        success: false,
        data: null,
      })
    )
  }
}

export function* getUpcomingInvoice() {
  try {
    const response = yield call(getUpcomingInvoiceApi)
    if (response.status === 200) {
      yield put(
        creditActions.getUpcomingInvoiceResult({
          error: null,
          loading: false,
          success: true,
          data: response.data.data,
        })
      )
    }
  } catch (error) {
    const { status } = error.response
    if (status === 401) {
      yield put(userActions.initUserResult())
    }
    yield put(
      creditActions.getUpcomingInvoiceResult({
        error: error.response.data,
        loading: false,
        success: false,
        data: null,
      })
    )
  }
}

function* watchCredit() {
  yield takeLatest(creditConstants.GET_CREDIT_PACKAGES, getPackages)
  yield takeLatest(creditConstants.CHARGE_CREDIT, charge)
  yield takeLatest(creditConstants.SUBSCRIBE, subscribePlan)
  yield takeLatest(creditConstants.ADD_CARD, addNewCard)
  yield takeLatest(creditConstants.GET_PLANS, getPlanList)
  yield takeLatest(creditConstants.SUBSCRIBE_CHANGE, subscribeChange)
  yield takeLatest(creditConstants.REMOVE_CARD, removePaymentMethod)
  yield takeLatest(creditConstants.SET_DEFAULT_CARD, setDefaultPaymentMethod)
  yield takeLatest(creditConstants.END_TRIAL, endTrial)
  yield takeLatest(creditConstants.GET_UPCOMING_INVOICE, getUpcomingInvoice)
  yield takeLatest(creditConstants.GET_ADDONS, getAddonList)
}

export const creditSaga = [fork(watchCredit)]
