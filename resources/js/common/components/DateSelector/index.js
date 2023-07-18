import React from 'react'
import moment from 'moment'
import { IoMdArrowDropdown } from 'react-icons/io'
import ErrorMessage from '../ErrorMessage'
import './style.scss'

export default ({ onClick, date, error }) => {
  return (
    <div className="date-selector-container">
      <div
        className="date-selector"
        onClick={onClick}
        onKeyPress={() => {}}
        role="button"
        tabIndex="0"
      >
        <div className="date-selector-label">
          {
            date ? moment(date).format('DD MMM, YYYY') : 'Start Date'
          }
        </div>
        <IoMdArrowDropdown />
      </div>
      <ErrorMessage message={error} />
    </div>
  )
}
