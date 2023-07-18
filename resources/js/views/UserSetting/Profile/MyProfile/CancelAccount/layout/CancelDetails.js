import React, { useState } from 'react'
import ItemSelector from '~components/ItemSelector'
import Input from '~components/Input'
import TextArea from '~components/TextArea'
import Thumbup from '~assets/images/thumbup.svg'
import ContainerRow from '~components/ContainerRow'

export default ({
  option,
  buttonEnable,
  onChange,
  onCancelText,
  cancelText,
}) => {
  const [checked, setCheck] = useState(undefined)
  const onChangeCheck = (value) => {
    setCheck(value)
    onChange(value)
  }
  const onDeleteText = (e) => {
    if (option && option.enableButton
      && option.enableButton.indexOf(e.target.value.toLowerCase()) > -1) {
      buttonEnable(true)
    } else {
      buttonEnable(false)
    }
  }
  return (
    <div>
      {option && option.fields
      && (option.fields.indexOf(1) > -1)
      && (
      <ContainerRow className="cancel-text">
        <div>Would you like us to connect you with some</div>
        <div> Real Estate mentors?</div>
        <div className="get-details">
          <div className="get-items">
            <ItemSelector
              selected={checked}
              onSelect={() => onChangeCheck(true)}
            />
            &nbsp;&nbsp;Yes
          </div>
          <div className="get-items">
            <ItemSelector
              selected={checked === false}
              onSelect={() => onChangeCheck(false)}
            />
            &nbsp;&nbsp;No
          </div>
        </div>
      </ContainerRow>
      )}
      {checked && option && option.fields
      && (option.fields.indexOf(2) > -1)
      && (
        <ContainerRow className="cancel-thumb">
          <div><img src={Thumbup} alt="ThumpUP" /></div>
          <div>
            <span>GREAT!</span>
            <p>We will contact you shortly</p>
          </div>
        </ContainerRow>
      )}
      {option && option.fields
      && (option.fields.indexOf(3) > -1)
      && (
      <ContainerRow>
        <TextArea
          type="text"
          placeholder={option.feedback}
          onChange={(e) => onCancelText(e, option.text)}
          width="100%"
          noIcon
          value={cancelText}
        />
      </ContainerRow>
      )}
      {option && option.fields && !checked && (option.fields.indexOf(4) > -1)
      && (
        <ContainerRow className="cancel-text">
          <div>
            * Type word
            <span> DELETE </span>
            in text fields for security
          </div>
          <Input
            type="text"
            label=""
            onChange={onDeleteText}
            width="100%"
            noIcon
          />
        </ContainerRow>
      )}
    </div>
  )
}
