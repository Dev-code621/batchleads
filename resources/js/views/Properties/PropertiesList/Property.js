/* eslint-disable prefer-destructuring */
import React from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { FaMapMarkerAlt } from 'react-icons/fa'
import { actions as propertyActions } from '~redux/modules/property'
import ItemSelector from '~components/ItemSelector'
import { statusColor } from '~common/constants';
import STATUS_ICON from '~assets/icons/status_icon';

const mapStateToProps = () => ({
})

const mapDispatchToProps = {
  ...propertyActions,
}

const Property = (props) => {
  const {
    address1,
    status = 'New',
    folder,
    Owner1FirstName,
    Owner1LastName,
    isSelect,
    onSelect,
    selected,
    onClickItem,
  } = props

  const onClickProperty = (event) => {
    if (event.target.className.startsWith('select-box')) {
      return
    }
    onClickItem();
  }

  const renderStatusIcon = () => {
    const statusWrapperStyle = {
      backgroundColor: statusColor[status],
    };
    return (
      <div className="icon-container" style={statusWrapperStyle}>
        <img className="status-icon" src={STATUS_ICON[status]} alt="status" />
      </div>
    )
  }

  let addressInfoClassNames = classNames('address-info');
  if (isSelect) {
    addressInfoClassNames = classNames('address-info', 'with-select')
  }

  return (
    <div
      className="property-info list-item"
      onClick={(event) => onClickProperty(event)}
      onKeyPress={() => {}}
      role="button"
      tabIndex="0"
    >
      <div className="list-item-title-container">
        <FaMapMarkerAlt color="#3683BC" width={10} height={14} />
        <div className="list-item-title">
          <div className={addressInfoClassNames}>
            {address1}
          </div>
        </div>
      </div>
      <div className="middle-container">
        <div className="owner-info">
          {`${Owner1FirstName || ''} ${Owner1LastName}`}
        </div>
        {
          isSelect && (
            <ItemSelector
              selected={selected}
              onSelect={onSelect}
              parent="property"
            />
          )
        }
      </div>
      <div className="bottom-container description-item">
        <div className="folder-container">
          {renderStatusIcon()}
          <div className="status-name">{status}</div>
        </div>
        <div className="folder-container">
          <div className="folder-name">{ folder && folder.name }</div>
        </div>
      </div>
    </div>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Property)
