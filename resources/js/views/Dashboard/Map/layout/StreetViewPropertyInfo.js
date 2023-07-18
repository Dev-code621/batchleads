import React, { useState, useEffect } from 'react'
import { GiPositionMarker } from 'react-icons/gi'
import LoadingActivity from '~components/LoadingActivity'
import Form from '~components/Form'
import {
  formatDateString,
  formatPriceValue,
} from '~common/helper'
import Button from '~components/Button'

const StreetViewPropertyInfo = ({
  property, loading, error, selectProperty,
}) => {
  const [visible, setVisible] = useState(false)

  let ownerOccupied = null
  let address1 = null
  let currentOwnerName = null
  let salePrice = null
  let saleDate = null
  let totalValue = null
  let squareFootage = null
  if (property) {
    ({ address1 } = property)
    currentOwnerName = `${property.Owner1FirstName || ''} ${property.Owner1LastName || ''}`
    ownerOccupied = (property.Owner_Occupied === 'Y' || property.Owner_Occupied === '1' || property.Owner_Occupied === true) ? 'Owner Occupied' : 'Absentee Owner'
    salePrice = property.Sale_Price
    saleDate = property.Sale_Date
    totalValue = property.Total_Value
    squareFootage = property.Square_Footage
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
    if (property) {
      setVisible(true)
    }
  }, [property])

  const gotoAdd = (e) => {
    e.stopPropagation();
    setVisible(false)
    selectProperty(property);
  }

  const showClassName = property && visible && 'show'
  return (
    <div>
      <Form className={`property-info-window ${showClassName}`}>
        {
          loading && <div className="loading-container"><LoadingActivity /></div>
        }
        {
          !loading && property && (
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
                <Button id="property-add-button" label="+ Add Property" onClick={gotoAdd} />
              </div>
            </React.Fragment>
          )
        }
      </Form>
    </div>
  )
}

export default StreetViewPropertyInfo
