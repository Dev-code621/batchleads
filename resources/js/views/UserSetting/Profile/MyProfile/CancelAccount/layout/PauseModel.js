import React from 'react'
import BaseModal from '~components/BaseModal'
import Button from '~components/Button'
import ScrollContainer from '~components/Layout/Dashboard/ScrollContainer'
import ContainerRow from '~components/ContainerRow'
import ShowFaces from './ShowFaces'
import checkBlue from '~assets/icons/check_blue.svg'
import './style.scss'

export default ({
  onClose,
  toggle,
  modalAction,
  onPause,
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
        <ShowFaces type={2} />
        <ContainerRow className="pause-header">
          <div>
            <p>By pausing your account, you can</p>
            <p>save all your existing data.</p>
            <p>This plan will allow you to reactivate</p>
            <p>
              and resume your
              <span> BatchDriven account </span>
            </p>
            <p>
              at anytime. Its only
              <span> $25/month </span>
              .
            </p>
          </div>
        </ContainerRow>
        <ContainerRow className="pause-details">
          <p>
            <img src={checkBlue} alt="check" />
            Save all
            <span> address </span>
            and
            <span> folders</span>
          </p>
          <p>
            <img src={checkBlue} alt="check" />
            Save
            <span> existing </span>
            skip traced data
          </p>
          <p>
            <img src={checkBlue} alt="check" />
            Save all
            <span> historical campaigns</span>
          </p>
          <p>
            <img src={checkBlue} alt="check" />
            Save all
            <span> notes </span>
            and account
            <span> activity </span>
          </p>
        </ContainerRow>
        <ContainerRow className="button-container">
          <Button
            label="PAUSE NOW"
            width="70%"
            height={40}
            onClick={() => onPause()}
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
