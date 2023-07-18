import { createAction, handleActions } from 'redux-actions'
import { Map } from 'immutable'

const GET_DRIVING_ROUTES = 'GET_DRIVING_ROUTES'
const GET_DRIVING_ROUTES_RESULT = 'GET_DRIVING_ROUTES_RESULT'
const INIT_DRIVING_ROUTES = 'INIT_DRIVING_ROUTES'
const SET_DRIVING_ROUTE = 'SET_DRIVING_ROUTE'
const INIT_DRIVING_ROUTE = 'INIT_DRIVING_ROUTE'
const INIT_DELETE_RESULT = 'INIT_DELETE_RESULT'
const DELETE_DRIVING_ROUTE = 'DELETE_DRIVING_ROUTE'
const DELETE_DRIVING_ROUTE_RESULT = 'DELETE_DRIVING_ROUTE_RESULT'
const CREATE_DRIVING_ROUTE = 'CREATE_DRIVING_ROUTE'
const CREATE_DRIVING_ROUTE_RESULT = 'CREATE_DRIVING_ROUTE_RESULT'
const UPDATE_DRIVING_ROUTE_FILTER = 'UPDATE_DRIVING_ROUTE_FILTER'

const GET_HOME_DRIVING_ROUTES = 'GET_HOME_DRIVING_ROUTES'
const GET_HOME_DRIVING_ROUTES_RESULT = 'GET_HOME_DRIVING_ROUTES_RESULT'

export const constants = {
  GET_DRIVING_ROUTES,
  GET_DRIVING_ROUTES_RESULT,
  INIT_DRIVING_ROUTES,
  SET_DRIVING_ROUTE,
  INIT_DRIVING_ROUTE,
  INIT_DELETE_RESULT,
  DELETE_DRIVING_ROUTE,
  DELETE_DRIVING_ROUTE_RESULT,
  CREATE_DRIVING_ROUTE,
  CREATE_DRIVING_ROUTE_RESULT,
  UPDATE_DRIVING_ROUTE_FILTER,
  GET_HOME_DRIVING_ROUTES,
  GET_HOME_DRIVING_ROUTES_RESULT,
}

// ------------------------------------
// Actions
// ------------------------------------
export const getDrivingRoutes = createAction(GET_DRIVING_ROUTES, (pageNumber, params) => ({
  pageNumber, params,
}))
export const gerDrivingRoutesResult = createAction(
  GET_DRIVING_ROUTES_RESULT,
)
export const getHomeDrivingRoutes = createAction(GET_HOME_DRIVING_ROUTES, (pageNumber, params) => ({
  pageNumber, params,
}))
export const getHomeDrivingRoutesResult = createAction(
  GET_HOME_DRIVING_ROUTES_RESULT,
)
export const initDrivingRoutes = createAction(INIT_DRIVING_ROUTES, () => ({}))

export const initDrivingRoute = createAction(INIT_DRIVING_ROUTE, () => ({}))
export const setDrivingRoute = createAction(SET_DRIVING_ROUTE, (data) => ({
  data,
}))
export const initDeleteResult = createAction(INIT_DELETE_RESULT)
export const deleteDrivingRoute = createAction(DELETE_DRIVING_ROUTE, (id) => ({ id }))
export const deleteDrivingRouteResult = createAction(DELETE_DRIVING_ROUTE_RESULT)
export const createDrivingRoute = createAction(CREATE_DRIVING_ROUTE, (data) => ({ data }))
export const createDrivingRouteResult = createAction(CREATE_DRIVING_ROUTE_RESULT)
export const updateDrivingRouteFilter = createAction(UPDATE_DRIVING_ROUTE_FILTER)

export const actions = {
  getDrivingRoutes,
  gerDrivingRoutesResult,
  initDrivingRoutes,
  setDrivingRoute,
  initDrivingRoute,
  initDeleteResult,
  deleteDrivingRoute,
  deleteDrivingRouteResult,
  createDrivingRoute,
  createDrivingRouteResult,
  updateDrivingRouteFilter,
  getHomeDrivingRoutes,
  getHomeDrivingRoutesResult,
}

export const reducers = {
  [GET_DRIVING_ROUTES]: (state) => state.merge({
    loading: true,
  }),
  [GET_DRIVING_ROUTES_RESULT]: (state, { payload }) => {
    const drivingRoutesData = state.get('drivingRoutesData');
    const result = payload.drivingRoutesData ? payload.drivingRoutesData : null;
    if (result) {
      const { page } = payload
      if (Number(page) === 1) {
        return state.merge({ ...payload })
          .set('drivingRoutesData', result)
      }
      return state.merge({
        ...payload,
        drivingRoutesData: drivingRoutesData ? drivingRoutesData.concat(result) : result,
      })
    }

    return state.merge({
      ...payload,
    })
  },
  [GET_HOME_DRIVING_ROUTES_RESULT]: (state, { payload }) => {
    if (payload.drivingRoutesData && payload.drivingRoutesData.length > 0) {
      return state.setIn(['homeItems'], payload.drivingRoutesData);
    }
    return state;
  },
  [INIT_DRIVING_ROUTES]: (state) => state.merge({
    error: null,
    success: false,
    status: 200,
    loading: false,
    total: 0,
    page: 0,
    count: 0,
    count_per_page: 0,
    drivingRoutesData: [],
    miles: 0,
    deleteResult: {
      loading: false,
      success: false,
      error: null,
    },
    createResult: {
      loading: false,
      success: false,
      error: null,
    },
  }),
  [SET_DRIVING_ROUTE]: (state, { payload }) => state.merge({
    drivingRoute: payload.data,
  }),
  [INIT_DRIVING_ROUTE]: (state) => state.merge({
    drivingRoute: null,
  }),
  [INIT_DELETE_RESULT]: (state) => state.setIn(['deleteResult'], {
    loading: false,
    success: false,
    error: null,
  }),
  [DELETE_DRIVING_ROUTE]: (state) => state.setIn(['deleteResult'], {
    loading: true,
    success: false,
    error: null,
  }),
  [DELETE_DRIVING_ROUTE_RESULT]: (state, { payload }) => state.setIn(['deleteResult'], {
    ...payload,
  }),
  [CREATE_DRIVING_ROUTE]: (state) => state.setIn(['createResult'], {
    loading: true,
    success: false,
    error: null,
  }),
  [CREATE_DRIVING_ROUTE_RESULT]: (state, { payload }) => state.setIn(['createResult'], {
    ...payload,
  }),
  [UPDATE_DRIVING_ROUTE_FILTER]: (state, { payload }) => state.setIn(['filter'], { ...payload }),
}

export const initialState = () => Map({
  error: null,
  success: false,
  status: 200,
  loading: false,
  total: 0,
  page: 0,
  count: 0,
  count_per_page: 0,
  drivingRoutesData: [],
  homeItems: [],
  miles: 0,
  drivingRoute: null,
  deleteResult: {
    loading: false,
    loaded: false,
    error: null,
  },
  createResult: {
    loading: false,
    loaded: false,
    error: null,
  },
  filter: {
    created_at: '',
    user: { id: null, name: 'Everyone' },
    hasProperty: { id: null, name: 'Everything' },
    milesDriven: { id: null, name: 'Everything' },
    routeType: { id: null, name: 'Everything' },
  },
})

export default handleActions(reducers, initialState());
