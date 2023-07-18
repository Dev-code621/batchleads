import { createSelector } from 'reselect'

const templateDataSelector = (state) => state.smsTemplate

const resultSelector = createSelector(
  templateDataSelector,
  (payload) => {
    return {
      countPerPage: payload.get('count_per_page'),
      total: payload.get('total'),
      count: payload.get('count'),
      page: payload.get('page'),
      loading: payload.get('loading'),
      templates: payload.get('templates'),
      success: payload.get('success'),
    }
  }
)

const templateSelector = createSelector(
  templateDataSelector,
  (payload) => {
    const template = payload.get('template')

    return {
      id: template.get('id'),
      name: template.get('name'),
      template_details: template.get('template_details'),
      loading: template.get('loading'),
      error: template.get('error'),
      success: template.get('success'),
    }
  }
)

const searchSelector = createSelector(
  templateDataSelector,
  (payload) => payload.get('search')
)

const selectedTemplateSelector = createSelector(
  templateDataSelector,
  (payload) => {
    return payload.get('selectedTemplate')
  }
)

export const smsTemplateSelector = (state) => ({
  result: resultSelector(state),
  template: templateSelector(state),
  search: searchSelector(state),
  selectedTemplate: selectedTemplateSelector(state),
})
