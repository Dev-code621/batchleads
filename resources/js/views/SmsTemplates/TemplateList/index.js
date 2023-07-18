import React from 'react'
import 'react-tabs/style/react-tabs.css'
import Form from '~components/Form'
import FormTopHeader from '~components/Layout/Dashboard/FormTopHeader'
import FormTitle from '~components/Layout/Dashboard/FormTitle'
import Templates from './Templates/index'
import './style.scss'

export default (props) => {
  const {
    history,
    smsTemplate,
    setTemplateSearch,
    initTemplateSearch,
    initTemplate,
    match,
    getTemplates,
  } = props

  const { result } = smsTemplate

  const { loading } = result

  let selectedTemplate = null;
  const { state } = history.location;
  if (state) {
    selectedTemplate = state.template;
  }

  const { search } = smsTemplate
  const { isSelect } = match.params

  const onChangeSearch = (e) => {
    setTemplateSearch(e.target.value)
  }

  const clearSearch = () => {
    initTemplateSearch()
  }

  const refresh = () => {
    getTemplates(1, search)
  }

  const gotoAdd = () => {
    initTemplate()
    history.push('/dashboard/smsTemplates/new')
  }

  return (
    <Form className="sms-templates-page">
      <FormTopHeader
        showSearch={!selectedTemplate}
        showAdd={!selectedTemplate}
        showBack={isSelect || selectedTemplate}
        search={search}
        onChangeSearch={onChangeSearch}
        onClearSearch={clearSearch}
        onAdd={gotoAdd}
        history={history}
      />
      <FormTitle title={selectedTemplate ? 'Selected Template' : 'SMS Templates'} hasRefresh={!selectedTemplate} refresh={refresh} loading={loading} />
      <Templates {...props} isSelect={isSelect} template={selectedTemplate} />
    </Form>
  )
}
