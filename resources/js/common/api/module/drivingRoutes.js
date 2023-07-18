import httpClient from '../httpClient';

export const getDrivingRoutesList = ({ pageNumber, params }) => {
  return httpClient.get(`/drivingRoute/${pageNumber}`, { params });
};
export const deleteDrivingRouteApi = ({ id }) => {
  return httpClient.delete(`/drivingRoute/delete/${id}`);
};
export const createDrivingRouteApi = ({ payload }) => {
  return httpClient.post('/drivingRoute/create', payload.data || {});
};
