import {
  put, fork, takeLatest, call,
} from 'redux-saga/effects'
import {
  constants as signatureConstants,
  actions as signatureActions,
} from '../modules/signature'
import { actions as userActions } from '../modules/user'
import {
  getSignatures, newSignature, updateSignature, removeSignature,
} from '../../common/api/module/signature'

export function* fetchSignatures({ payload }) {
  const { page, search } = payload

  try {
    const response = yield call(getSignatures, { page, search })
    const { data } = response.data
    if (response.status === 200) {
      yield put(
        signatureActions.getSignaturesResult({
          error: null,
          loading: false,
          success: true,
          ...data,
          signatures: data.data,
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
        signatureActions.getSignaturesResult({
          error: null,
          success: false,
          status: 200,
          loading: false,
          signatures: [],
        })
      )
    } else {
      yield put(
        signatureActions.getSignaturesResult({
          error: null,
          success: false,
          status: 200,
          loading: false,
          signatures: [],
        })
      )
    }
  }
}

export function* create({ payload }) {
  const { signature } = payload

  try {
    const response = yield call(newSignature, { signature })
    const { data } = response.data

    if (response.status === 200) {
      yield put(
        signatureActions.createSignatureResult({
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
        signatureActions.createSignatureResult({
          error: error.response.data,
          success: false,
          loading: false,
          status,
        })
      )
    } else {
      yield put(
        signatureActions.createSignatureResult({
          success: false,
          loading: false,
        })
      )
    }
  }
}

export function* update({ payload }) {
  const { signature } = payload

  try {
    const response = yield call(updateSignature, { signature })
    const { data } = response.data

    if (response.status === 200) {
      yield put(
        signatureActions.updateSignatureResult({
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
        signatureActions.updateSignatureResult({
          error: error.response.data,
          success: false,
          loading: false,
          status,
        })
      )
    } else {
      yield put(
        signatureActions.updateSignatureResult({
          success: false,
          loading: false,
        })
      )
    }
  }
}

export function* remove({ payload }) {
  const { id } = payload

  try {
    const response = yield call(removeSignature, { id })

    if (response.status === 200) {
      yield put(
        signatureActions.removeSignatureResult({
          error: null,
          loading: false,
          success: true,
          id,
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
        signatureActions.removeSignatureResult({
          error: error.response.data,
          success: false,
          loading: false,
          status,
        })
      )
    } else {
      yield put(
        signatureActions.removeSignatureResult({
          success: false,
          loading: false,
        })
      )
    }
  }
}

function* watchSignatures() {
  yield takeLatest(signatureConstants.GET_SIGNATURES, fetchSignatures)
  yield takeLatest(signatureConstants.CREATE_SIGNATURE, create)
  yield takeLatest(signatureConstants.UPDATE_SIGNATURE, update)
  yield takeLatest(signatureConstants.REMOVE_SIGNATURE, remove)
}

export const signatureSaga = [fork(watchSignatures)]
