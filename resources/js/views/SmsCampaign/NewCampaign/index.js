import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { fromJS } from 'immutable'
import get from 'lodash.get'
import DatePicker from 'react-mobile-datepicker'
import moment from 'moment'
import { toast } from '~common/helper'
import Form from '~components/Form'
import ContainerRow from '~components/ContainerRow'
import LoadingActivity from '~components/LoadingActivity'
import ScrollContainer from '~components/Layout/Dashboard/ScrollContainer'
import Button from '~components/Button'
import Input from '~components/Input'
import TextArea from '~components/TextArea'
import FormTitle from '~components/Layout/Dashboard/FormTitle'
import DateSelector from '~components/DateSelector'
import TemplateSelector from '~components/TemplateSelector'
import PropertySelector from '~components/PropertySelector'
import CampaignStatusText from '~components/CampaignStatusText'
import ErrorMessage from '~common/components/ErrorMessage'
import ConfirmModal from '~common/components/ConfirmModal'
import { userSelector } from '~redux/selectors/userSelector'
import { actions as userActions } from '~redux/modules/user'
import BaseModal from '~components/BaseModal'
import { useThemeState } from '~common/theme-context'
import './layout/style.scss'
import { getNotSkipTracedPropertyCountApi } from '../../../common/api/module/property';

const mapStateToProps = (state) => ({
  user: userSelector(state),
})

const mapDispatchToProps = {
  ...userActions,
}

const NewCampaign = withRouter(
  ({
    history,
    property,
    smsCampaign,
    editCampaign,
    smsTemplate,
    newCampaign,
    newCampaignBulk,
    getCampaigns,
    setCampaignSearch,
    cancelCampaign,
    initTemplate,
    getPurchasedPhoneNumbers,
    user,
  }) => {
    let selectedCampaign = null
    const { state } = history.location
    if (state) {
      selectedCampaign = state.campaign
    }
    const theme = useThemeState()
    let selectedTemplate = null
    if (selectedCampaign) {
      selectedTemplate = selectedCampaign.template_master
    } else {
      selectedTemplate = smsTemplate.selectedTemplate ? smsTemplate.selectedTemplate.toJS() : null
    }
    const { campaign, result } = smsCampaign
    const { title, description } = selectedCampaign || campaign
    const startDate = selectedCampaign
      ? selectedCampaign.start_date
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
    const [errorTemplate, setErrorTemplate] = useState('')
    const [errorStartDate, setErrorStartDate] = useState('')
    const [datePickerOpened, setDatePickerOpened] = useState(false)
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [loadingNotSkipTraced, setLoadingNotSkipTraced] = useState(false)
    const [notSkipTracedCount, setNotSkipTracedCount] = useState(0)
    const [date, setDate] = useState(new Date())
    const [isCancel, setIsCancel] = useState(false)
    const loadingPhone = get(user.purchased_phone_numbers, 'loading')
    const phoneNumbers = get(user.purchased_phone_numbers, 'data')

    useEffect(() => {
      getPurchasedPhoneNumbers()
    }, [])

    useEffect(() => {
      if (success) {
        if (isCancel) {
          toast.success('Canceled!')
        } else {
          toast.success('Campaign Added')
          setCampaignSearch('')
          // initCampaigns()
          getCampaigns(1, '')
        }

        history.goBack()
      }
    }, [success])

    const onChangeName = (event) => {
      editCampaign({ title: event.target.value })
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
        history.push('/dashboard/properties', { sms_campaign_id: selectedCampaign.id })
      } else {
        history.push('/dashboard/properties/1')
      }
    }

    const onSelectTemplate = () => {
      if (selectedCampaign) {
        initTemplate()
        history.push('/dashboard/smsTemplates/new', { template: fromJS(selectedCampaign.template_master) })
      } else {
        history.push('/dashboard/smsTemplates/1')
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
      setErrorProperty('')
      setErrorTemplate('')
      setErrorStartDate('')

      if (!title) {
        setErrorName('Name Field is required.')
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

        setLoadingNotSkipTraced(true)
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

          getNotSkipTracedPropertyCountApi({
            excluded_property_ids: excludedPropertyIds,
            filter,
            property_ids: null,
          }).then((res) => {
            setLoadingNotSkipTraced(false)
            const count = res.data.data
            if (count === 0) {
              newCampaignBulk(
                title,
                description || '',
                moment(startDate).format('YYYY-MM-DD'),
                selectedTemplate.id,
                excludedPropertyIds,
                filter
              )
            } else {
              setNotSkipTracedCount(count)
              setShowConfirmModal(true)
            }
          })
            .catch((err) => {
              setLoadingNotSkipTraced(false)
              toast.error(err.message)
            })
        } else {
          getNotSkipTracedPropertyCountApi({
            excluded_property_ids: null,
            filter: null,
            property_ids: selectedPropertyIds,
          }).then((res) => {
            setLoadingNotSkipTraced(false)
            const count = res.data.data
            if (count === 0) {
              newCampaign(
                title,
                description || '',
                moment(startDate).format('YYYY-MM-DD'),
                selectedTemplate.id,
                selectedPropertyIds
              )
            } else {
              setNotSkipTracedCount(count)
              setShowConfirmModal(true)
            }
          })
            .catch((err) => {
              setLoadingNotSkipTraced(false)
              toast.error(err.message)
            })
        }
      }
    }

    const cancel = () => {
      setIsCancel(true)
      cancelCampaign(selectedCampaign.id)
    }

    const onClosePopup = () => {
      history.push('/dashboard/settings/phonenumbers/purchase')
    }

    const footer = (
      <div className="footer-wrapper" style={{ justifyContent: 'flex-end' }}>
        <Button onClick={onClosePopup} label="OK" style={{ width: 80, height: 40, float: 'right' }} />
      </div>
    )

    const onContinue = (skiptracing = true) => {
      setShowConfirmModal(false)
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
          description || '',
          moment(startDate).format('YYYY-MM-DD'),
          selectedTemplate.id,
          excludedPropertyIds,
          filter,
          skiptracing
        )
      } else {
        newCampaign(
          title,
          description || '',
          moment(startDate).format('YYYY-MM-DD'),
          selectedTemplate.id,
          selectedPropertyIds,
          skiptracing
        )
      }
    }

    return (
      <Form className="new-campaign-form">
        <FormTitle title={selectedCampaign ? 'SMS Campaign' : 'New SMS Campaign'} hasBack history={history}>
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
              placeholder="New Property Owners"
              height={48}
              error={
                errorName
                || (errorMessage && errorMessage.error && errorMessage.error.title)
              }
              noIcon
              fontSize={14}
              className="input-field"
              readOnly={selectedCampaign}
            />
          </ContainerRow>
          <ContainerRow>
            <TextArea
              value={description || ''}
              onChange={onChangeDescription}
              placeholder="Enter your description here"
              label="Description (optional)"
              fontSize={14}
              className="input-field"
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
                  && errorMessage.error.template_master_id)
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
                  && errorMessage.error.start_date)
              }
            />
          </ContainerRow>
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
          {(loading || loadingPhone || loadingNotSkipTraced) && (
            <ContainerRow>
              <LoadingActivity />
            </ContainerRow>
          )}
        </ScrollContainer>
        {!loading && !selectedCampaign && !loadingNotSkipTraced && (
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
                width="100%"
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
        { !loadingPhone
          && (!phoneNumbers || phoneNumbers.length === 0) && (
            <BaseModal
              toggle
              onClose={onClosePopup}
              title="Add Phone Number"
              footer={footer}
            >
              <div className="phone-container">
                You Need to Purchase Phone Number!
              </div>
            </BaseModal>
        )
        }
        <ConfirmModal
          show={showConfirmModal}
          title={__CONFIG__.APP_NAME}
          message={`You haven't skip traced ${notSkipTracedCount} properties yet.<br />Would you like to skip trace them and continue?`}
          onOK={() => onContinue(0)}
          onCancel={() => setShowConfirmModal(false)}
          onOther={() => onContinue(1)}
          OKLabel="Continue"
          otherLabel="Skip Trace"
        />
      </Form>
    )
  }
)

export default connect(mapStateToProps, mapDispatchToProps)(NewCampaign)
