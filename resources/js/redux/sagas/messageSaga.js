import { delay } from 'redux-saga'
import {
  put, fork, takeLatest, call,
} from 'redux-saga/effects'
import { constants as messageConstants, actions as messageActions } from '../modules/message'
import {
  getMessageBox,
  getMessageHistory,
  sendMessage,
  getMaster,
  getTotalBadge,
  markMessageRead,
  deleteMessageBoxApi,
  getSmsMastersApi,
} from '~api/module/message'
import { actions as userActions } from '../modules/user'

export function* fetchMessageBox({ payload }) {
  const { page, search } = payload

  try {
    const response = yield call(getMessageBox, { page, search })
    const { data } = response.data

    if (response.status === 200) {
      yield put(
        messageActions.getMessageBoxResult({
          error: null,
          loading: false,
          success: true,
          page: data.page,
          total: data.total,
          count: data.count,
          count_per_page: data.count_per_page,
          data: data.data,
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
        messageActions.getMessageBoxResult({
          error: null,
          loading: false,
          success: false,
          page: 0,
          total: 0,
          count: 0,
          count_per_page: 0,
          data: [],
        })
      )
    } else {
      yield put(
        messageActions.getMessageBoxResult({
          error: null,
          loading: false,
          success: false,
          page: 0,
          total: 0,
          count: 0,
          count_per_page: 0,
          data: [],
        })
      )
    }
  }
}

export function* fetchMessageHistory({ payload }) {
  const { masterId, page, search } = payload

  try {
    const response = yield call(getMessageHistory, { masterId, page, search })
    const { data } = response.data

    if (response.status === 200) {
      yield put(
        messageActions.getMessageHistoryResult({
          error: null,
          loading: false,
          success: true,
          page: data.page,
          total: data.total,
          count: data.count,
          count_per_page: data.count_per_page,
          data: data.data,
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
        messageActions.getMessageHistoryResult({
          error: null,
          loading: false,
          success: false,
          page: 0,
          total: 0,
          count: 0,
          count_per_page: 0,
          data: [],
        })
      )
    } else {
      yield put(
        messageActions.getMessageHistoryResult({
          error: null,
          loading: false,
          success: false,
          page: 0,
          total: 0,
          count: 0,
          count_per_page: 0,
          data: [],
        })
      )
    }
  }
}

export function* fetchMaster({ payload }) {
  const { masterId } = payload

  try {
    const response = yield call(getMaster, { masterId })
    const { data } = response.data

    if (response.status === 200) {
      yield put(
        messageActions.setSelectedMaster({ ...data })
      )
    }
  } catch (error) {
    if (error.response) {
      const { status } = error.response
      if (status === 401) {
        yield put(userActions.initUserResult())
      }
    }
  }
}

export function* fetchSendMessage({ payload }) {
  const { message, receiver, id } = payload

  try {
    const response = yield call(sendMessage, { message, receiver })

    if (response.status === 200) {
      const { data } = response.data
      data.old_id = id
      yield put(
        messageActions.sendMessageResult({
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
        messageActions.sendMessageResult({
          error,
          loading: false,
          success: false,
          data: null,
        })
      )
    } else {
      yield put(
        messageActions.sendMessageResult({
          error,
          loading: false,
          success: false,
          data: null,
        })
      )
    }
  }
}

export function* fetchReceiveMessage() {
  yield call(delay, 500)
  yield put(
    messageActions.receiveMessageResult()
  )
}

export function* fetchTotalBadge() {
  try {
    const response = yield call(getTotalBadge)
    const { data } = response.data

    if (response.status === 200) {
      yield put(
        messageActions.getTotalBadgeResult({
          badge: data.badge,
        })
      )
    }
  } catch (error) {
    if (error.response) {
      const { status } = error.response
      if (status === 401) {
        yield put(userActions.initUserResult())
      }
    }
  }
}

export function* fetchMarkMessageRead({ payload }) {
  try {
    const { id } = payload
    const response = yield call(markMessageRead, { id })
    const { data } = response.data

    if (response.status === 200) {
      yield put(
        messageActions.getTotalBadge({
          badge: data.badge,
        })
      )
    }
  } catch (error) {
    if (error.response) {
      const { status } = error.response
      if (status === 401) {
        yield put(userActions.initUserResult())
      }
    }
  }
}

export function* deleteMessageBox({ payload }) {
  try {
    const { masterId } = payload
    const response = yield call(deleteMessageBoxApi, { masterId })

    if (response.status === 200) {
      yield put(
        messageActions.deleteMessageMasterResult({
          loading: false,
          success: true,
        })
      )
    } else {
      yield put(
        messageActions.deleteMessageMasterResult({
          loading: false,
          success: false,
        })
      )
    }
  } catch (error) {
    if (error.response) {
      const { status } = error.response
      if (status === 401) {
        yield put(userActions.initUserResult())
      }
    }
    yield put(
      messageActions.deleteMessageMasterResult({
        loading: false,
        success: false,
      })
    )
  }
}

export function* getSmsMasters({ payload }) {
  try {
    const { propertyId } = payload
    const response = yield call(getSmsMastersApi, { propertyId })

    if (response.status === 200) {
      const { data } = response.data
      yield put(
        messageActions.getSmsMastersResult({
          loading: false,
          success: true,
          data,
        })
      )
    } else {
      yield put(
        messageActions.getSmsMastersResult({
          loading: false,
          success: false,
        })
      )
    }
  } catch (error) {
    if (error.response) {
      const { status } = error.response
      if (status === 401) {
        yield put(userActions.initUserResult())
      }
    }
    yield put(
      messageActions.getSmsMastersResult({
        loading: false,
        success: false,
      })
    )
  }
}

function* watchMessages() {
  yield takeLatest(messageConstants.GET_MESSAGE_BOX, fetchMessageBox)
  yield takeLatest(messageConstants.GET_MESSAGE_HISTORY, fetchMessageHistory)
  yield takeLatest(messageConstants.SEND_MESSAGE, fetchSendMessage)
  yield takeLatest(messageConstants.GET_MASTER, fetchMaster)
  yield takeLatest(messageConstants.RECEIVE_MESSAGE, fetchReceiveMessage)
  yield takeLatest(messageConstants.GET_TOTAL_BADGE, fetchTotalBadge)
  yield takeLatest(messageConstants.MARK_MESSAGE_READ, fetchMarkMessageRead)
  yield takeLatest(messageConstants.DELETE_MESSAGE_MASTER, deleteMessageBox)
  yield takeLatest(messageConstants.GET_SMS_MASTERS, getSmsMasters)
}

export const messageSaga = [
  fork(watchMessages),
]
