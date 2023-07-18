import React from 'react'
import { IoIosCheckmarkCircle, IoIosRadioButtonOff } from 'react-icons/io'

export default ({
  title, active, onClick, disabled, selectedLocationType, activeType,
}) => {
  const isLocationType = selectedLocationType !== 'region'
  return (
    <div
      onClick={onClick}
      className={`search-option${active ? ' active' : ''}${disabled ? ' disabled' : ''}`}
      role="button"
      tabIndex="0"
    >
      {active && <IoIosCheckmarkCircle size={20} color="#3683bc" />}
      {!active && <IoIosRadioButtonOff size={20} color="#c3c3c3" />}
      <div className="title">{title}</div>
      {isLocationType && (
        <div className="sub-option-wrapper">
          <div>(&nbsp;</div>
          <div className={`sub-option ${active && selectedLocationType === 'address' ? ' active' : 'unactive'}`}>{activeType}</div>
          <div>&nbsp;)</div>
        </div>
      )}
    </div>
  )
}
