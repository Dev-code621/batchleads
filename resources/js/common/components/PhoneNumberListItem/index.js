import React from 'react'
import { MdLocalPhone } from 'react-icons/md'
import { IoMdRemoveCircle } from 'react-icons/io'
import ItemSelector from '~components/ItemSelector'
import './style.scss'

export default ({
  selected,
  onSelect,
  phoneNumber,
  isSelect,
  showRelease,
  onRelease,
}) => (
  <div className={`list-item phone-number-item-container ${selected && 'list-item-active'}`}>
    <div className="list-item-title-container">
      <div className="phone-number-item">
        <MdLocalPhone size={20} />
        <div className="list-item-title">{phoneNumber}</div>
      </div>
      {
        isSelect && (
        <ItemSelector
          selected={selected}
          onSelect={onSelect}
          size={25}
        />
        )
      }
      {
        showRelease && (
          <IoMdRemoveCircle fontSize={20} color="#FF0000" onClick={onRelease} />
        )
      }
    </div>
  </div>
)
