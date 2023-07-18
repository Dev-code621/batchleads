import React, { useState, useEffect } from 'react'
import BaseModal from '~components/BaseModal'
import Button from '~components/Button'
import ScrollContainer from '~components/Layout/Dashboard/ScrollContainer'
import ContainerRow from '~components/ContainerRow'
import Options from './Options'
import ShowFaces from './ShowFaces'
import CancelDetails from './CancelDetails'
import './style.scss'

const optionList = [
  {
    id: 'cost_much',
    text: 'It Costs Too Much',
    selected: false,
    feedback: '',
    fields: [],
    enableButton: [],
  },
  {
    id: 'not_using',
    text: 'Not using it Currently',
    selected: false,
    fields: [],
    enableButton: [],
  },
  {
    id: 'technical_support',
    text: 'Technical Support Issues',
    selected: false,
    feedback: '* Please describe a technical support issue you’ve had.',
    fields: [3, 4],
    enableButton: ['delete'],
  },
  {
    id: 'data_quality',
    text: ' Data Quality Issues',
    selected: false,
    feedback: '* Please, describe why you’re not satisfied with provided data. Feel free to include States, ZIP Codes or Cities with inaccurate data ...',
    fields: [3, 4],
    enableButton: ['delete'],
  },
  {
    id: 'customer_service',
    text: ' Deficiency in Customer Service',
    selected: false,
    feedback: '* Please, describe an issue you’ve had...',
    fields: [3, 4],
    enableButton: ['delete'],
  },
  {
    id: 'found_alternative',
    text: 'Found a Better Alternative',
    selected: false,
    feedback: '* Competitor',
    fields: [3, 4],
    enableButton: ['delete'],
  },
  {
    id: 'learn_more',
    text: 'I would like to Learn more about Real Estate before using your Service',
    selected: false,
    feedback: '',
    fields: [1, 2, 4],
    enableButton: ['delete'],
  },
]

export default ({
  onClose,
  toggle,
  modalAction,
  selected,
  cancelText,
  onSelect,
  textUpdate,
  knowMore,
}) => {
  const [selObject, selectObject] = useState({})
  const [buttonEnabled, setButtonEnabled] = useState(false)

  useEffect(() => {
    const tempValue = optionList.filter((options) => (selected === options.id))
    const value = tempValue && tempValue.length > 0 ? tempValue[0] || {} : {}
    if (value && value.id && value.enableButton.length === 0) {
      setButtonEnabled(true)
    } else {
      setButtonEnabled(false)
    }
    textUpdate(undefined, value ? value.text : '')
    selectObject(value)
  }, [selected])

  const sureCancelAccount = () => {
    modalAction('confirm')
  }
  const pauseAccount = () => {
    modalAction('pause')
  }

  const setKnowMore = (value) => {
    setButtonEnabled(value)
    knowMore(value)
  }

  return (
    <BaseModal
      toggle={toggle}
      onClose={onClose}
      transparent
      closeButtonSize={36}
    >
      <ScrollContainer className="Survey-Modal">
        <ShowFaces type={1} />
        <ContainerRow className="header">
          <div>
            We are
            <span> sad </span>
            you&apos;ve decided to leave us.
          </div>
          <div className="text">Can you let us know the reason for leaving?</div>
        </ContainerRow>
        {optionList
        && optionList.map((options) => (
          <Options
            key={options.id}
            text={options.text}
            onChange={onSelect}
            checked={options.id === selected}
            itemId={options.id}
          />
        ))}
        {selected
          && (
            <CancelDetails
              option={selObject}
              onCancelText={textUpdate}
              cancelText={cancelText}
              buttonEnable={setButtonEnabled}
              onChange={setKnowMore}
            />
          )}
        <ContainerRow className="button-container">
          <Button
            label="PAUSE MY PLAN AND KEEP DATA"
            width="70%"
            height={40}
            onClick={() => pauseAccount()}
            disabled={!buttonEnabled}
          />
          <Button
            label="PROCEED WITH CANCELATION"
            width="70%"
            color="white"
            height={40}
            onClick={() => sureCancelAccount()}
            disabled={!buttonEnabled}
          />
        </ContainerRow>
      </ScrollContainer>
    </BaseModal>
  )
}
