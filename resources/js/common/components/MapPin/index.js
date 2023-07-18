import React from 'react'
import STATUS_PIN from '~assets/icons/status_pin';
import STATUS_ICON from '~assets/icons/status_icon';
import './style.scss'

export const MapPin = ({ property, onClickPin }) => {
  const status = property && property.status ? property.status : 'New'
  const containerStyle = {
    backgroundImage: `url(${STATUS_PIN[status]})`,
  };

  return (
    <div
      className="pin-container"
      style={containerStyle}
      // eslint-disable-next-line no-undef
      ref={(ref) => ref && google.maps.OverlayView.preventMapHitsFrom(ref)}
      onClick={onClickPin}
    >
      <div
        className="icon-container"
      >
        <img className="status-icon" src={STATUS_ICON[status]} alt="pin" />
      </div>
    </div>
  )
}
