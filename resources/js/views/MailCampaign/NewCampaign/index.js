import React, { useState, useEffect } from 'react'
import { fromJS } from 'immutable'
import DatePicker from 'react-mobile-datepicker'
import Switch from 'react-switch'
import moment from 'moment'
import { toast } from '~common/helper'
import Form from '~components/Form'
import ContainerRow from '~components/ContainerRow'
import LoadingActivity from '~components/LoadingActivity'
import Button from '~components/Button'
import Input from '~components/Input'
import TextArea from '~components/TextArea'
import FormTitle from '~components/Layout/Dashboard/FormTitle'
import DateSelector from '~components/DateSelector'
import TemplateSelector from '~components/TemplateSelector'
import PropertySelector from '~components/PropertySelector'
import CampaignStatusText from '~components/CampaignStatusText'
import ErrorMessage from '~common/components/ErrorMessage'
import ScrollContainer from '~components/Layout/Dashboard/ScrollContainer'
import { useThemeState } from '~common/theme-context'
import './layout/style.scss'

export default (props) => {
  const {
    history,
    property,
    mailCampaign,
    editCampaign,
    mailTemplate,
    newCampaign,
    newCampaignBulk,
    // initCampaigns,
    getCampaigns,
    setCampaignSearch,
    cancelCampaign,
    initTemplate,
  } = props

  let selectedCampaign = null
  const { state } = history.location
  if (state) {
    selectedCampaign = state.campaign
  }
  const theme = useThemeState()
  let selectedTemplate = null
  if (selectedCampaign) {
    selectedTemplate = selectedCampaign.mail_template
  } else {
    selectedTemplate = mailTemplate.selectedTemplate ? mailTemplate.selectedTemplate.toJS() : null
  }
  const { campaign, result } = mailCampaign
  const {
    title, description, repeat_every: repeat, total_mailers: totalMailers, is_repeat: isRepeatStep,
  } = selectedCampaign || campaign
  const startDate = selectedCampaign
    ? selectedCampaign.send_date
    : campaign.startDate

  const { loading, error, success } = result
  const errorMessage = error && error.toJS()

  const monthMap = {
    1: 'Jan',
    2: 'Feb',
    3: 'Mar',
    4: 'Apr',
    5: 'May',
    6: 'Jun',
    7: 'Jul',
    8: 'Aug',
    9: 'Sep',
    10: 'Oct',
    11: 'Nov',
    12: 'Dec',
  }
  const dateConfig = {
    year: {
      format: 'YYYY',
      caption: 'Year',
      step: 1,
    },
    month: {
      format: (value) => monthMap[value.getMonth() + 1],
      caption: 'Month',
      step: 1,
    },
    date: {
      format: 'DD',
      caption: 'Day',
      step: 1,
    },
  }

  const [errorName, setErrorName] = useState('')
  const [errorProperty, setErrorProperty] = useState('')
  const [errorDescription, setErrorDescription] = useState('')
  const [errorTemplate, setErrorTemplate] = useState('')
  const [errorStartDate, setErrorStartDate] = useState('')
  const [datePickerOpened, setDatePickerOpened] = useState(false)
  const [date, setDate] = useState(new Date())
  const [isCancel, setIsCancel] = useState(false)

  useEffect(() => {
    if (success) {
      if (isCancel) {
        toast.success('Canceled')
      } else {
        // initCampaigns()
        toast.success('Campaign Added!')
      }
      setCampaignSearch('')
      getCampaigns(1, '')

      history.goBack()
    }
  }, [success])

  const onChangeName = (event) => {
    editCampaign({ title: event.target.value })
  }

  const onChangeRepeat = (event) => {
    editCampaign({ repeat_every: event.target.value })
  }

  const onChangeTotalMailers = (event) => {
    editCampaign({ total_mailers: event.target.value })
  }

  const onChangeIsRepeatStep = (isRepeat) => {
    editCampaign({ is_repeat: isRepeat })
  }

  const onChangeDescription = (event) => {
    editCampaign({ description: event.target.value })
  }

  const onClickDate = () => {
    setDatePickerOpened(true)
  }

  const onSelectDate = (dateSelected) => {
    setDatePickerOpened(false)
    setDate(dateSelected)
    editCampaign({ start_date: dateSelected })
  }

  const onSelectProperties = () => {
    if (selectedCampaign) {
      history.push('/dashboard/properties', { mail_campaign_id: selectedCampaign.id })
    } else {
      history.push('/dashboard/properties/1')
    }
  }

  const onSelectTemplate = () => {
    if (selectedCampaign) {
      initTemplate()
      history.push('/dashboard/mailTemplates/new', { template: fromJS(selectedCampaign.mail_template) })
    } else {
      history.push('/dashboard/mailTemplates/1')
    }
  }

  const getSelectedPropertiesCount = () => {
    if (selectedCampaign) {
      return selectedCampaign.property_count
    }
    const { result: propertyResult, isAllPropertySelected } = property
    const { propertyListData, total } = propertyResult

    let selectedCount = 0
    let unSelectedCount = 0
    if (propertyListData) {
      propertyListData.map((item) => {
        if (item.selected) {
          selectedCount += 1
        } else {
          unSelectedCount += 1
        }
        return true
      })
    }

    if (isAllPropertySelected) {
      selectedCount = total - unSelectedCount
    }

    return selectedCount
  }

  const createNewCampaign = () => {
    setIsCancel(false)
    const selectedPropertiesCount = getSelectedPropertiesCount()
    let validated = true
    setErrorName('')
    setErrorDescription('')
    setErrorProperty('')
    setErrorTemplate('')
    setErrorStartDate('')

    if (!title) {
      setErrorName('Name Field is required.')
      validated = false
    }
    if (!description) {
      setErrorDescription('Description Field is required.')
      validated = false
    }
    if (selectedPropertiesCount === 0) {
      setErrorProperty('*Need to select the Property.')
      validated = false
    }
    if (!selectedTemplate) {
      setErrorTemplate('*Need to select the Template.')
      validated = false
    }
    if (!startDate) {
      setErrorStartDate('*Need to select the Start Date.')
      validated = false
    }

    if (validated) {
      const { result: propertyResult, isAllPropertySelected } = property
      const { propertyListData } = propertyResult

      const selectedPropertyIds = []
      const excludedPropertyIds = []
      if (propertyListData) {
        propertyListData.map((item) => {
          if (item.selected) {
            selectedPropertyIds.push(item.id)
          } else {
            excludedPropertyIds.push(item.id)
          }
          return false
        })
      }

      if (isAllPropertySelected) {
        const { search, listFilter } = property
        const filter = {
          search,
          folder_id: listFilter.folder.id,
          status: listFilter.status !== 'All Deals' ? listFilter.status : null,
          user_id: listFilter.user.id,
          skip_traced: listFilter.skipTracing.id,
          owner_occupied: listFilter.owner.id,
          created_at: listFilter.created_at ? moment(listFilter.created_at).format('YYYY-MM-DD') : '',
        }
        newCampaignBulk(
          title,
          description,
          isRepeatStep ? repeat : '',
          isRepeatStep ? totalMailers : '',
          isRepeatStep ? 1 : 0,
          moment(startDate).format('YYYY-MM-DD'),
          selectedTemplate.id,
          excludedPropertyIds,
          filter
        )
      } else {
        newCampaign(
          title,
          description,
          isRepeatStep ? repeat : '',
          isRepeatStep ? totalMailers : '',
          isRepeatStep ? 1 : 0,
          moment(startDate).format('YYYY-MM-DD'),
          selectedTemplate.id,
          selectedPropertyIds
        )
      }
    }
  }

  const cancel = () => {
    setIsCancel(true)
    cancelCampaign(selectedCampaign.id)
  }

  return (
    <Form className="new-campaign-form">
      <FormTitle title={selectedCampaign ? 'Mail Campaign' : 'New Mail Campaign'} hasBack history={history}>
        {
          selectedCampaign && <CampaignStatusText status={selectedCampaign.finished} />
        }
      </FormTitle>
      <ScrollContainer>
        <ContainerRow>
          <Input
            type="text"
            label="Campaign Name"
            value={title}
            onChange={onChangeName}
            placeholder="Vacant Property Campaign"
            error={
              errorName
              || (errorMessage && errorMessage.error && errorMessage.error.title)
            }
            noIcon
            fontSize={14}
            readOnly={selectedCampaign}
          />
        </ContainerRow>
        <ContainerRow>
          <TextArea
            value={description}
            onChange={onChangeDescription}
            placeholder="Enter your description here"
            error={
              errorDescription
              || (errorMessage
                && errorMessage.error
                && errorMessage.error.description)
            }
            fontSize={14}
            readOnly={selectedCampaign}
          />
        </ContainerRow>
        <ContainerRow>
          <TemplateSelector
            onClick={onSelectTemplate}
            template={selectedTemplate}
            error={
              errorTemplate
              || (errorMessage
                && errorMessage.error
                && errorMessage.error.template_id)
            }
          />
        </ContainerRow>
        <ContainerRow>
          <DateSelector
            onClick={onClickDate}
            date={startDate}
            error={
              errorStartDate
              || (errorMessage
                && errorMessage.error
                && errorMessage.error.send_date)
            }
          />
        </ContainerRow>
        {
          (repeat && selectedCampaign) && (
            <React.Fragment>
              <ContainerRow>
                <Input
                  type="text"
                  label="Repeat Every"
                  value={repeat}
                  placeholder="days"
                  noIcon
                  fontSize={14}
                  readOnly
                />
              </ContainerRow>
              <ContainerRow>
                <Input
                  type="text"
                  label="Total mailers to send"
                  value={totalMailers}
                  placeholder="mailers"
                  noIcon
                  fontSize={14}
                  readOnly
                />
              </ContainerRow>
            </React.Fragment>
          )
        }
        {
          !selectedCampaign && (
            <ContainerRow className="repeat-step-switch-container">
              Repeat Step?
              <Switch
                onChange={() => onChangeIsRepeatStep(!isRepeatStep)}
                checked={isRepeatStep}
                checkedIcon={false}
                uncheckedIcon={false}
                onColor="#3683bc"
                offColor="#c3c3c3"
              />
            </ContainerRow>
          )
        }
        {
          !selectedCampaign && isRepeatStep && (
            <React.Fragment>
              <ContainerRow>
                <Input
                  type="text"
                  label="Repeat Every"
                  value={repeat}
                  onChange={onChangeRepeat}
                  placeholder="days"
                  error={errorMessage && errorMessage.error && errorMessage.error.repeat_every}
                  noIcon
                  fontSize={14}
                />
              </ContainerRow>
              <ContainerRow>
                <Input
                  type="text"
                  label="Total mailers to send"
                  value={totalMailers}
                  onChange={onChangeTotalMailers}
                  placeholder="mailers"
                  error={errorMessage && errorMessage.error && errorMessage.error.total_mailers}
                  noIcon
                  fontSize={14}
                />
              </ContainerRow>
            </React.Fragment>
          )
        }
        <ContainerRow>
          <PropertySelector
            onClick={onSelectProperties}
            count={getSelectedPropertiesCount()}
            error={
              errorProperty
              || (errorMessage
                && errorMessage.error
                && errorMessage.error.property_ids)
            }
          />
        </ContainerRow>
        <ContainerRow>
          <DatePicker
            value={date}
            isOpen={datePickerOpened}
            onSelect={onSelectDate}
            dateConfig={dateConfig}
            onCancel={() => setDatePickerOpened(false)}
            confirmText="OK"
            cancelText="Cancel"
            readOnly={selectedCampaign}
            className={theme.theme}
          />
        </ContainerRow>
        <ContainerRow>
          <ErrorMessage message={errorMessage && `*${errorMessage.message}`} />
        </ContainerRow>

        {loading && (
          <ContainerRow>
            <LoadingActivity />
          </ContainerRow>
        )}
      </ScrollContainer>
      {!loading && !selectedCampaign && (
        <ContainerRow>
          <Button
            label="SAVE CAMPAIGN"
            height="40px"
            width="70%"
            style={{
              backgroundColor: '#3683bc',
              fontSize: '13px',
              borderRadius: '24px',
            }}
            onClick={createNewCampaign}
          />
        </ContainerRow>
      )}
      {
        !loading && selectedCampaign && selectedCampaign.finished === 0 && (
          <ContainerRow>
            <Button
              label="CANCEL CAMPAIGN"
              height="48px"
              width="70%"
              style={{
                backgroundColor: '#3683bc',
                fontSize: '13px',
                borderRadius: '24px',
              }}
              onClick={cancel}
            />
          </ContainerRow>
        )
      }
    </Form>
  )
}
