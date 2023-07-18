import React, { useState, useEffect } from 'react'
import cloneDeep from 'lodash.clonedeep'
import { toast, formatPhoneInput } from '~common/helper'
import LoadingActivity from '~components/LoadingActivity'
import Button from '~components/Button'
import Input from '~components/Input'
import TextArea from '~components/TextArea'
import Form from '~common/components/Form'
import FormTitle from '~components/Layout/Dashboard/FormTitle'
import ContainerRow from '~common/components/ContainerRow'
import ErrorMessage from '~common/components/ErrorMessage'
import ScrollContainer from '~components/Layout/Dashboard/ScrollContainer'

import './layout/style.scss'

export default (props) => {
  const {
    history,
    mailSignature,
    editSignature,
    setSignature,
    createSignature,
    updateSignature,
    removeSignature,
  } = props

  let selectedSignature = null
  const { state } = history.location
  if (state) {
    selectedSignature = cloneDeep(state.signature)
  }

  let { signature } = mailSignature
  signature = signature.toJS()

  const {
    label,
    name,
    sign_off: signOff,
    contact_phone: contactPhone,
    contact_email: contactEmail,
    contact_website: contactWebsite,
    address_line1: addressLine1,
    address_line2: addressLine2,
    address_city: addressCity,
    address_state: addressState,
    address_zip: addressZip,
    disclosure_agreement: disclosureAgreement,
    mail_template_count: mailTemplateCount,
    loading,
    error,
    success,
  } = signature

  const [isRemove, setIsRemove] = useState(false)

  useEffect(() => {
    if (success) {
      if (selectedSignature) {
        if (isRemove) {
          toast.success('Signature Removed')
        } else {
          toast.success('Signature Updated')
        }
      } else {
        toast.success('Signature Added')
      }
      history.goBack()
    }
  }, [success])

  useEffect(() => {
    if (selectedSignature) {
      setSignature(selectedSignature.toJS())
    }
  }, [])

  useEffect(() => {
    if (error && error.message) {
      if (error.error && Object.keys(error.error).length) {
        toast.error(error.error[Object.keys(error.error)[0]]);
      } else if (error.message) {
        toast.error(error.message);
      }
    }
  }, [error])

  const createNewSignature = () => {
    setIsRemove(false)

    if (selectedSignature) {
      updateSignature(signature)
    } else {
      createSignature(signature)
    }
  }

  const remove = () => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm('Are you sure?')) {
      setIsRemove(true)
      removeSignature(selectedSignature.get('id'))
    }
  }

  return (
    <Form className="new-signature-form">
      <FormTitle
        title={selectedSignature ? 'Edit Mail Signature' : 'New Mail Signature'}
        hasBack
        history={history}
        hasRemove={selectedSignature && !mailTemplateCount}
        onRemove={remove}
      />
      <ScrollContainer>
        <ContainerRow>
          <Input
            type="text"
            label="Friendly Name"
            value={label}
            onChange={(event) => editSignature({ label: event.target.value })}
            placeholder="Friendly Name"
            error={error && error.error && error.error.label}
            noIcon
            fontSize={14}
            className="input-field"
          />
        </ContainerRow>
        <ContainerRow>
          <Input
            type="text"
            label="Signature Name"
            value={name}
            onChange={(event) => editSignature({ name: event.target.value })}
            placeholder="Signature Name"
            error={error && error.error && error.error.name}
            noIcon
            fontSize={14}
            className="input-field"
          />
        </ContainerRow>
        <ContainerRow>
          <Input
            type="text"
            label="Signature Sign Off"
            value={signOff}
            onChange={(event) => editSignature({ sign_off: event.target.value })}
            placeholder="Signature Sign Off"
            error={error && error.error && error.error.sign_off}
            noIcon
            fontSize={14}
            className="input-field"
          />
        </ContainerRow>
        <ContainerRow>
          <div className="legend-label">Contact Information</div>
        </ContainerRow>
        <ContainerRow>
          <Input
            type="text"
            label="Phone Number"
            value={formatPhoneInput(contactPhone)}
            onChange={(event) => editSignature({ contact_phone: event.target.value })}
            placeholder="Phone Number"
            error={error && error.error && error.error.contact_phone}
            noIcon
            fontSize={14}
            className="input-field"
          />
        </ContainerRow>
        <ContainerRow>
          <Input
            type="text"
            label="Email Address"
            value={contactEmail}
            onChange={(event) => editSignature({ contact_email: event.target.value })}
            placeholder="Email Address"
            error={error && error.error && error.error.contact_email}
            noIcon
            fontSize={14}
            className="input-field"
          />
        </ContainerRow>
        <ContainerRow>
          <Input
            type="text"
            label="Website (optional)"
            value={contactWebsite}
            onChange={(event) => editSignature({ contact_website: event.target.value })}
            placeholder="Website"
            noIcon
            fontSize={14}
            className="input-field"
          />
        </ContainerRow>
        <ContainerRow>
          <div className="legend-label">Address</div>
        </ContainerRow>
        <ContainerRow>
          <Input
            type="text"
            label="Address Line1"
            value={addressLine1}
            onChange={(event) => editSignature({ address_line1: event.target.value })}
            placeholder="Address Line1"
            error={error && error.error && error.error.address_line1}
            noIcon
            fontSize={14}
            className="input-field"
          />
        </ContainerRow>
        <ContainerRow>
          <Input
            type="text"
            label="Address Line2"
            value={addressLine2}
            onChange={(event) => editSignature({ address_line2: event.target.value })}
            placeholder="Address Line2"
            error={error && error.error && error.error.address_line2}
            noIcon
            fontSize={14}
            className="input-field"
          />
        </ContainerRow>
        <ContainerRow>
          <Input
            type="text"
            label="City"
            value={addressCity}
            onChange={(event) => editSignature({ address_city: event.target.value })}
            placeholder="City"
            error={error && error.error && error.error.address_city}
            noIcon
            fontSize={14}
            className="input-field"
          />
        </ContainerRow>
        <ContainerRow>
          <Input
            type="text"
            label="State"
            value={addressState}
            onChange={(event) => editSignature({ address_state: event.target.value })}
            placeholder="State"
            error={error && error.error && error.error.address_state}
            noIcon
            fontSize={14}
            className="input-field"
          />
        </ContainerRow>
        <ContainerRow>
          <Input
            type="text"
            label="Zip-code"
            value={addressZip}
            onChange={(event) => editSignature({ address_zip: event.target.value })}
            placeholder="Zip-code"
            error={error && error.error && error.error.address_zip}
            noIcon
            fontSize={14}
            className="input-field"
          />
        </ContainerRow>
        <ContainerRow>
          <div className="legend-label">Disclosure Agreement</div>
        </ContainerRow>
        <ContainerRow>
          <TextArea
            placeholder="Enter your disclosure here"
            value={disclosureAgreement}
            onChange={(event) => editSignature({ disclosure_agreement: event.target.value })}
          />
        </ContainerRow>
        <ContainerRow>
          <ErrorMessage message={error && `*${error.message}`} />
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
            label={selectedSignature ? 'SAVE' : 'CREATE'}
            height="40px"
            width="70%"
            style={{
              backgroundColor: '#3683bc',
              fontSize: '13px',
              borderRadius: '24px',
            }}
            onClick={createNewSignature}
          />
        </ContainerRow>
      )}
    </Form>
  )
}
