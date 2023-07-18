import React from 'react'
import { FaMinus, FaCheck } from 'react-icons/fa'
import './style.scss'

export default ({ success, text }) => {
  return (
    <div className="gn-toast-wrapper">
      <div>
        <div className="icon-wrapper">
          {success && <FaCheck size={21} color="#3683BC" />}
          {!success && <FaMinus size={21} color="#F7775B" />}
        </div>
      </div>
      <div className="content-wrapper">
        <div className="title">{success ? 'SUCCESS' : 'FAILED'}</div>
        <div className="content">{text}</div>
      </div>
    </div>
  )
};
