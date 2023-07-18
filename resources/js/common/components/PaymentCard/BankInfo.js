import React from 'react'

export default ({ name }) => {
  return (
    <div className="bank-info">
      <div className="bank-name">Bank Name</div>
      <div className={`card-logo ${name}`} />
    </div>
  )
}
