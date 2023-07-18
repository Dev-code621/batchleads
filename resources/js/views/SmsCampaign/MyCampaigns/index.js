import React, { useState } from 'react'
import {
  Tab, Tabs, TabList, TabPanel,
} from 'react-tabs'
import 'react-tabs/style/react-tabs.css'
import Form from '~components/Form'
import FormTopHeader from '~components/Layout/Dashboard/FormTopHeader'
import FormTitle from '~components/Layout/Dashboard/FormTitle'
import Campaigns from './layout/Campaigns/index'
import Templates from '../../SmsTemplates/TemplateList/Templates/index'
import Button from '~components/Button'
import './layout/style.scss'

export default (props) => {
  const {
    history,
    initCampaign,
    initSelectedTemplate,
    smsCampaign,
    setCampaignSearch,
    initCampaignSearch,
    smsTemplate,
    setTemplateSearch,
    initTemplateSearch,
    initPropertySearch,
    initProperty,
    setAllPropertySelected,
    initTemplates,
    initTemplate,
    getCampaigns,
    // initCampaigns,
    getTemplates,
  } = props

  const { result: smsCampaignResult } = smsCampaign
  const { loading: smsCampaignLoading } = smsCampaignResult
  const { result: smsTemplateResult } = smsTemplate
  const { loading: smsTemplateLoading } = smsTemplateResult
  const loading = smsCampaignLoading || smsTemplateLoading

  const [forceUpdate, setForceUpdate] = useState(false)

  let selectedTabIndex = Number(localStorage.getItem('sms_campaigns_page_selected_tab_index') || 0)

  const { search } = smsCampaign
  const { search: searchTemplate } = smsTemplate

  // eslint-disable-next-line no-unused-vars
  const refresh = () => {
    if (selectedTabIndex === 0) {
      // initCampaigns()
      getCampaigns(1, search)
    } else {
      // initTemplates(searchTemplate)
      getTemplates(1, searchTemplate)
    }
  }

  const onChangeSearch = (e) => {
    if (selectedTabIndex === 0) {
      setCampaignSearch(e.target.value)
    } else {
      setTemplateSearch(e.target.value)
    }
  }

  const clearSearch = () => {
    if (selectedTabIndex === 0) {
      initCampaignSearch()
    } else {
      initTemplateSearch()
    }
  }

  const gotoAdd = () => {
    if (selectedTabIndex === 0) {
      initCampaign()
      initSelectedTemplate()
      initPropertySearch()
      initProperty()
      initTemplateSearch()
      initTemplates()
      setAllPropertySelected(false)
      history.push('/dashboard/smsCampaign/new')
    } else {
      initTemplate()
      history.push('/dashboard/smsTemplates/new')
    }
  }

  const onSelectTab = (index) => {
    localStorage.setItem('sms_campaigns_page_selected_tab_index', index)
    selectedTabIndex = Number(index)
    setForceUpdate(!forceUpdate)
  }

  return (
    <Form className="my-campaigns-form">
      <FormTitle title={selectedTabIndex === 0 ? 'SMS Campaigns' : 'SMS Templates'} loading={loading} hasAdd onAdd={gotoAdd} />
      <FormTopHeader
        showSearch
        search={selectedTabIndex === 0 ? search : searchTemplate}
        onChangeSearch={onChangeSearch}
        onClearSearch={clearSearch}
        className="campaign-search-container"
      />

      <Tabs selectedTabClassName="selected-tab" onSelect={onSelectTab} defaultIndex={selectedTabIndex}>
        <TabList className="tab-container">
          <Tab className="tab">Campaigns</Tab>
          <Tab className="tab">Templates</Tab>
        </TabList>
        <TabPanel className="tab-panel">
          <Campaigns {...props} />
        </TabPanel>
        <TabPanel className="tab-panel">
          <Templates {...props} />
        </TabPanel>
      </Tabs>
      <div className="button-container">
        <Button label={!selectedTabIndex ? 'CREATE NEW CAMPAIGN' : 'CREATE NEW TEMPLATE'} width="70%" height={40} onClick={gotoAdd} />
      </div>
    </Form>
  )
}
