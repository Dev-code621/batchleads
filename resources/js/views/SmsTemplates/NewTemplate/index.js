import React, { useState, useEffect } from 'react'
import { fromJS } from 'immutable'
import cloneDeep from 'lodash.clonedeep'
import { toast } from '~common/helper'
import Form from '~components/Form'
import ContainerRow from '~components/ContainerRow'
import ErrorMessage from '~components/ErrorMessage'
import LoadingActivity from '~components/LoadingActivity'
import Button from '~components/Button'
import Input from '~components/Input'
import FormTitle from '~components/Layout/Dashboard/FormTitle'
import './layout/style.scss'
import Detail from './layout/Detail'
import DetailSelector from './layout/DetailSelector'
import ScrollContainer from '~components/Layout/Dashboard/ScrollContainer'

export default (props) => {
  const {
    history,
    smsTemplate,
    editTemplate,
    // initTemplates,
    getTemplates,
    setTemplate,
    createTemplate,
    updateTemplate,
    setTemplateDetails,
    removeTemplate,
  } = props

  let selectedTemplate = null
  const { state } = history.location
  if (state) {
    selectedTemplate = cloneDeep(state.template)
  }

  const { template } = smsTemplate
  const { name } = template
  let { template_details: details } = template
  const { loading, error, success } = template

  const [errorName, setErrorName] = useState('')
  const [errorDetails, setErrorDetails] = useState('')
  const [isRemove, setIsRemove] = useState(false)

  if (error) {
    if (isRemove && error.get('status') === 422) {
      alert(error.get('message'))
    }
  }

  useEffect(() => {
    if (success) {
      if (selectedTemplate) {
        if (isRemove) {
          // initTemplates()
          getTemplates(1, '')
          toast.success('Template Removed!')
        } else {
          toast.success('Template Updated!')
        }
      } else {
        toast.success('Template Added!')
        // initTemplates()
        getTemplates(1, '')
      }
      history.goBack()
    }
  }, [success])

  useEffect(() => {
    if (selectedTemplate) {
      setTemplate(selectedTemplate.toJS())
    }
  }, [])

  const onChangeName = (event) => {
    editTemplate({ name: event.target.value })
  }

  const onAddDetail = () => {
    const newDetails = details.push(fromJS({
      content: '',
      day: 0,
    }))
    setTemplateDetails(newDetails)
  }

  const onRemoveDetail = (index) => {
    const newDetails = details.splice(index, 1)
    setTemplateDetails(newDetails)
  }

  const onEditDetail = (index, value, key = '') => {
    let newDetails = null
    if (key === 'day') {
      newDetails = details.splice(index, 1, fromJS({ day: value }))
    } else {
      newDetails = details.splice(index, 1, fromJS({ content: value }))
    }

    editTemplate({
      template_details: newDetails,
    })
  }

  const createNewTemplate = () => {
    setIsRemove(false)
    setErrorName('')
    setErrorDetails('')
    if (details.size > 0) {
      details = details.map((detail) => {
        const item = detail
        item.error = ''
        return item
      })
    }

    let validated = true
    if (!name) {
      validated = false
      setErrorName('Name Field is required.')
    }
    if (details.size === 0) {
      validated = false
      setErrorDetails('Need to add at least 1 detail.')
    } else {
      details = details.map((detail) => {
        const item = detail.toJS()
        if (item.content) {
          item.error = ''
        } else {
          item.error = 'Need to be filled.'
          validated = false
        }
        return item
      })
    }

    if (validated) {
      if (selectedTemplate) {
        updateTemplate(template)
      } else {
        createTemplate(template)
      }
    }
  }

  const remove = () => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm('Are you sure?')) {
      setIsRemove(true)
      removeTemplate(selectedTemplate.get('id'))
    }
  }

  return (
    <Form className="new-template-form">
      <FormTitle
        title={selectedTemplate ? 'Edit SMS Template' : 'New SMS Template'}
        hasBack
        history={history}
        hasRemove={selectedTemplate && !selectedTemplate.get('sms_campaign_count')}
        onRemove={remove}
      />
      <ScrollContainer>
        <ContainerRow>
          <Input
            type="text"
            label="Template Name"
            value={name}
            onChange={onChangeName}
            placeholder="Driving for Dollars"
            error={
          errorName
          || (error && error.get('error') && error.get('error').get('name'))
        }
            noIcon
            fontSize={14}
            className="input-field"
          />
        </ContainerRow>
        {details
          && details.map((detail, index) => (
            <ContainerRow>
              <Detail
                content={detail.get('content')}
                day={detail.get('day')}
                onRemove={() => onRemoveDetail(index)}
                onEdit={(value, key = '') => onEditDetail(index, value, key)}
                error={detail.error}
              />
            </ContainerRow>
          ))}
        <ContainerRow>
          <DetailSelector onClick={onAddDetail} error={errorDetails} />
        </ContainerRow>
        <ContainerRow>
          <ErrorMessage message={error && `*${error.get('message')}`} />
        </ContainerRow>
        {loading && (
          <ContainerRow>
            <LoadingActivity />
          </ContainerRow>
        )}
      </ScrollContainer>
      {!loading && (
        <ContainerRow>
          <Button
            label="SAVE TEMPLATE"
            height={40}
            width="70%"
            style={{
              maginLeft: 'auto',
              maginRight: 'auto',
            }}
            onClick={createNewTemplate}
          />
        </ContainerRow>
      )}
    </Form>
  )
}
