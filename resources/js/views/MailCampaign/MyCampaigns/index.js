import React, { useState } from 'react'
import {
  Tab, Tabs, TabList, TabPanel,
} from 'react-tabs'
import 'react-tabs/style/react-tabs.css'
import Form from '~components/Form'
import FormTopHeader from '~components/Layout/Dashboard/FormTopHeader'
import FormTitle from '~components/Layout/Dashboard/FormTitle'
import Campaigns from './layout/Campaigns/index'
import Templates from '../../MailTemplate/TemplateList/Templates'
import Signatures from '../../MailSignature/SignatureList/Signatures'
import Button from '~components/Button'
import './layout/style.scss'

export default (props) => {
  const {
    history,
    initCampaign,
    initSelectedTemplate,
    mailCampaign,
    setCampaignSearch,
    initCampaignSearch,
    mailTemplate,
    mailSignature,
    setTemplateSearch,
    setSignatureSearch,
    initTemplateSearch,
    initSignatureSearch,
    initPropertySearch,
    initProperty,
    setAllPropertySelected,
    initTemplates,
    initTemplate,
    initSignature,
    getCampaigns,
    getTemplates,
    getSignatures,
  } = props

  const [forceUpdate, setForceUpdate] = useState(false)

  let selectedTabIndex = Number(localStorage.getItem('mail_campaigns_page_selected_tab_index') || 0)

  const { search, result } = mailCampaign
  const { search: searchTemplate, result: mailTemplateResult } = mailTemplate
  const { search: searchSignature, loading: mailSignatureLoading } = mailSignature
  const loading = result.loading || mailTemplateResult.loading || mailSignatureLoading

  const onChangeSearch = (e) => {
    if (selectedTabIndex === 0) {
      setCampaignSearch(e.target.value)
    } else if (selectedTabIndex === 1) {
      setTemplateSearch(e.target.value)
    } else if (selectedTabIndex === 2) {
      setSignatureSearch(e.target.value)
    }
  }

  const refresh = () => {
    if (selectedTabIndex === 0) {
      getCampaigns(1, search)
    } else if (selectedTabIndex === 1) {
      getTemplates(1, searchTemplate)
    } else if (selectedTabIndex === 2) {
      getSignatures(1, searchSignature)
    }
  }

  const clearSearch = () => {
    if (selectedTabIndex === 0) {
      initCampaignSearch()
    } else if (selectedTabIndex === 1) {
      initTemplateSearch()
    } else if (selectedTabIndex === 2) {
      initSignatureSearch()
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
      history.push('/dashboard/mailCampaign/new')
    } else if (selectedTabIndex === 1) {
      initTemplate()
      history.push('/dashboard/mailTemplates/new')
    } else if (selectedTabIndex === 2) {
      initSignature()
      history.push('/dashboard/mailSignatures/new')
    }
  }

  const onSelectTab = (index) => {
    localStorage.setItem('mail_campaigns_page_selected_tab_index', index)
    selectedTabIndex = Number(index)
    setForceUpdate(!forceUpdate)
  }

  const getTitle = () => {
    if (selectedTabIndex === 0) {
      return 'Mail Campaigns'
    } if (selectedTabIndex === 1) {
      return 'Mail Templates'
    }

    return 'Mail Signatures'
  }

  const getSearch = () => {
    if (selectedTabIndex === 0) {
      return search
    }
    if (selectedTabIndex === 1) {
      return searchTemplate
    }
    return searchSignature
  }

  return (
    <Form className="mail-campaigns-form">
      <FormTitle title={getTitle()} refresh={refresh} loading={loading} hasAdd onAdd={gotoAdd} />
      <FormTopHeader
        showSearch
        search={getSearch()}
        onChangeSearch={onChangeSearch}
        onClearSearch={clearSearch}
        className="campaign-search-container"
      />
      <Tabs selectedTabClassName="selected-tab" onSelect={onSelectTab} defaultIndex={selectedTabIndex}>
        <TabList className="tab-container">
          <Tab className="tab">Campaigns</Tab>
          <Tab className="tab">Templates</Tab>
          <Tab className="tab">Signatures</Tab>
        </TabList>
        <TabPanel className="tab-panel">
          <Campaigns {...props} />
        </TabPanel>
        <TabPanel className="tab-panel">
          <Templates {...props} />
        </TabPanel>
        <TabPanel className="tab-panel">
          <Signatures {...props} />
        </TabPanel>
      </Tabs>
      <div className="button-container">
        <Button label={`CREATE NEW ${['CAMPAIGN', 'TEMPLATE', 'SIGNATURE'][selectedTabIndex]}`} width="70%" height={40} onClick={gotoAdd} />
      </div>
    </Form>
  )
}
