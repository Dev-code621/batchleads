import axios from 'axios'

const API_ENDPOINT = __CONFIG__.API_ENDPOINT_URL
axios.defaults.baseURL = API_ENDPOINT
axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.headers.common.Accept = 'application/json'

axios.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response) {
    // const { data, status } = error.response
    // console.log(data)
    // console.log(statusText)
    // if (status === 433) {
    //   console.log(data)
    // }
    throw error
  }
  if (axios.isCancel(error)) {
    return;
  }

  alert(error.message)
});

module.exports = axios
