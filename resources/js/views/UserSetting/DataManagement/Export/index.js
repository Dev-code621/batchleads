import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import moment from 'moment'
import Form from '~components/Form'
import FormTitle from '~components/Layout/Dashboard/FormTitle'
import PropertyFilter from '~components/PropertyFilter'
import LoadingActivity from '~components/LoadingActivity'
import { toast } from '~common/helper'
import ContainerRow from '~components/ContainerRow'
import { initialState } from '~redux/modules/property'

export default withRouter(({ history }) => {
  const initialFilter = initialState().toJS().listFilter
  const [filter, setFilter] = useState(initialFilter)
  const [loading, setLoading] = useState(false)

  const applyFilter = () => {
    const params = {
      type: 'all',
      filter: {
        folder_id: null,
        status: null,
        skip_traced: null,
        user_id: null,
        owner_occupied: null,
        created_at: null,
      },
    }
    if (filter.folder.id) {
      params.filter.folder_id = filter.folder.id
    }
    if (filter.status !== 'All Deals') {
      params.filter.status = filter.status
    }
    if (filter.skipTracing.id) {
      params.filter.skip_traced = filter.skipTracing.id
    }
    if (filter.user.id) {
      params.filter.user_id = filter.user.id
    }
    if (filter.owner.id) {
      params.filter.owner_occupied = filter.owner.id
    }
    if (filter.created_at) {
      params.filter.created_at = moment(filter.created_at).format('YYYY-MM-DD');
    }
    if (filter.tags) {
      params.filter.tags = filter.tags
    }
    setLoading(true)
    axios({
      url: `${__CONFIG__.API_ENDPOINT_URL}property/export`,
      method: 'POST',
      data: params,
    }).then(() => {
      setLoading(false)
      toast.success('You will be noticed when data is ready!')
      history.goBack()
    }).catch(() => {
      toast.error('Error Occured!')
      setLoading(false)
    })
  }

  return (
    <Form>
      <FormTitle title="Filter Properties" hasRefresh hasBack history={history} refresh={() => setFilter(initialFilter)} />
      <PropertyFilter
        filter={filter}
        onChangeFilter={setFilter}
        applyFilter={applyFilter}
      />
      <ContainerRow>
        {
          loading && <LoadingActivity />
        }
      </ContainerRow>
    </Form>
  )
})
