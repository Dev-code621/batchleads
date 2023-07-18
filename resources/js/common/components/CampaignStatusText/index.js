import React from 'react'
import './style.scss'

export default ({ status }) => {
  if (status === 1) {
    return <div className="campaign-current-status status-finished">Finished</div>
  }
  if (status === 2) {
    return <div className="campaign-current-status status-canceled">Canceled</div>
  }
  if (status === 3) {
    return <div className="campaign-current-status status-in-progress">In Progress</div>
  }
  if (status === 0) {
    return <div className="campaign-current-status status-in-progress">In Progress</div>
  }
  return <div />
}
