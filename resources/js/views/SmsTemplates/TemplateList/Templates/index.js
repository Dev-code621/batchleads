import React, { useEffect, useState } from 'react'
import { fromJS } from 'immutable'
import InfiniteScroll from '~components/Layout/Dashboard/InfiniteScroll'
import Form from '~components/Form'
import Button from '~components/Button'
import NoItemsDescription from '~components/NoItemsDescription'
import Template from './Template'
import './style.scss'

export default ({
  getTemplates,
  initTemplates,
  smsTemplate,
  history,
  isSelect,
  setTemplateSelected,
  template,
  initTemplate,
}) => {
  const [loaded, setLoaded] = useState(false)
  const [initValue, setInitValue] = useState(false)
  const { result, search, selectedTemplate } = smsTemplate

  const {
    templates, total, page, countPerPage, count, loading,
  } = result

  const dataLength = count + (Number(page) - 1) * countPerPage

  useEffect(() => {
    if (dataLength === 0 && !template) {
      initTemplates(search)
      getTemplates(1, search)
    }
  }, [])

  useEffect(() => {
    if (loaded) {
      // initTemplates(search)
      getTemplates(1, search)
    }
    setLoaded(true)
  }, [search])

  useEffect(() => {
    if (initValue) {
      history.goBack()
    }
    setInitValue(true)
  }, [selectedTemplate])

  const fetchData = () => {
    getTemplates(Number(page) + 1, search)
  }

  const refresh = () => {
    // initTemplates(search)
    getTemplates(1, search)
  }

  const gotoNewTemplate = () => {
    initTemplate()
    history.push('/dashboard/smsTemplates/new')
  }

  const gotoEditTemplate = (temp) => {
    initTemplate()
    history.push('/dashboard/smsTemplates/new', { template: temp })
  }

  const onSelectTemplate = (temp) => {
    setTemplateSelected(temp)
  }

  const renderTemplate = () => {
    if (template) {
      return (
        <Template
          template={fromJS(template)}
          onClickItem={() => gotoEditTemplate(fromJS(template))}
        />
      )
    }

    return (
      <Form className="sms-template-list">
        <InfiniteScroll
          dataLength={dataLength}
          next={fetchData}
          hasMore={total && total > countPerPage * Number(page)}
          refresh={refresh}
          loading={loading}
        >
          {dataLength === 0 && !search && !loading && (
            <NoItemsDescription description="You don't have any Templates now,<br /> but you can create">
              <Button
                label="NEW Template"
                height="48px"
                style={{
                  backgroundColor: '#3683bc',
                  fontSize: '13px',
                  borderRadius: '24px',
                }}
                onClick={gotoNewTemplate}
              />
            </NoItemsDescription>
          )}
          {dataLength === 0 && search && !loading && (
            <NoItemsDescription description="No Templates" />
          )}
          {templates.map((item) => (
            <Template
              template={item}
              key={item.id}
              onClickItem={() => gotoEditTemplate(item)}
              isSelect={isSelect}
              selected={selectedTemplate && selectedTemplate.get('id') === item.get('id')}
              onSelect={() => onSelectTemplate(item)}
            />
          ))}
        </InfiniteScroll>
      </Form>
    )
  }

  return <div className="sms-templates-form">{renderTemplate()}</div>
}
