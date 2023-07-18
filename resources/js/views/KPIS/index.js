import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import isEqual from 'lodash.isequal'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import cloneDeep from 'lodash.clonedeep'
import {
  Tab, Tabs, TabList, TabPanel,
} from 'react-tabs'
import { Row, Col } from 'react-flexbox-grid'
import { kpiSelector } from '~redux/selectors/kpiSelector'
import { actions as propertyActions } from '~redux/modules/property'
import { actions as kpiActions } from '~redux/modules/kpi'
import FullScreenContainer from '~layout/Dashboard/FullScreenContainer'
import ModalContent from '~layout/Dashboard/ModalContent'
import Form from '~components/Form'
import ContainerRow from '~components/ContainerRow'
import FormTitle from '~components/Layout/Dashboard/FormTitle'
import LoadingActivity from '~components/LoadingActivity'
import Chart from './layout/Chart'
import Summary from './layout/Summary'
import FilterPanel from './layout/FilterPanel'
import './layout/style.scss'

const mapStateToProps = (state) => ({
  kpis: kpiSelector(state),
})

const mapDispatchToProps = {
  ...propertyActions,
  ...kpiActions,
}

const KpiCharts = ({ kpiInfos }) => {
  const { result } = kpiInfos
  if (result) {
    const data = result.get('data').toJS()
    const {
      property,
      driving_route: drivingRoute,
      mail,
      sms,
      skip_tracing: skipTracing,
      property_prev: propertyPrev,
      driving_route_prev: drivingRoutePrev,
      mail_prev: mailPrev,
      sms_prev: smsPrev,
      skip_tracing_prev: skipTracingPrev,
      prev_period: prevPeriod,
      period,
    } = data

    let count = 0
    const newProperty = property.map((item, index) => {
      const newItem = cloneDeep(item)
      if (index > 0) {
        newItem.count += count;
        ({ count } = newItem)
        return newItem
      }
      ({ count } = item)

      return item
    })

    count = 0
    const newPropertyPrev = propertyPrev.map((item, index) => {
      const newItem = cloneDeep(item)
      if (index > 0) {
        newItem.count += count;
        ({ count } = newItem)
        return newItem
      }
      ({ count } = item)

      return item
    })

    let miles = 0
    let hours = 0
    const newDrivingRoute = drivingRoute.map((item, index) => {
      const newItem = cloneDeep(item)
      if (index > 0) {
        newItem.miles = Number(newItem.miles) + Number(miles)
        newItem.hours = (Number(newItem.hours) + Number(hours))
        miles = Number(newItem.miles)
        hours = Number(newItem.hours)
        return newItem
      }
      ({ miles, hours } = item)

      return item
    })
    miles = 0
    hours = 0
    const newDrivingRoutePrev = drivingRoutePrev.map((item, index) => {
      const newItem = cloneDeep(item)
      if (index > 0) {
        newItem.miles = Number(newItem.miles) + Number(miles)
        newItem.hours = (Number(newItem.hours) + Number(hours))
        miles = Number(newItem.miles)
        hours = Number(newItem.hours)
        return newItem
      }
      ({ miles, hours } = item)

      return item
    })

    count = 0
    const newMail = mail.map((item, index) => {
      const newItem = cloneDeep(item)
      if (index > 0) {
        newItem.count += count;
        ({ count } = newItem)
        return newItem
      }
      ({ count } = item)

      return item
    })
    count = 0
    const newMailPrev = mailPrev.map((item, index) => {
      const newItem = cloneDeep(item)
      if (index > 0) {
        newItem.count += count;
        ({ count } = newItem)
        return newItem
      }
      ({ count } = item)

      return item
    })

    count = 0
    const newSms = sms.map((item, index) => {
      const newItem = cloneDeep(item)
      if (index > 0) {
        newItem.count += count;
        ({ count } = newItem)
        return newItem
      }
      ({ count } = item)

      return item
    })
    count = 0
    const newSmsPrev = smsPrev.map((item, index) => {
      const newItem = cloneDeep(item)
      if (index > 0) {
        newItem.count += count;
        ({ count } = newItem)
        return newItem
      }
      ({ count } = item)

      return item
    })

    count = 0
    const newSkipTracing = skipTracing.map((item, index) => {
      const newItem = cloneDeep(item)
      if (index > 0) {
        newItem.count += count;
        ({ count } = newItem)
        return newItem
      }
      ({ count } = item)

      return item
    })
    count = 0
    const newSkipTracingPrev = skipTracingPrev.map((item, index) => {
      const newItem = cloneDeep(item)
      if (index > 0) {
        newItem.count += count;
        ({ count } = newItem)
        return newItem
      }
      ({ count } = item)

      return item
    })

    return (
      <Row>
        <Col xs={12} lg={6} className="rechart-box">
          <Summary
            title="Properties Added"
            count={
              newProperty.length && newProperty[newProperty.length - 1].count
            }
            prevCount={
              newPropertyPrev.length && newPropertyPrev[newPropertyPrev.length - 1].count
            }
            period={period}
            prevPeriod={prevPeriod}
          />
          <ContainerRow className="rechart-container">
            <Chart property={newProperty} prevProperty={newPropertyPrev} title="Properties Added" />
          </ContainerRow>
        </Col>
        <Col xs={12} lg={6} className="rechart-box">
          <Summary
            title="Mailers Sent"
            count={
              newMail.length && newMail[newMail.length - 1].count
            }
            prevCount={
              newMailPrev.length && newMailPrev[newMailPrev.length - 1].count
            }
            period={period}
            prevPeriod={prevPeriod}
          />
          <ContainerRow className="rechart-container">
            <Chart property={newMail} prevProperty={newMailPrev} title="Mailers Sent" />
          </ContainerRow>
        </Col>
        <Col xs={12} lg={6} className="rechart-box">
          <Summary
            title="SMS Sent"
            count={
              newSms.length && newSms[newSms.length - 1].count
            }
            prevCount={
              newSmsPrev.length && newSmsPrev[newSmsPrev.length - 1].count
            }
            period={period}
            prevPeriod={prevPeriod}
          />
          <ContainerRow className="rechart-container">
            <Chart property={newSms} prevProperty={newSmsPrev} title="SMS Sent" />
          </ContainerRow>
        </Col>
        <Col xs={12} lg={6} className="rechart-box">
          <Summary
            title="Skip Tracing"
            count={
              newSkipTracing.length && newSms[newSkipTracing.length - 1].count
            }
            prevCount={
              newSkipTracingPrev.length && newSkipTracingPrev[newSkipTracingPrev.length - 1].count
            }
            period={period}
            prevPeriod={prevPeriod}
          />
          <ContainerRow className="rechart-container">
            <Chart property={newSkipTracing} prevProperty={newSkipTracingPrev} title="Skip Tracing" />
          </ContainerRow>
        </Col>
        <Col xs={12} lg={6} className="rechart-box">
          <Summary
            title="Miles Driven"
            count={
              newDrivingRoute.length && newDrivingRoute[newDrivingRoute.length - 1].miles
            }
            prevCount={
              newDrivingRoutePrev.length
              && newDrivingRoutePrev[newDrivingRoutePrev.length - 1].miles
            }
            period={period}
            prevPeriod={prevPeriod}
            unit="mi"
          />
          <ContainerRow className="rechart-container">
            <Chart property={newDrivingRoute} prevProperty={newDrivingRoutePrev} title="Miles Driven" yField="miles" unit="mi" />
          </ContainerRow>
        </Col>
        <Col xs={12} lg={6} className="rechart-box">
          <Summary
            title="Time Driven"
            count={
              newDrivingRoute.length && newDrivingRoute[newDrivingRoute.length - 1].hours
            }
            prevCount={
              newDrivingRoutePrev.length
              && newDrivingRoutePrev[newDrivingRoutePrev.length - 1].hours
            }
            period={period}
            prevPeriod={prevPeriod}
            unit="mins"
          />
          <ContainerRow className="rechart-container">
            <Chart property={newDrivingRoute} prevProperty={newDrivingRoutePrev} title="Time Driven" yField="hours" unit="mins" />
          </ContainerRow>
        </Col>
      </Row>
    )
  }

  return null
}

const Charts = React.memo(KpiCharts, (prevProp, newProp) => {
  return isEqual(prevProp.kpiInfos, newProp.kpiInfos)
})

const KPIS = ({ initPropertyByDistance, getKpis, kpis }) => {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [prevStartDate, setPrevStartDate] = useState('')
  const [selectedTabIndex, setSelectedTabIndex] = useState(0)
  const [filter, setFilter] = useState({
    user: {
      id: 0,
      name: 'Everyone',
    },
    status: 'All Deals',
  })

  const setRangeType = (index) => {
    let start = ''
    let end = ''
    let prevStart = ''
    if (index === 0) {
      const currentDate = moment()
      start = currentDate.clone().startOf('isoWeek').format('YYYY-MM-DD')
      end = currentDate.clone().endOf('isoWeek').format('YYYY-MM-DD')
      prevStart = currentDate.clone().startOf('isoWeek').subtract(1, 'weeks').format('YYYY-MM-DD')
    } else if (index === 1) {
      start = moment().startOf('month').format('YYYY-MM-DD')
      end = moment().endOf('month').format('YYYY-MM-DD')
      prevStart = moment().startOf('month').subtract(1, 'month').format('YYYY-MM-DD')
    } else if (index === 2) {
      start = moment().startOf('year').format('YYYY-MM-DD')
      end = moment().endOf('year').format('YYYY-MM-DD')
      prevStart = moment().startOf('year').subtract(1, 'year').format('YYYY-MM-DD')
    }

    if (start && end) {
      setStartDate(start)
      setEndDate(end)
      setPrevStartDate(prevStart)

      getKpis({
        start,
        end,
        prev_start: prevStart,
        user_id: filter.user.id,
        property_status: [
          filter.status,
        ],
      })
    }
  }

  useEffect(() => {
    setRangeType(0)
    initPropertyByDistance()
  }, [])

  const kpiFilter = (status, user) => {
    setFilter({
      user,
      status,
    })

    getKpis({
      start: startDate,
      end: endDate,
      prev_start: prevStartDate,
      user_id: user.id,
      property_status: [
        status,
      ],
    })
  }

  const onSelectTab = (index) => {
    setRangeType(index)
    setSelectedTabIndex(index)
  }

  const { loading } = kpis

  return (
    <FullScreenContainer className="kpi-page">
      <ModalContent>
        <Form>
          <FormTitle title="Statistics" />
          <Tabs selectedTabClassName="selected-tab" onSelect={onSelectTab} defaultIndex={selectedTabIndex}>
            <TabList className="tab-container">
              <Tab className="tab">Week</Tab>
              <Tab className="tab">Month</Tab>
              <Tab className="tab">Year</Tab>
            </TabList>
            <TabPanel className="tab-panel">
              <FilterPanel
                status={filter.status}
                user={filter.user}
                setStatus={(status) => kpiFilter(status, filter.user)}
                setUser={(user) => kpiFilter(filter.status, user)}
              />
            </TabPanel>
            <TabPanel className="tab-panel">
              <FilterPanel
                status={filter.status}
                user={filter.user}
                setStatus={(status) => kpiFilter(status, filter.user)}
                setUser={(user) => kpiFilter(filter.status, user)}
              />
            </TabPanel>
            <TabPanel className="tab-panel">
              <FilterPanel
                status={filter.status}
                user={filter.user}
                setStatus={(status) => kpiFilter(status, filter.user)}
                setUser={(user) => kpiFilter(filter.status, user)}
              />
            </TabPanel>
          </Tabs>
        </Form>
      </ModalContent>
      <ContainerRow className="kpi-chart-container">
        {
          loading && <div style={{ marginTop: '70px' }}><LoadingActivity /></div>
        }
        <Charts kpiInfos={kpis} />
      </ContainerRow>
    </FullScreenContainer>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(KPIS)
