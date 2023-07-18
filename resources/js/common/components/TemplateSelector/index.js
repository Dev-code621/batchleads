import React from 'react'
import { IoMdArrowDropright } from 'react-icons/io'
import ErrorMessage from '../ErrorMessage'
import './style.scss'

export default ({ onClick, template, error }) => {
  return (
    <div className="template-selector-container">
      <div className="label">Template</div>
      <div
        className="template-selector"
        onClick={onClick}
        onKeyPress={() => {}}
        role="button"
        tabIndex="0"
      >
        <div>
          <div className="template-label">{(template && template.name) || 'Template'}</div>
        </div>
        <IoMdArrowDropright />
      </div>
      <ErrorMessage message={error} />
    </div>
  )
}
