import { createSelector } from 'reselect'

const drivingRoutesDataSelector = (state) => state.drivingRoutes

const resultSelector = createSelector(
  drivingRoutesDataSelector,
  (payload) => {
    return {
      countPerPage: payload.get('count_per_page'),
      total: payload.get('total'),
      count: payload.get('count'),
      page: payload.get('page'),
      loading: payload.get('loading'),
      drivingRoutesData: payload.get('drivingRoutesData'),
      miles: payload.get('miles'),
      deleteResult: payload.get('deleteResult'),
      createResult: payload.get('createResult'),
    }
  }
)

const drivingRouteSelector = createSelector(
  drivingRoutesDataSelector,
  (payload) => {
    return payload.get('drivingRoute') ? payload.get('drivingRoute').toJS() : null
  }
)

export const homeDrivingRouteSelector = createSelector(
  drivingRoutesDataSelector,
  (payload) => {
    const items = payload.get('homeItems') || [];
    return items.map((item) => ({
      gps: JSON.parse(item.gps).map((route) => ({ lat: route.latitude, lng: route.longitude })),
      created_at: item.created_at,
    }));
  }
)

export const drivingRouterFilterSelector = createSelector(
  drivingRoutesDataSelector,
  (payload) => payload.get('filter'),
)

export const drivingRoutesSelector = (state) => ({
  result: resultSelector(state),
  drivingRoute: drivingRouteSelector(state),
})
