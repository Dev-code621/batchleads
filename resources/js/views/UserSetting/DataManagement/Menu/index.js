import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import LoadingActivity from '~components/LoadingActivity'
import Form from '~common/components/Form'
import ContainerRow from '~components/ContainerRow'
import FormTitle from '~components/Layout/Dashboard/FormTitle'
import NavItem from '~components/NavItem'
import { toast } from '~common/helper'
import './layout/style.scss'

const DataManagement = withRouter(({
  history,
}) => {
  const [loading, setLoading] = useState(false)

  const onExport = () => {
    history.push('/dashboard/settings/datamanagement/export')
  }

  const onDownload = () => {
    setLoading(true)
    axios({
      url: `${__CONFIG__.API_ENDPOINT_URL}property/download`,
      method: 'GET',
      responseType: 'blob',
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'data.csv')
      document.body.appendChild(link)
      link.click()
      setLoading(false)
    }).catch(() => {
      toast.error('Error Occured!')
      setLoading(false)
    })
  }

  const onImport = () => {
    history.push('/dashboard/settings/datamanagement/import')
  }

  return (
    <Form className="data-management-page">
      <FormTitle title="Data Management" hasBack history={history} />
      <ContainerRow>
        <NavItem
          title="Export All Deals"
          description="Export my deals to a .csv file"
          onClick={() => onExport()}
        />
      </ContainerRow>
      <ContainerRow>
        <NavItem
          title="Download"
          description="Download Exported Data"
          onClick={() => onDownload()}
        />
      </ContainerRow>
      <ContainerRow>
        <NavItem
          title="Import"
          description="Import from .csv file"
          onClick={onImport}
        />
      </ContainerRow>
      <ContainerRow>
        {
          loading && <LoadingActivity />
        }
      </ContainerRow>
    </Form>
  )
})

export default DataManagement
