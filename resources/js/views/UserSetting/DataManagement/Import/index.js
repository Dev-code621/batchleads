import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import get from 'lodash.get'
import { useDispatch, useSelector } from 'react-redux'
import { endTrial, initEndTrial } from '~redux/modules/credit'
import { endTrialResultSelector } from '~redux/selectors/creditSelector'
import LoadingActivity from '~components/LoadingActivity'
import Form from '~common/components/Form'
import ContainerRow from '~components/ContainerRow'
import FormTitle from '~components/Layout/Dashboard/FormTitle'
import NavItem from '~components/NavItem'
import ErrorMessage from '~components/ErrorMessage'
import FolderSelector from '~components/CollapsibleSelector/FolderSelector'
import Button from '~components/Button'
import { toast } from '~common/helper'
import KeySelector from './layout/KeySelector'
import './layout/style.scss'

const DataManagement = withRouter(({
  history,
}) => {
  let fileInput = null
  const dispatch = useDispatch()
  const initialFolder = { id: null, name: 'Select Folder' }
  const [loading, setLoading] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [errorFolderId, setErrorFolderId] = useState(null)
  const [propertyCount, setPropertyCount] = useState(0)
  const [importFileName, setImportFileName] = useState(null)
  const [selectedFolder, setSelectedFolder] = useState(initialFolder)
  const [keys, setKeys] = useState(null)
  const [address, setAddress] = useState(null)
  const [city, setCity] = useState(null)
  const [state, setState] = useState(null)
  const [zip, setZip] = useState(null)
  const [phone1, setPhone1] = useState(null)
  const [phone2, setPhone2] = useState(null)
  const [phone3, setPhone3] = useState(null)
  const [email1, setEmail1] = useState(null)
  const [email2, setEmail2] = useState(null)
  const [errorAddress, setErrorAddress] = useState(null)
  const [errorCity, setErrorCity] = useState(null)
  const [errorState, setErrorState] = useState(null)
  const [errorZip, setErrorZip] = useState(null)

  const onTryFileUpload = () => {
    setErrorMessage(null)
    setPropertyCount(0)
    setErrorAddress(null)
    setErrorCity(null)
    setErrorState(null)
    setErrorZip(null)
    setErrorFolderId(null)
    fileInput.click()
  }

  const importData = () => {
    if (!selectedFolder.id) {
      setErrorFolderId('Need to select folder')
      return
    }
    if (!address) {
      setErrorAddress('Need to select address field')
      return
    }
    if (!city) {
      setErrorCity('Need to select city field')
      return
    }
    if (!state) {
      setErrorState('Need to select state field')
      return
    }
    if (!zip) {
      setErrorZip('Need to select zip field')
      return
    }

    setLoading(true)
    axios({
      url: `${__CONFIG__.API_ENDPOINT_URL}property/import`,
      method: 'POST',
      data: {
        file_name: importFileName,
        folder_id: selectedFolder.id,
        address,
        city,
        state,
        zip,
        phone1,
        phone2,
        phone3,
        email1,
        email2,
      },
    }).then((response) => {
      if (response.status === 200) {
        setPropertyCount(0)
        setShowImport(false)
        setImportFileName(null)
        setErrorFolderId(null)
        setSelectedFolder(initialFolder)
        setLoading(false)
        toast.success('Imported!')
      }
      setLoading(false)
    }).catch((error) => {
      if (error.response) {
        const message = get(error.response, 'data.message')
        const status = get(error.response, 'status')
        const data = get(error.response, 'data.data')
        if (status === 434) {
          const {
            current_count: currentCount,
            count_to_add: countToAdd,
            trial_count: trialCount,
          } = data
          if (confirm(`You are going to add ${countToAdd} properties, but in trial period allowed to add ${trialCount} properties, you currently have ${currentCount} properties. Do you want to end Trial and continue?`)) {
            dispatch(endTrial())
          }
        } else {
          setErrorMessage(message)
        }
      } else {
        setErrorMessage('Error occured!')
      }
      setLoading(false)
    })
  }

  const endTrialResult = useSelector(endTrialResultSelector)
  const endTrialSuccess = get(endTrialResult, 'success')

  useEffect(() => {
    if (endTrialSuccess) {
      dispatch(initEndTrial())
      importData()
    }
  }, [endTrialSuccess])

  const onSelectCsv = (event) => {
    setLoading(true)
    setShowImport(true)
    setKeys(null)
    setAddress(null)
    setCity(null)
    setState(null)
    setZip(null)
    const { files } = event.target
    const formData = new FormData()
    formData.append('import_file', files[0])
    axios({
      url: `${__CONFIG__.API_ENDPOINT_URL}property/upload`,
      method: 'POST',
      data: formData,
    }).then((response) => {
      if (response.status === 200) {
        const { data } = response
        const { count, file_name: fileName, keys: csvKeys } = data.data
        setPropertyCount(count)
        setImportFileName(fileName)
        setKeys(csvKeys)
      }
      setLoading(false)
    }).catch((error) => {
      if (error.response) {
        const data = get(error.response, 'data.message')
        setErrorMessage(data)
      }
      setLoading(false)
    })
  }

  return (
    <Form className="data-import-page">
      <FormTitle title="Data Import" hasBack history={history} />
      <ContainerRow>
        {
          !showImport && (
            <NavItem
              title="Select File"
              description=".csv"
              onClick={onTryFileUpload}
            />
          )
        }
      </ContainerRow>
      {
        propertyCount !== 0 && (
        <React.Fragment>
          <ContainerRow>
            <NavItem
              title={`Properties to import: ${propertyCount}`}
              description="Click to upload another file."
              onClick={() => {
                setShowImport(false)
                setPropertyCount(0)
              }}
            />
          </ContainerRow>
          <ContainerRow>
            <FolderSelector
              onSelect={(item) => {
                setErrorFolderId(null)
                setSelectedFolder(item)
              }}
              selectedFolder={selectedFolder}
              showAddOption
            />
          </ContainerRow>
          <ErrorMessage message={errorFolderId} />
          <ContainerRow title="Address">
            <KeySelector
              keys={keys}
              selectedKey={address}
              onSelect={(item) => {
                setAddress(item)
                setErrorAddress(null)
              }}
            />
          </ContainerRow>
          <ErrorMessage message={errorAddress} />
          <ContainerRow title="City">
            <KeySelector
              keys={keys}
              selectedKey={city}
              onSelect={(item) => {
                setCity(item)
                setErrorCity(null)
              }}
            />
          </ContainerRow>
          <ErrorMessage message={errorCity} />
          <ContainerRow title="State">
            <KeySelector
              keys={keys}
              selectedKey={state}
              onSelect={(item) => {
                setState(item)
                setErrorState(null)
              }}
            />
          </ContainerRow>
          <ErrorMessage message={errorState} />
          <ContainerRow title="Zip">
            <KeySelector
              keys={keys}
              selectedKey={zip}
              onSelect={(item) => {
                setZip(item)
                setErrorZip(null)
              }}
            />
          </ContainerRow>
          <ErrorMessage message={errorZip} />
          <ContainerRow title="Phone1">
            <KeySelector
              keys={keys}
              selectedKey={phone1}
              onSelect={(item) => {
                setPhone1(item)
              }}
            />
          </ContainerRow>
          <ContainerRow title="Phone2">
            <KeySelector
              keys={keys}
              selectedKey={phone2}
              onSelect={(item) => {
                setPhone2(item)
              }}
            />
          </ContainerRow>
          <ContainerRow title="Phone3">
            <KeySelector
              keys={keys}
              selectedKey={phone3}
              onSelect={(item) => {
                setPhone3(item)
              }}
            />
          </ContainerRow>
          <ContainerRow title="Email1">
            <KeySelector
              keys={keys}
              selectedKey={email1}
              onSelect={(item) => {
                setEmail1(item)
              }}
            />
          </ContainerRow>
          <ContainerRow title="Email2">
            <KeySelector
              keys={keys}
              selectedKey={email2}
              onSelect={(item) => {
                setEmail2(item)
              }}
            />
          </ContainerRow>
        </React.Fragment>
        )
      }
      <ErrorMessage message={errorMessage} />
      <input
        type="file"
        ref={(input) => {
          fileInput = input
          return true
        }}
        accept=".csv"
        onChange={onSelectCsv}
        multiple={false}
        onClick={(e) => {
          e.target.value = null
        }}
      />
      <ContainerRow>
        {
          loading && <LoadingActivity />
        }
        {
          !loading && showImport && <Button label="Import" width="70%" height={40} onClick={importData} />
        }
      </ContainerRow>
    </Form>
  )
})

export default DataManagement
