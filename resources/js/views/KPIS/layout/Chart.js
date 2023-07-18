import React from 'react'
import {
  AreaChart, Area, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import cloneDeep from 'lodash.clonedeep'
import { formatDateString3, formatNumber, elapsedTime } from '~common/helper'

export default ({
  property, prevProperty, yField, title, unit = '',
}) => {
  const data = property.map((item, index) => {
    const result = cloneDeep(item)
    result.name = item.date
    result.name1 = item.date
    result.key1 = yField ? item[yField] : item.count
    if (prevProperty) {
      result.key2 = yField ? prevProperty[index][yField] : prevProperty[index].count
      result.name2 = prevProperty[index].date
    }
    return result
  })

  const CustomTooltip = ({ labelTxt, payload }) => {
    let percentClassName = 'plus'
    let percent = ''
    if (payload && payload.length) {
      if (payload[0].payload.key1 >= payload[0].payload.key2) {
        if (payload[0].payload.key1 && payload[0].payload.key2) {
          percent = (payload[0].payload.key1 - payload[0].payload.key2) / payload[0].payload.key1 * 100
        }
      } else if (payload[0].payload.key2 && payload[0].payload.key1) {
        percent = (payload[0].payload.key2 - payload[0].payload.key1) / payload[0].payload.key2 * 100
      }
      if (percent !== '') {
        percent = percent.toFixed(2)
        if (payload[0].payload.key1 > payload[0].payload.key2) {
          percent = `+ ${percent}`
        } else {
          percent = `- ${percent}`
          percentClassName = 'minus'
        }
      }
    }

    let count1 = '--'
    let count2 = '--'
    if (payload && payload.length) {
      if (payload[0].payload.key1) {
        if (unit === 'mins') {
          count1 = `${elapsedTime(payload[0].payload.key1 * 1000)}`
        } else {
          count1 = `${formatNumber(payload[0].payload.key1)} ${unit}`
        }
      }
      if (payload[0].payload.key2) {
        if (unit === 'mins') {
          count2 = `${elapsedTime(payload[0].payload.key2 * 1000)}`
        } else {
          count2 = `${formatNumber(payload[0].payload.key2)} ${unit}`
        }
      }
    }

    const tooltip = payload && payload.length ? (
      <div className="custom-tooltip">
        <div className="label-info">
          <div className="label">{labelTxt}</div>
          {
            percent !== '' && <div className={`percent ${percentClassName}`}>{`${percent} %`}</div>
          }
        </div>
        <div className="info-container">
          <div className="info">
            <div className="count-info">{count1}</div>
            <div className="date-info">{formatDateString3(payload[0].payload.name1)}</div>
          </div>
          <div className="info prev-info">
            <div className="count-info prev">{count2}</div>
            <div className="date-info">{formatDateString3(payload[0].payload.name2)}</div>
          </div>
        </div>
      </div>
    ) : <div />

    return tooltip
  }

  return (
    <ResponsiveContainer>
      <AreaChart height={300} data={data}>
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="80%" stopColor="#3683bc" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#3683bc" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="key1" stackId="1" stroke="#3683bc" strokeWidth={3} fill="url(#colorUv)" />
        {
          prevProperty && <Area type="monotone" dataKey="key2" stackId="2" stroke="#e8e8e8" strokeWidth={3} fillOpacity={0} />
        }
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip content={<CustomTooltip labelTxt={title} />} />
      </AreaChart>
    </ResponsiveContainer>
  )
}
