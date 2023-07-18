import React from 'react'
import { FiRefreshCw, FiFilter } from 'react-icons/fi'
import { FaArrowLeft } from 'react-icons/fa'
import LoadingActivity from '~components/LoadingActivity'
import './FormTitle.style.scss'

export default ({
  title,
  hasRefresh,
  loading,
  refresh,
  children,
  hasAdd,
  onAdd,
  history,
  hasBack,
  hasRemove,
  onRemove,
  hasFilter,
  onClickFilter,
}) => (
  <div className="form-title-container">
    <div className="form-title-container__left">
      {
        hasBack && (
          <div
            onClick={() => history.goBack()}
            onKeyPress={() => {}}
            role="button"
            tabIndex="0"
            className="btn-back"
          >
            <FaArrowLeft size="20" />
          </div>
        )
      }
      <h3 className="form-title" dangerouslySetInnerHTML={{ __html: title }} />

    </div>
    {
      children
    }
    {
      hasRefresh && (loading ? <LoadingActivity type="Audio" width={15} height={15} /> : <FiRefreshCw role="button" onClick={refresh} />)
    }
    {
      hasAdd && (
        <div onClick={onAdd} onKeyPress={() => {}} role="button" tabIndex="0" className="btn-add--round" />
      )
    }
    {
      hasRemove && (
        <div onClick={onRemove} onKeyPress={() => {}} role="button" tabIndex="0" className="btn-remove--round" />
      )
    }
    {
      hasFilter && (
        <div
          onClick={onClickFilter}
          onKeyPress={() => {}}
          role="button"
          tabIndex="0"
        >
          <FiFilter size={20} className="filter-btn" />
        </div>
      )
    }
  </div>
)
