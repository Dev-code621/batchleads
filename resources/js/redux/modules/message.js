import { createAction, handleActions } from 'redux-actions';
import { fromJS } from 'immutable'
import { now } from 'moment';

const GET_MESSAGE_BOX = 'GET_MESSAGE_BOX'
const GET_MESSAGE_BOX_RESULT = 'GET_MESSAGE_BOX_RESULT'
const GET_TOTAL_BADGE = 'GET_TOTAL_BADGE'
const GET_TOTAL_BADGE_RESULT = 'GET_TOTAL_BADGE_RESULT'
const INIT_MESSAGE_BOX = 'INIT_MESSAGE_BOX'
const GET_MESSAGE_HISTORY = 'GET_MESSAGE_HISTORY'
const GET_MESSAGE_HISTORY_RESULT = 'GET_MESSAGE_HISTORY_RESULT'
const INIT_MESSAGE_HISTORY = 'INIT_MESSAGE_HISTORY'
const SET_SELECTED_MASTER = 'SET_SELECTED_MASTER'
const SEND_MESSAGE = 'SEND_MESSAGE'
const SEND_MESSAGE_RESULT = 'SEND_MESSAGE_RESULT'
const RECEIVE_MESSAGE = 'RECEIVE_MESSAGE'
const RECEIVE_MESSAGE_RESULT = 'RECEIVE_MESSAGE_RESULT'
const GET_MASTER = 'GET_MASTER'
const MARK_MESSAGE_READ = 'MARK_MESSAGE_READ'
const MARK_MESSAGE_READ_RESULT = 'MARK_MESSAGE_READ_RESULT'
const INIT_DELETE_MESSAGE_MASTER = 'INIT_DELETE_MESSAGE_MASTER'
const DELETE_MESSAGE_MASTER = 'DELETE_MESSAGE_MASTER'
const DELETE_MESSAGE_MASTER_RESULT = 'DELETE_MESSAGE_MASTER_RESULT'
const GET_SMS_MASTERS = 'GET_SMS_MASTERS'
const GET_SMS_MASTERS_RESULT = 'GET_SMS_MASTERS_RESULT'

export const constants = {
  GET_MESSAGE_BOX,
  GET_MESSAGE_BOX_RESULT,
  INIT_MESSAGE_BOX,
  GET_MESSAGE_HISTORY,
  GET_MESSAGE_HISTORY_RESULT,
  INIT_MESSAGE_HISTORY,
  SET_SELECTED_MASTER,
  SEND_MESSAGE,
  SEND_MESSAGE_RESULT,
  GET_MASTER,
  RECEIVE_MESSAGE,
  RECEIVE_MESSAGE_RESULT,
  GET_TOTAL_BADGE,
  GET_TOTAL_BADGE_RESULT,
  MARK_MESSAGE_READ,
  MARK_MESSAGE_READ_RESULT,
  INIT_DELETE_MESSAGE_MASTER,
  DELETE_MESSAGE_MASTER,
  DELETE_MESSAGE_MASTER_RESULT,
  GET_SMS_MASTERS,
  GET_SMS_MASTERS_RESULT,
};

export const getMessageBox = createAction(GET_MESSAGE_BOX, (page = 1, search = '') => ({ page, search }))
export const getMessageBoxResult = createAction(
  GET_MESSAGE_BOX_RESULT,
  (messageBox) => ({ messageBox })
)
export const initMessageBox = createAction(INIT_MESSAGE_BOX, () => ({}))

export const getMessageHistory = createAction(GET_MESSAGE_HISTORY, (masterId, page = 1, search = '') => ({ masterId, page, search }))
export const getMessageHistoryResult = createAction(
  GET_MESSAGE_HISTORY_RESULT,
  (messageHistory) => ({ messageHistory })
)
export const initMessageHistory = createAction(INIT_MESSAGE_HISTORY, () => ({}))

export const setSelectedMaster = createAction(SET_SELECTED_MASTER, (master) => ({ master }))

export const sendMessage = createAction(
  SEND_MESSAGE,
  (id, message, receiver) => ({ id, message, receiver })
)
export const sendMessageResult = createAction(
  SEND_MESSAGE_RESULT,
  (message) => ({ message })
)

export const receiveMessage = createAction(
  RECEIVE_MESSAGE,
  (message) => ({
    message,
  })
)
export const receiveMessageResult = createAction(
  RECEIVE_MESSAGE_RESULT,
  () => ({})
)

export const getMaster = createAction(GET_MASTER, (masterId) => ({ masterId }))

export const getTotalBadge = createAction(GET_TOTAL_BADGE, () => ({ }))
export const getTotalBadgeResult = createAction(
  GET_TOTAL_BADGE_RESULT,
  (badge) => ({ badge })
)

export const markMessageRead = createAction(MARK_MESSAGE_READ, (id) => ({ id }))
export const markMessageReadResult = createAction(
  MARK_MESSAGE_READ_RESULT,
  (data) => ({ data })
)

export const initDeleteMessageMaster = createAction(INIT_DELETE_MESSAGE_MASTER, () => ({}))
export const deleteMessageMaster = createAction(DELETE_MESSAGE_MASTER, (masterId) => ({ masterId }))
export const deleteMessageMasterResult = createAction(
  DELETE_MESSAGE_MASTER_RESULT,
  (data) => ({ data })
)

export const getSmsMasters = createAction(GET_SMS_MASTERS, (propertyId) => ({ propertyId }))
export const getSmsMastersResult = createAction(
  GET_SMS_MASTERS_RESULT,
  (data) => ({ data })
)

export const actions = {
  getMessageBox,
  getMessageBoxResult,
  initMessageBox,
  getMessageHistory,
  getMessageHistoryResult,
  initMessageHistory,
  setSelectedMaster,
  sendMessage,
  sendMessageResult,
  getMaster,
  receiveMessage,
  receiveMessageResult,
  getTotalBadge,
  getTotalBadgeResult,
  markMessageRead,
  markMessageReadResult,
  initDeleteMessageMaster,
  deleteMessageMaster,
  deleteMessageMasterResult,
  getSmsMasters,
  getSmsMastersResult,
}

export const reducers = {
  [GET_MESSAGE_BOX]: (state) => state.mergeDeep({
    messageBox: {
      loading: true,
    },
  }),
  [GET_MESSAGE_BOX_RESULT]: (state, { payload }) => {
    const messageBox = state.get('messageBox').toJS()
    const { data } = messageBox
    const result = payload.messageBox ? payload.messageBox : null

    if (result) {
      const { page } = result
      if (Number(page) === 1) {
        return state.set('messageBox', fromJS(payload.messageBox))
      }
      const messageList = data.concat(result.data)
      return state.mergeDeep({
        messageBox: {
          ...payload.messageBox,
          data: messageList,
        },
      })
    }

    return state.mergeDeep({
      ...payload,
    })
  },
  [INIT_MESSAGE_BOX]: (state) => state.set('messageBox', fromJS({
    error: null,
    loading: false,
    success: false,
    page: 0,
    total: 0,
    count: 0,
    count_per_page: 0,
    data: [],
  })),
  [GET_MESSAGE_HISTORY]: (state) => state.mergeDeep({
    messageHistory: {
      loading: true,
    },
  }),
  [GET_MESSAGE_HISTORY_RESULT]: (state, { payload }) => {
    const messageHistory = state.get('messageHistory').toJS()
    const { data, new_added_count: newAddedCount } = messageHistory
    const result = payload.messageHistory ? payload.messageHistory : null
    const newData = result.data
    newData.splice(0, newAddedCount)

    if (result) {
      const { page } = result
      if (Number(page) === 1) {
        return state.set('messageHistory', fromJS(payload.messageHistory))
      }
      const messageList = data.concat(newData)
      return state.mergeDeep({
        messageHistory: {
          ...payload.messageHistory,
          data: messageList,
          new_added_count: 0,
        },
      })
    }

    return state.mergeDeep({
      ...payload,
    })
  },
  [INIT_MESSAGE_HISTORY]: (state) => state.set('messageHistory', fromJS({
    error: null,
    loading: false,
    success: false,
    page: 0,
    total: 0,
    count: 0,
    count_per_page: 0,
    data: [],
    new_added_count: 0,
  })),
  [SET_SELECTED_MASTER]: (state, { payload }) => state.mergeDeep({
    master: {
      ...payload.master,
    },
  }),

  [SEND_MESSAGE]: (state, { payload }) => {
    const { message, receiver, id } = payload
    const messageHistory = state.get('messageHistory').toJS()
    const { data, new_added_count: newAddedCount } = messageHistory
    data.unshift({
      message,
      receiver,
      id,
      updated_at: now(),
      loading: true,
    })

    return state.mergeDeep({
      sendMessage: {
        loading: true,
        error: null,
      },
      messageHistory: {
        data,
        new_added_count: newAddedCount + 1,
      },
    })
  },

  [SEND_MESSAGE_RESULT]: (state, { payload }) => {
    const messageHistory = state.get('messageHistory').toJS()
    const { data } = messageHistory
    const result = payload.message ? payload.message : null
    const { error } = result
    if (error) {
      return state.mergeDeep({
        sendMessage: {
          ...payload.message,
          loading: false,
          error: error.response.data.message,
        },
      })
    }

    const newData = result.data
    newData.loading = false

    if (result) {
      const oldItemId = result.data.old_id
      const oldItemIndex = data.findIndex((element) => element.id === oldItemId)
      data.splice(oldItemIndex, 1, newData)

      return state.mergeDeep({
        messageHistory: {
          data,
        },
        sendMessage: {
          ...payload.message,
          loading: false,
          error: null,
        },
      })
    }

    return state.mergeDeep({
      ...payload,
    })
  },

  [RECEIVE_MESSAGE]: (state, { payload }) => {
    const { message } = payload
    const messageHistory = state.get('messageHistory').toJS()
    const { data, new_added_count: newAddedCount } = messageHistory
    data.unshift({
      ...message,
    })

    return state.mergeDeep({
      messageHistory: {
        data,
        new_added_count: newAddedCount + 1,
        receiving: true,
      },
    })
  },
  [RECEIVE_MESSAGE_RESULT]: (state) => {
    return state.mergeDeep({
      messageHistory: {
        receiving: false,
      },
    })
  },

  [GET_TOTAL_BADGE_RESULT]: (state, { payload }) => {
    const { badge } = payload

    return state.mergeDeep({
      badge: badge.badge,
    })
  },

  [INIT_DELETE_MESSAGE_MASTER]: (state) => state.mergeDeep({
    deleteMessageBox: {
      loading: false,
      success: false,
    },
  }),
  [DELETE_MESSAGE_MASTER]: (state) => state.mergeDeep({
    deleteMessageBox: {
      loading: true,
      success: false,
    },
  }),
  [DELETE_MESSAGE_MASTER_RESULT]: (state, { payload }) => state.mergeDeep({
    deleteMessageBox: {
      ...payload.data,
    },
  }),
  [GET_SMS_MASTERS]: (state) => state.set('smsMasters', fromJS({
    loading: true,
    success: false,
    data: [],
  })),
  [GET_SMS_MASTERS_RESULT]: (state, { payload }) => state.mergeDeep({
    smsMasters: {
      ...payload.data,
    },
  }),
}

export const initialState = () => fromJS({
  messageBox: {
    error: null,
    loading: false,
    success: false,
    page: 0,
    total: 0,
    count: 0,
    count_per_page: 0,
    data: [],
  },
  messageHistory: {
    error: null,
    loading: false,
    success: false,
    page: 0,
    total: 0,
    count: 0,
    count_per_page: 0,
    data: [],
    new_added_count: 0,
  },
  master: {
    id: 0,
    user_id: 0,
    phone_number: null,
    latest_message: null,
  },
  sendMessage: {
    id: 0,
    message: null,
    receiver: null,
    loading: false,
  },
  badge: 0,
  deleteMessageBox: {
    loading: false,
    success: false,
  },
  smsMasters: {
    loading: false,
    success: false,
    data: [],
  },
})

export default handleActions(reducers, initialState())
