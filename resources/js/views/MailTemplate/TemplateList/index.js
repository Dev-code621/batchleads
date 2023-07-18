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
    mailTemplate,
    setTemplateSearch,
    initTemplateSearch,
    initTemplate,
    match,
  } = props

  let selectedTemplate = null;
  const { state } = history.location;
  if (state) {
    selectedTemplate = state.template;
  }

  const { search } = mailTemplate
  const { isSelect } = match.params

  const onChangeSearch = (e) => {
    setTemplateSearch(e.target.value)
  }

  const clearSearch = () => {
    initTemplateSearch()
  }

  const gotoAdd = () => {
    initTemplate()
    history.push('/dashboard/mailTemplates/new')
  }

  return (
    <Form className="mail-templates-page">
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
      <FormTitle title={selectedTemplate ? 'Selected Template' : 'Mail Templates'} />
      <Templates {...props} isSelect={isSelect} template={selectedTemplate} />
    </Form>
  )
}
