import React from 'react'
import { IoIosArrowRoundForward } from 'react-icons/io'
import { connect } from 'react-redux'
import Form from '~components/Form'
import ContainerRow from '~common/components/ContainerRow'
import { formatDateString3, formatNumber, elapsedTime } from '~common/helper'
import { userSelector } from '~redux/selectors/userSelector'

import 'hamburgers/_sass/hamburgers/hamburgers.scss'
import './style.scss'

const mapStateToProps = (state) => ({
  user: userSelector(state),
})
const Summary = ({
  title, period, prevPeriod, count, prevCount, unit = '', user,
}) => {
  let percentClassName = 'plus'
  let percent = ''
  if (count >= prevCount) {
    if (count && prevCount) {
      percent = (count - prevCount) / count * 100
    }
  } else if (prevCount && count) {
    percent = (prevCount - count) / prevCount * 100
  }
  if (percent !== '') {
    percent = percent.toFixed(2)
    if (count > prevCount) {
      percent = `+ ${percent}`
    } else {
      percent = `- ${percent}`
      percentClassName = 'minus'
    }
  }

  let count1 = '--'
  let count2 = '--'
  if (count) {
    if (unit === 'mins') {
      count1 = `${elapsedTime(count * 1000)}`
    } else {
      count1 = `${formatNumber(count)} ${unit}`
    }
  }
  if (prevCount) {
    if (unit === 'mins') {
      count2 = `${elapsedTime(prevCount * 1000)}`
    } else {
      count2 = `${formatNumber(prevCount)} ${unit}`
    }
  }

  let showDate2 = true
  if (user && user.result && user.result.user && user.result.user.user
    && prevPeriod && prevPeriod[0]) {
    const d1 = Date.parse(prevPeriod[0]);
    const d2 = Date.parse(user.result.user.user.created_at);
    showDate2 = d1 > d2
  }

  return (
    <Form className="summary-info">
      <ContainerRow className="label-info">
        <div className="label">{title}</div>
        {
          percent !== '' && <div className={`percent ${percentClassName}`}>{`${percent} %`}</div>
        }
      </ContainerRow>
      {
        period && prevPeriod && (
        <ContainerRow className="info-container">
          <div className="info">
            <div className="count-info">{count1}</div>
            <div className="date-info">
              {formatDateString3(period[0])}
              <IoIosArrowRoundForward />
              {formatDateString3(period[1])}
            </div>
          </div>
          {showDate2 && (
            <div className="info prev-info">
              <div className="count-info prev">{count2}</div>
              <div className="date-info">
                {formatDateString3(prevPeriod[0])}
                <IoIosArrowRoundForward />
                {formatDateString3(prevPeriod[1])}
              </div>
            </div>
          )}
        </ContainerRow>
        )
      }
    </Form>
  )
}

export default connect(mapStateToProps)(Summary)
