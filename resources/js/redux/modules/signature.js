import { createAction, handleActions } from 'redux-actions'
import { fromJS } from 'immutable'

const GET_SIGNATURES = 'GET_SIGNATURES'
const GET_SIGNATURES_RESULT = 'GET_SIGNATURES_RESULT'
const SET_SIGNATURE_SEARCH = 'SET_SIGNATURE_SEARCH'
const INIT_SIGNATURES = 'INIT_SIGNATURES'
const INIT_SIGNATURE = 'INIT_SIGNATURE'
const SET_SIGNATURE = 'SET_SIGNATURE'
const EDIT_SIGNATURE = 'EDIT_SIGNATURE'
const CREATE_SIGNATURE = 'CREATE_SIGNATURE'
const CREATE_SIGNATURE_RESULT = 'CREATE_SIGNATURE_RESULT'
const UPDATE_SIGNATURE = 'UPDATE_SIGNATURE'
const UPDATE_SIGNATURE_RESULT = 'UPDATE_SIGNATURE_RESULT'
const REMOVE_SIGNATURE = 'REMOVE_SIGNATURE'
const REMOVE_SIGNATURE_RESULT = 'REMOVE_SIGNATURE_RESULT'

export const constants = {
  GET_SIGNATURES,
  GET_SIGNATURES_RESULT,
  INIT_SIGNATURES,
  SET_SIGNATURE_SEARCH,
  INIT_SIGNATURE,
  SET_SIGNATURE,
  EDIT_SIGNATURE,
  CREATE_SIGNATURE,
  CREATE_SIGNATURE_RESULT,
  UPDATE_SIGNATURE,
  UPDATE_SIGNATURE_RESULT,
  REMOVE_SIGNATURE,
  REMOVE_SIGNATURE_RESULT,
}

// ------------------------------------
// Actions
// ------------------------------------
export const getSignatures = createAction(GET_SIGNATURES, (page = 1, search = '') => ({
  page,
  search,
}))
export const getSignaturesResult = createAction(
  GET_SIGNATURES_RESULT,
)

export const setSignatureSearch = createAction(SET_SIGNATURE_SEARCH, (search) => ({
  search,
}))

export const setSignature = createAction(SET_SIGNATURE, (signature) => ({ signature }))

export const editSignature = createAction(EDIT_SIGNATURE, (signature) => ({ signature }))

export const createSignature = createAction(CREATE_SIGNATURE, (signature) => ({ signature }))
export const createSignatureResult = createAction(
  CREATE_SIGNATURE_RESULT,
)

export const updateSignature = createAction(UPDATE_SIGNATURE, (signature) => ({ signature }))
export const updateSignatureResult = createAction(
  UPDATE_SIGNATURE_RESULT,
)

export const removeSignature = createAction(REMOVE_SIGNATURE, (id) => ({ id }))
export const removeSignatureResult = createAction(
  REMOVE_SIGNATURE_RESULT,
)

export const initSignatures = createAction(INIT_SIGNATURES, (search = '') => ({
  search,
}))

export const initSignature = createAction(INIT_SIGNATURE, () => ({}))


export const actions = {
  getSignatures,
  getSignaturesResult,
  setSignatureSearch,
  setSignature,
  editSignature,
  createSignature,
  createSignatureResult,
  updateSignature,
  updateSignatureResult,
  removeSignature,
  removeSignatureResult,
  initSignatures,
  initSignature,
}

export const reducers = {
  [GET_SIGNATURES]: (state) => {
    return state.merge({
      loading: true,
    })
  },
  [GET_SIGNATURES_RESULT]: (state, { payload }) => {
    return state.merge({
      loading: false,
      ...payload,
      signatures: fromJS(payload.signatures),
    })
  },
  [SET_SIGNATURE_SEARCH]: (state, { payload }) => {
    return state.merge({
      search: payload.search,
    })
  },
  [SET_SIGNATURE]: (state, { payload }) => {
    return state.mergeDeep({
      signature: {
        loading: false,
        success: false,
        error: null,
        ...payload.signature,
      },
    })
  },
  [UPDATE_SIGNATURE]: (state) => {
    return state.mergeDeep({
      signature: {
        success: false,
        loading: true,
        error: null,
      },
    })
  },
  [UPDATE_SIGNATURE_RESULT]: (state, { payload }) => {
    const { success, data } = payload
    if (success) {
      const signatures = state.get('signatures').toJS()
      const index = signatures.findIndex((signature) => signature.id === data.id)
      signatures.splice(index, 1, data)
      return state.merge({
        signatures: fromJS(signatures),
        signature: {
          success: true,
          loading: false,
          error: null,
        },
      })
    }

    return state.mergeDeep({
      signature: {
        ...payload,
      },
    })
  },
  [CREATE_SIGNATURE]: (state) => {
    return state.mergeDeep({
      signature: {
        success: false,
        loading: true,
        error: null,
      },
    })
  },
  [CREATE_SIGNATURE_RESULT]: (state, { payload }) => {
    const { success, data } = payload
    if (success) {
      const signatures = state.get('signatures').toJS()
      signatures.unshift(data)
      return state.merge({
        signatures,
        signature: {
          success: true,
          loading: false,
          error: null,
        },
      })
    }

    return state.mergeDeep({
      signature: {
        ...payload,
      },
    })
  },
  [REMOVE_SIGNATURE]: (state) => {
    return state.mergeDeep({
      signature: {
        success: false,
        loading: true,
        error: null,
      },
    })
  },
  [REMOVE_SIGNATURE_RESULT]: (state, { payload }) => {
    const { success } = payload
    if (success) {
      const { id } = payload
      const signatures = state.get('signatures').toJS()
      const index = signatures.findIndex((signature) => signature.id === id)
      signatures.splice(index, 1)
      return state.merge({
        signatures: fromJS(signatures),
        signature: {
          success: true,
          loading: false,
          error: null,
        },
      })
    }

    return state.mergeDeep({
      signature: {
        ...payload,
      },
    })
  },
  [EDIT_SIGNATURE]: (state, { payload }) => {
    return state.mergeDeep({
      signature: payload.signature,
    })
  },
  [INIT_SIGNATURES]: (state, { payload }) => {
    return state.merge({
      signatures: [],
      loading: false,
      error: null,
      success: false,
      status: 200,
      total: 0,
      page: 0,
      count: 0,
      search: payload.search,
      count_per_page: 0,
    })
  },
  [INIT_SIGNATURE]: (state) => {
    return state.merge({
      signature: {
        label: null,
        sign_off: null,
        name: null,
        contact_phone: null,
        contact_email: null,
        contact_website: null,
        address_line1: null,
        address_line2: null,
        address_city: null,
        address_state: null,
        address_zip: null,
        disclosure_agreement: null,
        loading: false,
        error: null,
        success: false,
        status: 200,
      },
    })
  },
}

export const initialState = () => fromJS({
  signatures: [],
  loading: false,
  error: null,
  success: false,
  status: 200,
  total: 0,
  page: 0,
  count: 0,
  search: '',
  count_per_page: 0,
  signature: {
    loading: false,
    error: null,
    success: false,
    status: 200,
    label: null,
    signOff: null,
    name: null,
    phone: null,
    email: null,
    address1: null,
    address2: null,
    city: null,
    state: null,
    zip: null,
    disclosure: null,
  },
})

export default handleActions(reducers, initialState())
