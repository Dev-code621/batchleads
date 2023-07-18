import React from 'react'
import ReactDOM from 'react-dom'
import { fromJS } from 'immutable'
import { createBrowserHistory as createHistory } from 'history'
import { syncHistoryWithStore } from 'react-router-redux'
import axios from 'axios';
import TagManager from 'react-gtm-module'
import Bugsnag from '@bugsnag/js'
import BugsnagPluginReact from '@bugsnag/plugin-react'

import Root from './Root'
import configureStore from './redux/configureStore'
// import registerServiceWorker from './registerServiceWorker'

let initialState = {}

// rehydrate initialState for JS app
if (window.__INITIAL_STATE__) {
  initialState = window.__INITIAL_STATE__

  // Transform into Immutable.js collections,
  // but leave top level keys untouched for Redux
  Object
    .keys(initialState)
    .forEach((key) => {
      initialState[key] = fromJS(initialState[key])
    })
}

const basePath = __CONFIG__.APP_URL

const hashHistory = createHistory({ basename: basePath })

const { store, persistor } = configureStore(initialState, hashHistory)

const history = syncHistoryWithStore(hashHistory, store)

const accessToken = localStorage.getItem('accessToken')
if (accessToken) {
  axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
}

const tagManagerArgs = {
  gtmId: __CONFIG__.GTM_ID,
}
if (__CONFIG__.GTM_AUTH) {
  tagManagerArgs.auth = __CONFIG__.GTM_AUTH
}
if (__CONFIG__.GTM_PREVIEW) {
  tagManagerArgs.preview = __CONFIG__.GTM_PREVIEW
}
TagManager.initialize(tagManagerArgs)

Bugsnag.start({
  apiKey: '423ffd6372fdabca76efbfb725f0bba7',
  plugins: [new BugsnagPluginReact()],
})
const ErrorBoundary = Bugsnag.getPlugin('react')
  .createErrorBoundary(React)

// Render the React application to the DOM
// Root component is to bootstrap Provider, Router and DevTools
ReactDOM.render(
  <ErrorBoundary>
    <Root history={history} store={store} persistor={persistor} />
  </ErrorBoundary>,
  document.getElementById('app-container')
)

// registerServiceWorker()
