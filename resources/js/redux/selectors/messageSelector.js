import { createSelector } from 'reselect'

const messageDataSelector = (state) => state.message

const messageBoxSelector = createSelector(
  messageDataSelector,
  (payload) => {
    return {
      ...payload.get('messageBox').toJS(),
    }
  }
)

const messageHistorySelector = createSelector(
  messageDataSelector,
  (payload) => {
    return {
      ...payload.get('messageHistory').toJS(),
    }
  }
)

const masterSelector = createSelector(
  messageDataSelector,
  (payload) => {
    return {
      ...payload.get('master').toJS(),
    }
  }
)

const sendMessageSelector = createSelector(
  messageDataSelector,
  (payload) => {
    return {
      ...payload.get('sendMessage').toJS(),
    }
  }
)

const badgeSelector = createSelector(
  messageDataSelector,
  (payload) => {
    return payload.get('badge')
  }
)

export const deleteMasterSelector = createSelector(
  messageDataSelector,
  (payload) => {
    return payload.get('deleteMessageBox').toJS()
  }
)

export const messageSelector = (state) => ({
  messageBox: messageBoxSelector(state),
  messageHistory: messageHistorySelector(state),
  master: masterSelector(state),
  sendingMessage: sendMessageSelector(state),
  badge: badgeSelector(state),
  deleteMaster: deleteMasterSelector(state),
})

export const smsMastersSelector = createSelector(
  messageDataSelector,
  (payload) => {
    return payload.get('smsMasters').toJS()
  }
)
