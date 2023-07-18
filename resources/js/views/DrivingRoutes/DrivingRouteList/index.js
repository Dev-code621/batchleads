import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import Immutable from 'immutable'
import moment from 'moment';
import { toast } from '~common/helper'
import Form from '~components/Form'
import FormTitle from '~components/Layout/Dashboard/FormTitle'
import InfiniteScroll from '~components/Layout/Dashboard/InfiniteScroll'
import DrivingRoute from './DrivingRoute'
import { FilterModal } from './layout/FilterModal'
import './layout/style.scss'

import { drivingRouterFilterSelector } from '~redux/selectors/drivingRoutesSelector';

export default ({
  getDrivingRoutes, drivingRoutes, setDrivingRoute, deleteDrivingRoute, initDeleteResult,
}) => {
  const { result, drivingRoute } = drivingRoutes
  const [showFilter, setShowFilter] = useState(false);
  const filter = useSelector(drivingRouterFilterSelector)
  const {
    drivingRoutesData,
    total,
    page,
    countPerPage,
    count,
    loading,
    miles,
    deleteResult,
  } = result

  let drivingRouteList = drivingRoutesData
  if (drivingRoutesData instanceof Immutable.List) {
    drivingRouteList = drivingRoutesData.toJS()
  }

  const dataLength = count + (Number(page) - 1) * countPerPage

  const loadList = (searchPage = 1) => {
    getDrivingRoutes(searchPage, {
      date: filter.created_at ? moment(filter.created_at).format('yyyy-MM-DD') : null,
      user_id: filter.user.id || null,
      miles: filter.milesDriven.id || null,
      is_properties: filter.hasProperty.id || null,
      route_type: filter.routeType.id || null,
    })
  }

  useEffect(() => {
    if (dataLength === 0) {
      loadList()
    }
  }, [])

  useEffect(() => {
    loadList()
  }, [filter]);

  useEffect(() => {
    if (deleteResult.success) {
      toast.success('Successfully deleted your route.')
      initDeleteResult();
      loadList();
    }
    if (deleteResult.error) {
      initDeleteResult();
      toast.error('Failed to delete your route.')
    }
  }, [deleteResult])

  const fetchData = () => {
    loadList(Number(page) + 1)
  }

  const refresh = () => {
    loadList(1)
  }

  const onClickDelete = (id) => {
    const confirmDelete = confirm('Are you sure to delete this driving route?');
    if (confirmDelete) {
      deleteDrivingRoute(id)
    }
  }
  return (
    <Form className="driving-routes-page">
      <FormTitle title="Driving Routes" hasRefresh refresh={refresh} loading={loading} hasFilter onClickFilter={() => setShowFilter(true)} />
      <div className="route-info-container">
        <div className="route-info-container__col">
          <p className="recent-text">
            Recent 30 days:
          </p>
          <div className="route-info">
            {miles}
            <span> miles</span>
          </div>
        </div>
        <div className="route-info">
          {total}
          <span> trips</span>
        </div>
      </div>
      <InfiniteScroll
        dataLength={dataLength}
        next={fetchData}
        hasMore={total && total > countPerPage * page}
        refresh={refresh}
        noItemsMessage="No Records"
        loading={loading}
      >
        {
          dataLength !== 0 && drivingRouteList && drivingRouteList.map((item) => (
            <DrivingRoute
              {...item}
              key={item.id}
              onClick={() => setDrivingRoute(item)}
              selected={drivingRoute && drivingRoute.id === item.id}
              onDelete={() => onClickDelete(item.id)}
            />
          ))
        }
      </InfiniteScroll>
      <FilterModal toggle={showFilter} onClose={() => setShowFilter(false)} />
    </Form>
  )
}
