import React from 'react'
import BaseModal from '~components/BaseModal'
import Button from '~components/Button'
import ScrollContainer from '~components/Layout/Dashboard/ScrollContainer'
import ContainerRow from '~components/ContainerRow'
import ShowFaces from './ShowFaces'
import './style.scss'

export default ({
  onClose,
  toggle,
  modalAction,
  onCancel,
}) => {
  const onReturnBack = () => {
    modalAction('cancel')
  }
  return (
    <BaseModal
      toggle={toggle}
      onClose={onClose}
      transparent
      closeButtonSize={36}
    >
      <ScrollContainer className="Survey-Modal">
        <ShowFaces type={3} />
        <ContainerRow className="cancel-header">
          <p>Please confirm you</p>
          <p>want to delete and</p>
          <p>lose all your data</p>
        </ContainerRow>
        <ContainerRow className="button-container button-cancel">
          <Button
            label="CANCEL IMMEDIATELY"
            width="70%"
            color="black"
            height={40}
            onClick={() => onCancel()}
          />
          <Button
            label="RETURN BACK"
            width="70%"
            color="white"
            height={40}
            onClick={() => onReturnBack()}
          />
        </ContainerRow>
      </ScrollContainer>
    </BaseModal>
  )
}
