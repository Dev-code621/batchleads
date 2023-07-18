import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { InfoBox } from '@react-google-maps/api'
import get from 'lodash.get'
import { GiPositionMarker } from 'react-icons/gi'
import { propertySelector } from '~redux/selectors/propertySelector'
import { actions as propertyActions } from '~redux/modules/property'
import Button from '~components/Button'
import LoadingActivity from '~components/LoadingActivity'
import Form from '~components/Form'
import {
  formatDateString,
  formatPriceValue,
} from '~common/helper'

const mapStateToProps = (state) => ({
  property: propertySelector(state),
})

const mapDispatchToProps = {
  ...propertyActions,
}

const PropertyInfoWindow = withRouter(({
  property,
  removePin, selectProperty, history,
  pin,
  position,
}) => {
  const [visible, setVisible] = useState(true)
  const propertyByLatLng = get(property.resultPropertyByLatLng, 'propertyByLatLng', pin)
  const { loading, error } = property.resultPropertyByLatLng;
  // const propertyByDistance = get(propertyArray, 0) || pin

  let ownerOccupied = null
  let address1 = null
  let currentOwnerName = null
  let salePrice = null
  let saleDate = null
  let totalValue = null
  let squareFootage = null
  if (propertyByLatLng) {
    ({ address1 } = propertyByLatLng)
    currentOwnerName = `${propertyByLatLng.Owner1FirstName || ''} ${propertyByLatLng.Owner1LastName || ''}`
    ownerOccupied = (propertyByLatLng.Owner_Occupied === 'Y' || propertyByLatLng.Owner_Occupied === '1' || propertyByLatLng.Owner_Occupied === true) ? 'Owner Occupied' : 'Absentee Owner'
    salePrice = propertyByLatLng.Sale_Price
    saleDate = propertyByLatLng.Sale_Date
    totalValue = propertyByLatLng.Total_Value
    squareFootage = propertyByLatLng.Square_Footage
  }

  useEffect(() => {
    if (error) {
      setVisible(false)
    }
  }, [error])

  useEffect(() => {
    if (loading) {
      setVisible(true)
    }
  }, [loading])

  useEffect(() => {
    if (pin) {
      setVisible(true)
    }
  }, [pin])

  const gotoAdd = (e) => {
    e.stopPropagation();
    setVisible(false)
    removePin()
    selectProperty(propertyByLatLng);
    setTimeout(() => {
      history.push('/dashboard/properties/detail')
    }, 500)
  }

  const onBoxReady = () => {
    const addButton = document.getElementById('property-add-button');
    if (addButton) {
      addButton.addEventListener('click', gotoAdd)
    }
  }

  const showClassName = propertyByLatLng && visible && 'show'
  return (
    <InfoBox
      options={{
        closeBoxURL: '',
        // eslint-disable-next-line no-undef
        pixelOffset: new google.maps.Size(-180, 0),
        enableEventPropagation: false,
      }}
      position={position}
      onDomReady={onBoxReady}
    >
      <Form className={`property-info-window ${showClassName}`}>
        {
          loading && <div className="loading-container"><LoadingActivity /></div>
        }
        {
          !loading && propertyByLatLng && (
            <React.Fragment>
              <div className="owner-occupied">{ownerOccupied}</div>
              <div className="address-container">
                <GiPositionMarker width={10} height={15} color="#3683BC" />
                <div className="address">{address1}</div>
              </div>
              <div className="owner-container">
                <div className="owner-name-wrapper">
                  <img src={require('assets/icons/user_outline.svg')} alt="avatar" />
                  <span>Owner:</span>
                  <div className="owner-name">{currentOwnerName}</div>
                </div>
              </div>
              <div className="sale-info-container">
                <div className="sale-price">
                  <div>Sale Price:</div>
                  <div>{formatPriceValue(salePrice)}</div>
                </div>
                <div className="sale-date">
                  <div>Sale Date:</div>
                  <div>
                    {
                      (saleDate && formatDateString(saleDate)) || ' '
                    }
                  </div>
                </div>
              </div>
              <div className="total-info-container">
                <div className="total-value">
                  <div>Estimated Equity:</div>
                  <div>{formatPriceValue(totalValue)}</div>
                </div>
                <div className="square-footage">
                  <div>Square footage:</div>
                  <div>{squareFootage ? parseFloat(squareFootage).toLocaleString() : '--'}</div>
                </div>
              </div>
              <div className="button-container">
                <Button id="property-add-button" label={`${propertyByLatLng.id ? 'View Property' : '+ Add Property'}`} onClick={gotoAdd} />
              </div>
            </React.Fragment>
          )
        }
      </Form>
    </InfoBox>
  )
})

export default connect(mapStateToProps, mapDispatchToProps)(PropertyInfoWindow)
