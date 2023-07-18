import React from 'react'
import { Link } from 'react-router-dom'
import './style.scss'

export default ({
  checked,
  onChange,
  // showTosModal
}) => {
  return (
    <div className="tos-container">
      <label className="custom-check" htmlFor="tos">
        <input type="checkbox" id="tos" name="tos" checked={checked} onChange={() => onChange(!checked)} />
                  &nbsp;Click here to accept&nbsp;
        <Link
          to="/tos"
          // onClick={showTosModal}
          onKeyPress={() => {}}
          role="button"
          tabIndex="0"
        >
          Terms and Conditions
        </Link>
        <span className="checkmark" />
      </label>
    </div>
  )
}
