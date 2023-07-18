import React, { useEffect, useState } from 'react'
import Immutable from 'immutable'
import InfiniteScroll from '~components/Layout/Dashboard/InfiniteScroll'
import Form from '~components/Form'
import Button from '~components/Button'
import NoItemsDescription from '~components/NoItemsDescription'
import Campaign from './Campaign'

export default (props) => {
  const {
    getCampaigns,
    initCampaigns,
    smsCampaign,
    history,
    initCampaign,
    initSelectedTemplate,
    initPropertySearch,
    initProperty,
    initTemplateSearch,
    initTemplates,
    setAllPropertySelected,
  } = props

  const [loaded, setLoaded] = useState(false)
  const { result, search } = smsCampaign

  const {
    campaigns,
    total,
    page,
    countPerPage,
    count,
    loading,
  } = result

  let campaignList = campaigns
  if (campaigns instanceof Immutable.List) {
    campaignList = campaigns.toJS()
  }

  const dataLength = count + (Number(page) - 1) * countPerPage

  useEffect(() => {
    if (dataLength === 0) {
      initCampaigns()
      getCampaigns(1, search)
    }
  }, [])

  useEffect(() => {
    if (loaded) {
      // initCampaigns()
      getCampaigns(1, search)
    }
    setLoaded(true)
  }, [search])

  const fetchData = () => {
    getCampaigns(Number(page) + 1, search)
  }

  const refresh = () => {
    // initCampaigns()
    getCampaigns(1, search)
  }

  const gotoNewCampaign = () => {
    initCampaign()
    initSelectedTemplate()
    initPropertySearch()
    initProperty()
    initTemplateSearch()
    initTemplates()
    setAllPropertySelected(false)
    history.push('/dashboard/smsCampaign/new')
  }

  const gotoViewCampaign = (campaign) => {
    initCampaign()
    history.push('/dashboard/smsCampaign/new', { campaign })
  }

  return (
    <Form className="sms-campaigns-list">
      <InfiniteScroll
        dataLength={dataLength}
        next={fetchData}
        hasMore={total && total > countPerPage * Number(page)}
        refresh={refresh}
        loading={loading}
      >
        {
            dataLength === 0 && !search && !loading && (
              <NoItemsDescription description="You don&apos;t have any SMS campaigns now,<br />but you can create">
                <Button
                  label="NEW CAMPAIGN"
                  height="48px"
                  style={{
                    backgroundColor: '#3683bc',
                    fontSize: '13px',
                    borderRadius: '24px',
                  }}
                  onClick={gotoNewCampaign}
                />
              </NoItemsDescription>
            )
          }
        {
          dataLength === 0 && search && !loading && (
            <NoItemsDescription description="No Campaigns" />
          )
        }
        {
          campaignList.map((campaign) => (
            <Campaign
              campaign={campaign}
              key={campaign.id}
              onClickItem={gotoViewCampaign}
            />
          ))
        }
      </InfiniteScroll>
    </Form>
  )
}
