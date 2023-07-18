import React from 'react'

export default ({ title, secondTitle }) => {
  return (
    <div className="title-container">
      <div className="title-content">
        {
          title
        }
      </div>
      {
        secondTitle && (
          <div className="title-content">
            {
              secondTitle
            }
          </div>
        )
      }
    </div>
  )
}
