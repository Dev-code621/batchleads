import { createAction, handleActions } from 'redux-actions'
import { fromJS } from 'immutable'

const GET_TEMPLATES = 'GET_TEMPLATES'
const GET_TEMPLATES_RESULT = 'GET_TEMPLATES_RESULT'
const INIT_TEMPLATES = 'INIT_TEMPLATES'
const EDIT_TEMPLATE = 'EDIT_TEMPLATE'
const SET_TEMPLATE = 'SET_TEMPLATE'
const INIT_TEMPLATE = 'INIT_TEMPLATE'
const SET_TEMPLATE_SEARCH = 'SET_TEMPLATE_SEARCH'
const INIT_TEMPLATE_SEARCH = 'INIT_TEMPLATE_SEARCH'
const SET_TEMPLATE_SELECTED = 'SET_TEMPLATE_SELECTED'
const INIT_SELECTED_TEMPLATE = 'INIT_SELECTED_TEMPLATE'
const CREATE_TEMPLATE = 'CREATE_TEMPLATE'
const CREATE_TEMPLATE_RESULT = 'CREATE_TEMPLATE_RESULT'
const UPDATE_TEMPLATE = 'UPDATE_TEMPLATE'
const UPDATE_TEMPLATE_RESULT = 'UPDATE_TEMPLATE_RESULT'
const SET_TEMPLATE_DETAILS = 'SET_TEMPLATE_DETAILS'
const REMOVE_TEMPLATE = 'REMOVE_TEMPLATE'
const REMOVE_TEMPLATE_RESULT = 'REMOVE_TEMPLATE_RESULT'

export const constants = {
  GET_TEMPLATES,
  GET_TEMPLATES_RESULT,
  INIT_TEMPLATES,
  EDIT_TEMPLATE,
  INIT_TEMPLATE,
  SET_TEMPLATE_SEARCH,
  INIT_TEMPLATE_SEARCH,
  SET_TEMPLATE_SELECTED,
  INIT_SELECTED_TEMPLATE,
  SET_TEMPLATE,
  CREATE_TEMPLATE,
  CREATE_TEMPLATE_RESULT,
  UPDATE_TEMPLATE,
  UPDATE_TEMPLATE_RESULT,
  SET_TEMPLATE_DETAILS,
  REMOVE_TEMPLATE,
  REMOVE_TEMPLATE_RESULT,
}

export const initialState = (search = '') => fromJS({
  error: null,
  success: false,
  status: 200,
  loading: false,
  total: 0,
  page: 0,
  count: 0,
  count_per_page: 0,
  templates: [],
  template: {
    id: 0,
    name: '',
    template_details: [],
    loading: false,
    success: false,
    error: null,
  },
  search,
  selectedTemplate: null,
})

// ------------------------------------
// Actions
// ------------------------------------
export const getTemplates = createAction(GET_TEMPLATES, (page, search = '') => ({ page, search }))
export const getTemplatesResult = createAction(
  GET_TEMPLATES_RESULT,
)
export const initTemplates = createAction(INIT_TEMPLATES, (search) => ({ search }))

export const initTemplate = createAction(INIT_TEMPLATE, () => ({}))
export const editTemplate = createAction(EDIT_TEMPLATE, (template) => ({ template }))
export const setTemplate = createAction(SET_TEMPLATE, (template) => ({ template }))
export const setTemplateDetails = createAction(SET_TEMPLATE_DETAILS, (details) => ({ details }))

export const initTemplateSearch = createAction(INIT_TEMPLATE_SEARCH, () => ({}))
export const setTemplateSearch = createAction(SET_TEMPLATE_SEARCH, (search) => ({ search }))

export const setTemplateSelected = createAction(SET_TEMPLATE_SELECTED, (template) => ({
  template,
}))

export const createTemplate = createAction(
  CREATE_TEMPLATE, (template) => ({
    template,
  })
)
export const createTemplateResult = createAction(
  CREATE_TEMPLATE_RESULT,
)

export const updateTemplate = createAction(
  UPDATE_TEMPLATE, (template) => ({
    template,
  })
)
export const updateTemplateResult = createAction(
  UPDATE_TEMPLATE_RESULT,
)

export const removeTemplate = createAction(REMOVE_TEMPLATE, (id) => ({ id }))
export const removeTemplateResult = createAction(REMOVE_TEMPLATE_RESULT)

export const initSelectedTemplate = createAction(INIT_SELECTED_TEMPLATE, () => ({}))

export const actions = {
  getTemplates,
  getTemplatesResult,
  initTemplates,
  editTemplate,
  setTemplateSearch,
  initTemplateSearch,
  setTemplateSelected,
  initSelectedTemplate,
  setTemplate,
  initTemplate,
  createTemplate,
  createTemplateResult,
  updateTemplate,
  updateTemplateResult,
  setTemplateDetails,
  removeTemplate,
  removeTemplateResult,
}

export const reducers = {
  [GET_TEMPLATES]: (state) => state.merge({
    loading: true,
  }),
  [GET_TEMPLATES_RESULT]: (state, { payload }) => {
    const templates = state.get('templates')
    let result = payload.templates ? payload.templates : null

    if (result) {
      result = fromJS(result)
      const { page } = payload
      if (Number(page) === 1) {
        return state.merge({ ...payload })
          .set('templates', result)
      }
      return state.merge({
        ...payload,
        templates: templates ? templates.concat(result) : result,
      })
    }

    return state.merge({
      ...payload,
    })
  },
  [EDIT_TEMPLATE]: (state, { payload }) => {
    return state.mergeDeep({
      template: payload.template,
    })
  },
  [SET_TEMPLATE_DETAILS]: (state, { payload }) => {
    const template = state.get('template')
    return state.set(
      'template',
      fromJS({
        ...template.toJS(),
        template_details: payload.details,
      }),
    )
  },
  [SET_TEMPLATE]: (state, { payload }) => {
    return state.mergeDeep({
      template: {
        loading: false,
        success: false,
        error: null,
        ...payload.template,
      },
    })
  },
  [INIT_TEMPLATES]: (state, { payload }) => initialState(payload.search),

  [INIT_TEMPLATE]: (state) => state.set('template',
    fromJS({
      error: null,
      success: false,
      status: 200,
      loading: false,
      name: '',
      id: 0,
      template_details: [],
    })),
  [INIT_TEMPLATE_SEARCH]: (state) => state.merge({
    search: '',
  }),
  [SET_TEMPLATE_SEARCH]: (state, { payload }) => state.merge({
    search: payload.search,
  }),
  [SET_TEMPLATE_SELECTED]: (state, { payload }) => {
    const { template } = payload
    let selectedTemplate = state.get('selectedTemplate')
    if (selectedTemplate) {
      if (selectedTemplate.get('id') === template.get('id')) {
        selectedTemplate = null
      } else {
        selectedTemplate = template
      }
    } else {
      selectedTemplate = template
    }

    return state.set('selectedTemplate', selectedTemplate)
  },
  [CREATE_TEMPLATE]: (state) => {
    return state.mergeDeep({
      template: {
        success: false,
        loading: true,
      },
    })
  },
  [CREATE_TEMPLATE_RESULT]: (state, { payload }) => {
    const { success } = payload
    if (success) {
      return state.mergeDeep({
        template: {
          success: true,
          loading: false,
        },
      })
    }

    return state.mergeDeep({
      template: {
        ...payload,
      },
    })
  },
  [UPDATE_TEMPLATE]: (state) => {
    return state.mergeDeep({
      template: {
        success: false,
        loading: true,
        error: null,
      },
    })
  },
  [UPDATE_TEMPLATE_RESULT]: (state, { payload }) => {
    const { success, data } = payload
    if (success) {
      const templates = state.get('templates').toJS()
      const index = templates.findIndex((template) => template.id === data.id)
      templates.splice(index, 1, data)
      return state.merge({
        templates: fromJS(templates),
        template: {
          success: true,
          loading: false,
          error: null,
        },
      })
    }

    return state.mergeDeep({
      template: { ...payload },
    })
  },
  [INIT_SELECTED_TEMPLATE]: (state) => state.merge({
    selectedTemplate: null,
  }),
  [REMOVE_TEMPLATE]: (state) => {
    return state.mergeDeep({
      template: {
        success: false,
        loading: true,
      },
    })
  },
  [REMOVE_TEMPLATE_RESULT]: (state, { payload }) => {
    const { success } = payload
    if (success) {
      return state.mergeDeep({
        template: {
          success: true,
          loading: false,
        },
      })
    }

    return state.mergeDeep({
      template: {
        ...payload,
      },
    })
  },
}

export default handleActions(reducers, initialState())
