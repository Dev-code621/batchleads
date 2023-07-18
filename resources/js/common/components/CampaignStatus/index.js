import React from 'react'
import './style.scss'

const campaignStatus = [
  'progress-status',
  'finished-status',
  'canceled-status',
  'progress-status',
]
export default ({ status }) => (
  <div className={`campaign-status ${campaignStatus[status]}`} />
)
