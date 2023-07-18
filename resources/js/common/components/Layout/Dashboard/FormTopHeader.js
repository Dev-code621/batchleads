import React from 'react'
import { FaArrowLeft, FaPlusCircle, FaRegTrashAlt } from 'react-icons/fa'
import { FiRefreshCw, FiFilter } from 'react-icons/fi'
import LoadingActivity from '~components/LoadingActivity'
import './FormTopHeader.style.scss'

export default ({
  showBack,
  showSearch,
  showAdd,
  showRemove,
  search,
  onChangeSearch,
  onAdd,
  onRemove,
  history,
  loading,
  showRefresh,
  onRefresh,
  showFilter,
  onClickFilter,
  customHeader,
  className,
}) => (
  <div className={`form-top-header ${className}`}>
    {
      showBack && (
      <div
        onClick={() => history.goBack()}
        onKeyPress={() => {}}
        role="button"
        tabIndex="0"
        className="back-btn"
      >
        <FaArrowLeft />
      </div>
      )
    }
    {
      showSearch && (
        <div className="search-container">
          <input
            type="text"
            placeholder="Search"
            onChange={onChangeSearch}
            value={search}
          />
        </div>
      )
    }
    {
      showAdd && (
        <div onClick={onAdd} onKeyPress={() => {}} role="button" tabIndex="0">
          <FaPlusCircle className="add-btn" />
        </div>
      )
    }
    {
      showRemove && (
        <div
          onClick={onRemove}
          onKeyPress={() => {}}
          role="button"
          tabIndex="0"
        >
          <FaRegTrashAlt />
        </div>
      )
    }
    {
      showRefresh && (
        loading ? <LoadingActivity type="Audio" width={15} height={15} />
          : (
            <div
              onClick={onRefresh}
              onKeyPress={() => {}}
              role="button"
              tabIndex="0"
            >
              <FiRefreshCw />
            </div>
          )
      )
    }
    {
      showFilter && (
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
    { customHeader && (
      { ...customHeader }
    )}
  </div>
)
