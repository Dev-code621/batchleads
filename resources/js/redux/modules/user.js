import { createAction, handleActions } from 'redux-actions'
import immutable from 'immutability-helper'

const SIGNUP = 'SIGNUP'
const SIGNUP_RESULT = 'SIGNUP_RESULT'
const REGISTER_ONE_SIGNAL = 'REGISTER_ONE_SIGNAL'
const LOGIN = 'LOGIN'
const LOGIN_RESULT = 'LOGIN_RESULT'
const INIT_USER = 'INIT_USER'
const INIT_USER_RESULT = 'INIT_USER_RESULT'
const RESET_PASSWORD = 'RESET_PASSWORD'
const RESET_PASSWORD_RESULT = 'RESET_PASSWORD_RESULT'
const CHECK_LOGIN = 'CHECK_LOGIN'
const CHECK_LOGIN_RESULT = 'CHECK_LOGIN_RESULT'
const GET_USER_INFO = 'GET_USER_INFO'
const GET_USER_INFO_RESULT = 'GET_USER_INFO_RESULT'
const SET_LOADING = 'SET_LOADING'
const LOGOUT = 'LOGOUT'
const VERIFY = 'VERIFY'
const VERIFY_RESULT = 'VERIFY_RESULT'
const REVERIFY = 'REVERIFY'
const REVERIFY_RESULT = 'REVERIFY_RESULT'
const GET_TEAM_MEMBERS = 'GET_TEAM_MEMBERS'
const GET_TEAM_MEMBERS_RESULT = 'GET_TEAM_MEMBERS_RESULT'
const INVITE_MEMBER = 'INVITE_MEMBER'
const INVITE_MEMBER_RESULT = 'INVITE_MEMBER_RESULT'
const INIT_INVITE_MEMBER = 'INIT_INVITE_MEMBER'
const INIT_SELECTED_MEMBER = 'INIT_SELECTED_MEMBER'
const SET_SELECTED_MEMBER = 'SET_SELECTED_MEMBER'
const CANCEL_INVITATION = 'CANCEL_INVITATION'
const CANCEL_INVITATION_RESULT = 'CANCEL_INVITATION_RESULT'
const REMOVE_FROM_TEAM = 'REMOVE_FROM_TEAM'
const REMOVE_FROM_TEAM_RESULT = 'REMOVE_FROM_TEAM_RESULT'
const UPDATE_USER_ROLE = 'UPDATE_USER_ROLE'
const UPDATE_USER_ROLE_RESULT = 'UPDATE_USER_ROLE_RESULT'
const INIT_USER_PING = 'INIT_USER_PING'
const GET_USER_PING = 'GET_USER_PING'
const GET_USER_PING_RESULT = 'GET_USER_PING_RESULT'
const UPDATE_NOTIFICATION_SETTING = 'UPDATE_NOTIFICATION_SETTING'
const INIT_CHANGE_PASSWORD = 'INIT_CHANGE_PASSWORD'
const CHANGE_PASSWORD = 'CHANGE_PASSWORD'
const CHANGE_PASSWORD_RESULT = 'CHANGE_PASSWORD_RESULT'
const GET_PURCHASED_PHONE_NUMBERS = 'GET_PURCHASED_PHONE_NUMBERS'
const GET_PURCHASED_PHONE_NUMBERS_RESULT = 'GET_PURCHASED_PHONE_NUMBERS_RESULT'
const SEARCH_AVAILABLE_PHONE_NUMBERS = 'SEARCH_AVAILABLE_PHONE_NUMBERS'
const SEARCH_AVAILABLE_PHONE_NUMBERS_RESULT = 'SEARCH_AVAILABLE_PHONE_NUMBERS_RESULT'
const INIT_PURCHASE_PHONE_NUMBER = 'INIT_PURCHASE_PHONE_NUMBER'
const PURCHASE_PHONE_NUMBER = 'PURCHASE_PHONE_NUMBER'
const PURCHASE_PHONE_NUMBER_RESULT = 'PURCHASE_PHONE_NUMBER_RESULT'
const GET_TRANSACTION = 'GET_TRANSACTION'
const GET_TRANSACTION_RESULT = 'GET_TRANSACTION_RESULT'
const INIT_UPDATE_USER_INFO = 'INIT_UPDATE_USER_INFO'
const UPDATE_USER_INFO = 'UPDATE_USER_INFO'
const UPDATE_USER_INFO_RESULT = 'UPDATE_USER_INFO_RESULT'
const RESEND_VERIFICATION = 'RESEND_VERIFICATION'
const RESEND_VERIFICATION_RESULT = 'RESEND_VERIFICATION_RESULT'
const SET_CALL_FORWARD = 'SET_CALL_FORWARD'
const SET_CALL_FORWARD_RESULT = 'SET_CALL_FORWARD_RESULT'
const INIT_SET_CALL_FORWARD = 'INIT_SET_CALL_FORWARD'
const INIT_UPDATE_ADD_ON = 'INIT_UPDATE_ADD_ON'
const UPDATE_ADD_ON = 'UPDATE_ADD_ON'
const UPDATE_ADD_ON_RESULT = 'UPDATE_ADD_ON_RESULT'
const INIT_FORGOT_PASSWORD = 'INIT_FORGOT_PASSWORD'
const FORGOT_PASSWORD = 'FORGOT_PASSWORD'
const FORGOT_PASSWORD_RESULT = 'FORGOT_PASSWORD_RESULT'
const INIT_UPDATE_AUTO_RECHARGE = 'INIT_UPDATE_AUTO_RECHARGE'
const UPDATE_AUTO_RECHARGE = 'UPDATE_AUTO_RECHARGE'
const UPDATE_AUTO_RECHARGE_RESULT = 'UPDATE_AUTO_RECHARGE_RESULT'
const INIT_CANCEL_USER_ACCOUNT = 'INIT_CANCEL_USER_ACCOUNT'
const CANCEL_USER_ACCOUNT = 'CANCEL_USER_ACCOUNT'
const CANCEL_USER_ACCOUNT_RESULT = 'CANCEL_USER_ACCOUNT_RESULT'
const INIT_PAUSE_USER_ACCOUNT = 'INIT_PAUSE_USER_ACCOUNT'
const PAUSE_USER_ACCOUNT = 'PAUSE_USER_ACCOUNT'
const PAUSE_USER_ACCOUNT_RESULT = 'PAUSE_USER_ACCOUNT_RESULT'
const RELEASE_PHONE = 'RELEASE_PHONE'
const RELEASE_PHONE_RESULT = 'RELEASE_PHONE_RESULT'
const PREFRENCE_MODE = 'PREFRENCE_MODE'
const PREFRENCE_MODE_RESULT = 'PREFRENCE_MODE_RESULT'
const LOGIN_TAG_MODE = 'LOGIN_TAG_MODE'
const LOGIN_TAG_MODE_RESULT = 'LOGIN_TAG_MODE_RESULT'

export const constants = {
  SIGNUP,
  LOGIN,
  INIT_USER,
  RESET_PASSWORD,
  CHECK_LOGIN,
  GET_USER_INFO,
  SET_LOADING,
  LOGOUT,
  VERIFY,
  REVERIFY,
  REGISTER_ONE_SIGNAL,
  GET_TEAM_MEMBERS,
  GET_TEAM_MEMBERS_RESULT,
  INVITE_MEMBER,
  INVITE_MEMBER_RESULT,
  INIT_INVITE_MEMBER,
  SET_SELECTED_MEMBER,
  INIT_SELECTED_MEMBER,
  CANCEL_INVITATION,
  CANCEL_INVITATION_RESULT,
  REMOVE_FROM_TEAM,
  REMOVE_FROM_TEAM_RESULT,
  UPDATE_USER_ROLE,
  UPDATE_USER_ROLE_RESULT,
  INIT_USER_PING,
  GET_USER_PING,
  GET_USER_PING_RESULT,
  UPDATE_NOTIFICATION_SETTING,
  INIT_CHANGE_PASSWORD,
  CHANGE_PASSWORD,
  CHANGE_PASSWORD_RESULT,
  GET_PURCHASED_PHONE_NUMBERS,
  GET_PURCHASED_PHONE_NUMBERS_RESULT,
  SEARCH_AVAILABLE_PHONE_NUMBERS,
  SEARCH_AVAILABLE_PHONE_NUMBERS_RESULT,
  INIT_PURCHASE_PHONE_NUMBER,
  PURCHASE_PHONE_NUMBER,
  PURCHASE_PHONE_NUMBER_RESULT,
  GET_TRANSACTION,
  GET_TRANSACTION_RESULT,
  INIT_UPDATE_USER_INFO,
  UPDATE_USER_INFO,
  UPDATE_USER_INFO_RESULT,
  RESEND_VERIFICATION,
  RESEND_VERIFICATION_RESULT,
  SET_CALL_FORWARD,
  SET_CALL_FORWARD_RESULT,
  INIT_SET_CALL_FORWARD,
  INIT_UPDATE_ADD_ON,
  UPDATE_ADD_ON,
  UPDATE_ADD_ON_RESULT,
  INIT_FORGOT_PASSWORD,
  FORGOT_PASSWORD,
  FORGOT_PASSWORD_RESULT,
  INIT_UPDATE_AUTO_RECHARGE,
  UPDATE_AUTO_RECHARGE,
  UPDATE_AUTO_RECHARGE_RESULT,
  INIT_CANCEL_USER_ACCOUNT,
  CANCEL_USER_ACCOUNT,
  CANCEL_USER_ACCOUNT_RESULT,
  INIT_PAUSE_USER_ACCOUNT,
  PAUSE_USER_ACCOUNT,
  PAUSE_USER_ACCOUNT_RESULT,
  RELEASE_PHONE,
  RELEASE_PHONE_RESULT,
  PREFRENCE_MODE,
  PREFRENCE_MODE_RESULT,
  LOGIN_TAG_MODE,
  LOGIN_TAG_MODE_RESULT,
}

// ------------------------------------
// Actions
// ------------------------------------
export const login = createAction(
  LOGIN,
  (email, password, oneSignalUserId) => ({ email, password, oneSignalUserId })
)
export const loginResult = createAction(LOGIN_RESULT, (result) => ({ result }))
export const logout = createAction(LOGOUT, (oneSignalUserId) => ({
  oneSignalUserId,
}))
export const signup = createAction(SIGNUP, (data) => ({ data }))
export const signupResult = createAction(SIGNUP_RESULT, (result) => ({
  result,
}))
export const initUser = createAction(INIT_USER, () => ({}))
export const initUserResult = createAction(INIT_USER_RESULT, () => ({}))
export const resetPassword = createAction(RESET_PASSWORD, (data) => ({ data }))
export const resetPasswordResult = createAction(
  RESET_PASSWORD_RESULT,
  (result) => ({ result })
)
export const checkLogin = createAction(CHECK_LOGIN, (user) => ({ user }))
export const checkLoginResult = createAction(CHECK_LOGIN_RESULT, (result) => ({
  result,
}))
export const getUser = createAction(GET_USER_INFO, (user) => ({ user }))
export const getUserResult = createAction(GET_USER_INFO_RESULT, (result) => ({
  result,
}))
export const verify = createAction(VERIFY, (token) => ({ token }))
export const verifyResult = createAction(VERIFY_RESULT, (result) => ({
  result,
}))
export const reVerify = createAction(REVERIFY, (token) => ({ token }))
export const reVerifyResult = createAction(REVERIFY_RESULT, (result) => ({
  result,
}))
export const setLoading = createAction(SET_LOADING, (loading) => ({ loading }))
export const registerOneSignal = createAction(REGISTER_ONE_SIGNAL, (data) => ({
  data,
}))

export const getTeamMembers = createAction(GET_TEAM_MEMBERS, () => ({}))
export const getTeamMembersResult = createAction(
  GET_TEAM_MEMBERS_RESULT,
  (result) => ({
    result,
  })
)

export const inviteMember = createAction(INVITE_MEMBER, (email) => ({ email }))
export const inviteMemberResult = createAction(
  INVITE_MEMBER_RESULT,
  (result) => ({
    result,
  })
)
export const initInviteMember = createAction(INIT_INVITE_MEMBER, () => ({}))

export const initSelectedMember = createAction(
  INIT_SELECTED_MEMBER,
  () => ({})
)
export const setSelectedMember = createAction(
  SET_SELECTED_MEMBER,
  (member) => ({ member })
)

export const cancelInvitation = createAction(CANCEL_INVITATION, (id) => ({
  id,
}))
export const cancelInvitationResult = createAction(
  CANCEL_INVITATION_RESULT,
  (result) => ({
    result,
  })
)

export const removeFromTeam = createAction(REMOVE_FROM_TEAM, (id) => ({ id }))
export const removeFromTeamResult = createAction(
  REMOVE_FROM_TEAM_RESULT,
  (result) => ({
    result,
  })
)

export const updateUserRole = createAction(
  UPDATE_USER_ROLE,
  (userId, role) => ({ userId, role })
)
export const updateUserRoleResult = createAction(
  UPDATE_USER_ROLE_RESULT,
  (result) => ({
    result,
  })
)

export const initUserPing = createAction(INIT_USER_PING, () => ({}))
export const getUserPing = createAction(GET_USER_PING, (userId) => ({
  userId,
}))
export const getUserPingResult = createAction(
  GET_USER_PING_RESULT,
  (result) => ({
    result,
  })
)

export const initChangePassword = createAction(
  INIT_CHANGE_PASSWORD,
  () => ({})
)
export const changePassword = createAction(
  CHANGE_PASSWORD,
  (currentPassword, newPassword) => ({
    currentPassword,
    newPassword,
  })
)
export const changePasswordResult = createAction(
  CHANGE_PASSWORD_RESULT,
  (result) => ({
    result,
  })
)

export const updateNotificationSetting = createAction(
  UPDATE_NOTIFICATION_SETTING,
  (notificationType, status, user) => ({ notificationType, status, user })
)

export const getPurchasedPhoneNumbers = createAction(
  GET_PURCHASED_PHONE_NUMBERS,
  () => ({})
)
export const getPurchasedPhoneNumbersResult = createAction(
  GET_PURCHASED_PHONE_NUMBERS_RESULT,
  (result) => ({
    result,
  })
)

export const searchAvailablePhoneNumbers = createAction(
  SEARCH_AVAILABLE_PHONE_NUMBERS,
  (areaCode) => ({ areaCode })
)
export const searchAvailablePhoneNumbersResult = createAction(
  SEARCH_AVAILABLE_PHONE_NUMBERS_RESULT,
  (result) => ({
    result,
  })
)

export const initPurchasePhoneNumber = createAction(
  INIT_PURCHASE_PHONE_NUMBER,
  () => ({})
)
export const purchasePhoneNumber = createAction(
  PURCHASE_PHONE_NUMBER,
  (phoneNumber) => ({ phoneNumber })
)
export const purchasePhoneNumberResult = createAction(
  PURCHASE_PHONE_NUMBER_RESULT,
  (result) => ({
    result,
  })
)

export const getTransaction = createAction(GET_TRANSACTION, (page = 1, search = '') => ({ page, search }))
export const getTransactionResult = createAction(
  GET_TRANSACTION_RESULT,
  (transactions) => ({ transactions })
)

export const initUpdateUserInfo = createAction(
  INIT_UPDATE_USER_INFO,
  () => ({})
)
export const updateUserInfo = createAction(
  UPDATE_USER_INFO,
  (user) => ({ user })
)
export const updateUserInfoResult = createAction(
  UPDATE_USER_INFO_RESULT,
  (result) => ({
    result,
  })
)

export const resendVerification = createAction(RESEND_VERIFICATION, (token) => ({ token }))
export const resendVerificationResult = createAction(RESEND_VERIFICATION_RESULT, (result) => ({
  result,
}))

export const setCallForward = createAction(SET_CALL_FORWARD, (phoneNumber) => ({ phoneNumber }))
export const setCallForwardResult = createAction(
  SET_CALL_FORWARD_RESULT,
  (result) => ({
    result,
  })
)
export const initSetCallForward = createAction(INIT_SET_CALL_FORWARD, () => ({}))

export const initUpdateAddOn = createAction(INIT_UPDATE_ADD_ON, () => ({}))
export const updateAddOn = createAction(
  UPDATE_ADD_ON,
  (type, user, status = true) => ({ type, user, status })
)
export const updateAddOnResult = createAction(
  UPDATE_ADD_ON_RESULT,
  (result) => ({ result })
)

export const initForgotPassword = createAction(INIT_FORGOT_PASSWORD, () => ({}))
export const forgotPassword = createAction(
  FORGOT_PASSWORD,
  (email) => ({ email })
)
export const forgotPasswordResult = createAction(
  FORGOT_PASSWORD_RESULT,
  (result) => ({ result })
)

export const initUpdateAutoRecharge = createAction(INIT_UPDATE_AUTO_RECHARGE, () => ({}))
export const updateAutoRecharge = createAction(
  UPDATE_AUTO_RECHARGE,
  (status, threshold, creditPackageId) => ({ status, threshold, creditPackageId })
)
export const updateAutoRechargeResult = createAction(
  UPDATE_AUTO_RECHARGE_RESULT,
  (result) => ({ result })
)

export const initCancelUserAccount = createAction(INIT_CANCEL_USER_ACCOUNT, () => ({}))
export const cancelUserAccount = createAction(
  CANCEL_USER_ACCOUNT,
  (surveyId, surveyText) => ({ surveyId, surveyText })
)
export const cancelUserAccountResult = createAction(
  CANCEL_USER_ACCOUNT_RESULT,
  (result) => ({ result })
)

export const initPauseUserAccount = createAction(INIT_PAUSE_USER_ACCOUNT, () => ({}))
export const pauseUserAccount = createAction(
  PAUSE_USER_ACCOUNT,
  (surveyId, surveyText) => ({ surveyId, surveyText })
)
export const pauseUserAccountResult = createAction(
  PAUSE_USER_ACCOUNT_RESULT,
  (result) => ({ result })
)

export const releasePhone = createAction(RELEASE_PHONE, (phoneNumber) => ({
  phoneNumber,
}))
export const releasePhoneResult = createAction(
  RELEASE_PHONE_RESULT,
  (result) => ({
    result,
  })
)
export const changeMode = createAction(PREFRENCE_MODE, (mode) => ({
  mode,
}))
export const changeModeResult = createAction(PREFRENCE_MODE_RESULT, (result) => ({
  result,
}))
export const changeTagMode = createAction(LOGIN_TAG_MODE, (mode) => ({
  mode,
}))
export const changeTagModeResult = createAction(LOGIN_TAG_MODE_RESULT, (result) => ({
  result,
}))

export const actions = {
  login,
  signup,
  loginResult,
  signupResult,
  initUser,
  initUserResult,
  resetPassword,
  resetPasswordResult,
  checkLogin,
  checkLoginResult,
  getUser,
  getUserResult,
  setLoading,
  logout,
  verify,
  verifyResult,
  reVerify,
  reVerifyResult,
  registerOneSignal,
  getTeamMembers,
  getTeamMembersResult,
  initInviteMember,
  inviteMember,
  inviteMemberResult,
  initSelectedMember,
  setSelectedMember,
  cancelInvitation,
  cancelInvitationResult,
  removeFromTeam,
  removeFromTeamResult,
  updateUserRole,
  updateUserRoleResult,
  initUserPing,
  getUserPing,
  getUserPingResult,
  updateNotificationSetting,
  initChangePassword,
  changePassword,
  changePasswordResult,
  getPurchasedPhoneNumbers,
  getPurchasedPhoneNumbersResult,
  searchAvailablePhoneNumbers,
  searchAvailablePhoneNumbersResult,
  initPurchasePhoneNumber,
  purchasePhoneNumber,
  purchasePhoneNumberResult,
  getTransaction,
  getTransactionResult,
  initUpdateUserInfo,
  updateUserInfo,
  updateUserInfoResult,
  resendVerification,
  resendVerificationResult,
  setCallForward,
  setCallForwardResult,
  initSetCallForward,
  initUpdateAddOn,
  updateAddOn,
  updateAddOnResult,
  initForgotPassword,
  forgotPassword,
  forgotPasswordResult,
  initUpdateAutoRecharge,
  updateAutoRecharge,
  updateAutoRechargeResult,
  initCancelUserAccount,
  cancelUserAccount,
  cancelUserAccountResult,
  initPauseUserAccount,
  pauseUserAccount,
  pauseUserAccountResult,
  releasePhone,
  releasePhoneResult,
  changeMode,
  changeModeResult,
  changeTagMode,
  changeTagModeResult,
}

export const reducers = {
  [SIGNUP_RESULT]: (state, { payload }) => {
    return immutable(state, {
      signupResult: { $set: payload.result },
    })
  },
  [LOGIN_RESULT]: (state, { payload }) => {
    return immutable(state, {
      result: { $set: payload.result },
    })
  },
  [VERIFY_RESULT]: (state, { payload }) => {
    return immutable(state, {
      result: { $set: payload.result },
    })
  },
  [REVERIFY_RESULT]: (state, { payload }) => {
    return immutable(state, {
      result: { $set: payload.result },
    })
  },
  [INIT_USER_RESULT]: (state) => {
    return immutable(state, {
      result: {
        $set: {
          user: null,
          loading: false,
          error: null,
          success: false,
        },
      },
      signupResult: {
        $set: {
          user: null,
          loading: false,
          error: null,
          success: false,
        },
      },
      resend_verification: {
        $set: null,
      },
    })
  },
  [RESET_PASSWORD_RESULT]: (state, { payload }) => {
    return immutable(state, {
      result: { $set: payload.result },
    })
  },
  [CHECK_LOGIN_RESULT]: (state, { payload }) => {
    const loading = payload.result
    return immutable(state, {
      result: { $merge: { loading } },
    })
  },
  [GET_USER_INFO_RESULT]: (state, { payload }) => {
    return immutable(state, {
      result: { $set: payload.result },
    })
  },
  [SET_LOADING]: (state, { payload }) => {
    return immutable(state, {
      result: { $merge: { ...payload.result } },
    })
  },
  [GET_TEAM_MEMBERS_RESULT]: (state, { payload }) => {
    return immutable(state, {
      team_members: { $set: payload.result },
    })
  },
  [INIT_INVITE_MEMBER]: (state) => {
    return immutable(state, {
      invite_member: {
        $set: {
          loading: false,
          error: null,
          success: false,
        },
      },
    })
  },
  [INVITE_MEMBER]: (state) => {
    return immutable(state, {
      invite_member: {
        $set: {
          loading: true,
          error: null,
          success: false,
        },
      },
    })
  },
  [INVITE_MEMBER_RESULT]: (state, { payload }) => {
    return immutable(state, {
      invite_member: { $set: payload.result },
    })
  },
  [INIT_SELECTED_MEMBER]: (state) => {
    return immutable(state, {
      member: {
        $merge: {
          loading: false,
          error: null,
          success: false,
        },
      },
    })
  },
  [SET_SELECTED_MEMBER]: (state, { payload }) => {
    return immutable(state, {
      member: { $set: payload.member },
    })
  },
  [CANCEL_INVITATION]: (state) => {
    return immutable(state, {
      member: { $merge: { loading: true } },
    })
  },
  [CANCEL_INVITATION_RESULT]: (state, { payload }) => {
    return immutable(state, {
      member: { $merge: payload.result },
    })
  },
  [REMOVE_FROM_TEAM]: (state) => {
    return immutable(state, {
      member: { $merge: { loading: true } },
    })
  },
  [REMOVE_FROM_TEAM_RESULT]: (state, { payload }) => {
    return immutable(state, {
      member: { $merge: payload.result },
    })
  },
  [UPDATE_USER_ROLE]: (state) => {
    return immutable(state, {
      member: { $merge: { loading: true } },
    })
  },
  [UPDATE_USER_ROLE_RESULT]: (state, { payload }) => {
    return immutable(state, {
      member: { $merge: payload.result },
    })
  },
  [INIT_USER_PING]: (state) => {
    return immutable(state, {
      ping: {
        $set: {
          loading: false,
        },
      },
    })
  },
  [GET_USER_PING]: (state) => {
    return immutable(state, {
      ping: {
        $merge: {
          loading: true,
        },
      },
    })
  },
  [GET_USER_PING_RESULT]: (state, { payload }) => {
    return immutable(state, {
      ping: { $merge: { ...payload.result } },
    })
  },
  [INIT_CHANGE_PASSWORD]: (state) => {
    return immutable(state, {
      updatePassword: {
        $set: {
          loading: false,
          error: null,
          success: false,
        },
      },
    })
  },
  [CHANGE_PASSWORD]: (state) => {
    return immutable(state, {
      updatePassword: {
        $merge: {
          loading: true,
          error: null,
          success: false,
        },
      },
    })
  },
  [CHANGE_PASSWORD_RESULT]: (state, { payload }) => {
    return immutable(state, {
      updatePassword: { $merge: { ...payload.result } },
    })
  },
  [GET_PURCHASED_PHONE_NUMBERS]: (state) => {
    return immutable(state, {
      purchased_phone_numbers: {
        $merge: {
          loading: true,
          error: null,
          success: false,
        },
      },
    })
  },
  [GET_PURCHASED_PHONE_NUMBERS_RESULT]: (state, { payload }) => {
    return immutable(state, {
      purchased_phone_numbers: { $merge: { ...payload.result } },
    })
  },
  [SEARCH_AVAILABLE_PHONE_NUMBERS]: (state) => {
    return immutable(state, {
      available_phone_numbers: {
        $set: {
          loading: true,
          error: null,
          success: false,
        },
      },
    })
  },
  [SEARCH_AVAILABLE_PHONE_NUMBERS_RESULT]: (state, { payload }) => {
    return immutable(state, {
      available_phone_numbers: { $merge: { ...payload.result } },
    })
  },
  [INIT_PURCHASE_PHONE_NUMBER]: (state) => {
    return immutable(state, {
      purchase_phone_number: {
        $set: {
          loading: false,
          error: null,
          success: false,
        },
      },
    })
  },
  [PURCHASE_PHONE_NUMBER]: (state) => {
    return immutable(state, {
      purchase_phone_number: {
        $set: {
          loading: true,
          error: null,
          success: false,
        },
      },
    })
  },
  [PURCHASE_PHONE_NUMBER_RESULT]: (state, { payload }) => {
    return immutable(state, {
      purchase_phone_number: { $merge: { ...payload.result } },
    })
  },
  [GET_TRANSACTION]: (state) => {
    return immutable(state, {
      transaction: {
        $set: {
          ...state.transaction,
          loading: true,
          error: null,
          success: false,
        },
      },
    })
  },
  [GET_TRANSACTION_RESULT]: (state, { payload }) => {
    const { transaction } = state
    const { data } = transaction

    const result = payload.transactions ? payload.transactions : null

    if (result) {
      const { page } = result
      if (Number(page) === 1) {
        return immutable(state, {
          transaction: { $set: { ...result } },
        })
      }
      const transactions = data.concat(result.data)
      return immutable(state, {
        transaction: {
          $merge: {
            ...result,
            data: transactions,
          },
        },
      })
    }

    return immutable(state, {
      transaction: {
        $merge: {
          ...payload,
        },
      },
    })
  },
  [INIT_UPDATE_USER_INFO]: (state) => {
    return immutable(state, {
      update_user_info: {
        $set: {
          loading: false,
          error: null,
          success: false,
        },
      },
    })
  },
  [UPDATE_USER_INFO]: (state) => {
    return immutable(state, {
      update_user_info: { $set: { loading: true } },
    })
  },
  [UPDATE_USER_INFO_RESULT]: (state, { payload }) => {
    return immutable(state, {
      update_user_info: { $merge: payload.result },
    })
  },
  [RESEND_VERIFICATION]: (state) => {
    return immutable(state, {
      resend_verification: { $set: { loading: true } },
    })
  },
  [RESEND_VERIFICATION_RESULT]: (state, { payload }) => {
    return immutable(state, {
      resend_verification: { $merge: payload.result },
    })
  },
  [INIT_SET_CALL_FORWARD]: (state) => {
    return immutable(state, {
      call_forward: {
        $set: {
          loading: false,
          error: null,
          success: false,
        },
      },
    })
  },
  [SET_CALL_FORWARD]: (state) => {
    return immutable(state, {
      call_forward: {
        $set: {
          loading: true,
          error: null,
          success: false,
        },
      },
    })
  },
  [SET_CALL_FORWARD_RESULT]: (state, { payload }) => {
    return immutable(state, {
      call_forward: { $set: payload.result },
    })
  },
  [INIT_UPDATE_ADD_ON]: (state) => {
    return immutable(state, {
      update_add_on: {
        $set: {
          loading: false,
          error: null,
          success: false,
        },
      },
    })
  },
  [UPDATE_ADD_ON]: (state) => {
    return immutable(state, {
      update_add_on: {
        $set: {
          loading: true,
          error: null,
          success: false,
        },
      },
    })
  },
  [UPDATE_ADD_ON_RESULT]: (state, { payload }) => {
    return immutable(state, {
      update_add_on: { $set: payload.result },
    })
  },
  [INIT_FORGOT_PASSWORD]: (state) => {
    return immutable(state, {
      forgot_password: {
        $set: {
          loading: false,
          error: null,
          success: false,
        },
      },
    })
  },
  [FORGOT_PASSWORD]: (state) => {
    return immutable(state, {
      forgot_password: {
        $set: {
          loading: true,
          error: null,
          success: false,
        },
      },
    })
  },
  [FORGOT_PASSWORD_RESULT]: (state, { payload }) => {
    return immutable(state, {
      forgot_password: { $set: payload.result },
    })
  },
  [INIT_UPDATE_AUTO_RECHARGE]: (state) => {
    return immutable(state, {
      update_auto_recharge: {
        $set: {
          loading: false,
          error: null,
          success: false,
        },
      },
    })
  },
  [UPDATE_AUTO_RECHARGE]: (state) => {
    return immutable(state, {
      update_auto_recharge: {
        $set: {
          loading: true,
          error: null,
          success: false,
        },
      },
    })
  },
  [UPDATE_AUTO_RECHARGE_RESULT]: (state, { payload }) => {
    return immutable(state, {
      update_auto_recharge: { $set: payload.result },
    })
  },
  [INIT_CANCEL_USER_ACCOUNT]: (state) => {
    return immutable(state, {
      cancel_user_account: {
        $set: {
          loading: false,
          error: null,
          success: false,
        },
      },
    })
  },
  [CANCEL_USER_ACCOUNT]: (state) => {
    return immutable(state, {
      cancel_user_account: {
        $set: {
          loading: true,
          error: null,
          success: false,
        },
      },
    })
  },
  [CANCEL_USER_ACCOUNT_RESULT]: (state, { payload }) => {
    return immutable(state, {
      cancel_user_account: { $set: payload.result },
    })
  },
  [INIT_PAUSE_USER_ACCOUNT]: (state) => {
    return immutable(state, {
      pause_user_account: {
        $set: {
          loading: false,
          error: null,
          success: false,
        },
      },
    })
  },
  [PAUSE_USER_ACCOUNT]: (state) => {
    return immutable(state, {
      pause_user_account: {
        $set: {
          loading: true,
          error: null,
          success: false,
        },
      },
    })
  },
  [PAUSE_USER_ACCOUNT_RESULT]: (state, { payload }) => {
    return immutable(state, {
      pause_user_account: { $set: payload.result },
    })
  },
  [RELEASE_PHONE]: (state) => {
    return immutable(state, {
      release_phone: {
        $set: {
          loading: true,
          error: null,
          success: false,
        },
      },
    })
  },
  [RELEASE_PHONE_RESULT]: (state, { payload }) => {
    return immutable(state, {
      release_phone: { $set: payload.result },
    })
  },

  [PREFRENCE_MODE]: (state, { payload }) => {
    return immutable(state, {
      prefrence_mode: { $set: payload.mode },
    })
  },
  [PREFRENCE_MODE_RESULT]: (state, { payload }) => {
    return immutable(state, {
      prefrence_mode: { $set: payload.result },
    })
  },

  [LOGIN_TAG_MODE]:  (state, { payload }) => {
    return immutable(state, {
      login_tag_mode: { $set: payload.mode },
    })
  },
  [LOGIN_TAG_MODE_RESULT]: (state, { payload }) => {
    return immutable(state, {
      login_tag_mode: { $set: payload.result },
    })
  },
}

export const initialState = () => {
  return {
    result: {
      user: null,
      loading: false,
      error: null,
      success: false,
      status: 200,
    },
    signupResult: {
      user: null,
      loading: false,
      error: null,
      success: false,
      status: 200,
    },
    team_members: {
      loading: false,
      error: null,
      success: false,
      status: 200,
      data: null,
    },
    invite_member: {
      loading: false,
      error: null,
      success: false,
      status: 200,
      data: null,
    },
    member: null,
    ping: {
      loading: false,
    },
    updatePassword: {
      loading: false,
    },
    purchased_phone_numbers: {
      loading: false,
    },
    available_phone_numbers: {
      loading: false,
    },
    purchase_phone_number: {
      loading: false,
    },
    transaction: {
      loading: false,
    },
    update_user_info: {
      loading: false,
    },
    resend_verification: null,
    call_forward: null,
    update_add_on: null,
    forgot_password: null,
    update_auto_recharge: null,
    cancel_user_account: {
      loading: false,
    },
    pause_user_account: {
      loading: false,
    },
    release_phone: null,
    prefrence_mode: 'light',
    login_tag_mode: false,
  }
}

export default handleActions(reducers, initialState())
