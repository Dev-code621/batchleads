import React from 'react'
import CloseSad from '~assets/images/cancel_sad.svg'
import Cancel2 from '~assets/images/cancel2.svg'
import Cancel3 from '~assets/images/cancel3.svg'
import './style.scss'

export default ({
  type,
}) => {
  let imageType = CloseSad
  if (type === 2) {
    imageType = Cancel2
  }
  if (type === 3) {
    imageType = Cancel3
  }
  return (
    <div>
      <div className="dialog-face">
        <img src={imageType} alt="" />
      </div>
    </div>
  )
}
