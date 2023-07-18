import React from 'react'

export default (
  {
    title,
    description,
    price,
    paidType,
    image,
  }
) => {
  return (
    <div className="additional-option-card">
      <div className="additional-option-header">
        <img src={image} alt="check" />
      </div>
      <div className="additional-option-body">
        <div className="card__title">
          {title}
        </div>
        <p>{description}</p>
      </div>
      <div className="additional-option-footer">
        <div className="additional-price">
          {`$${price}`}
        </div>
        <div>
          {`per ${paidType}`}
        </div>
      </div>
    </div>
  )
}
