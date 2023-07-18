import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import Favicon from 'react-favicon'
import ScrollUpButton from 'react-scroll-up-button'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { LoadScript } from '@react-google-maps/api'
import { CookiesProvider } from 'react-cookie';

import { PersistGate } from 'redux-persist/integration/react'
import ScrollToTop from '~components/ScrollToTop'
import FavIcon from '../assets/icons/favicon.ico'
import { ThemeProvider } from '~common/theme-context'

import Routes from './routes'

const stripePromise = loadStripe(__CONFIG__.STRIPE_KEY);
const libraries = ['places', 'drawing']

export default class Root extends Component {
  get content() {
    const { history } = this.props

    return (
      <Fragment>
        <CookiesProvider>
          <ThemeProvider>
            <LoadScript
              id="script-loader"
              googleMapsApiKey={__CONFIG__.GOOGLE_MAP_API_KEY}
              libraries={libraries}
            >
              <Favicon url={FavIcon} />
              <ScrollUpButton ContainerClassName="scroll-up-container" />
              <ToastContainer />
              <Router history={history}>
                <ScrollToTop>
                  <Routes />
                </ScrollToTop>
              </Router>
            </LoadScript>
          </ThemeProvider>
        </CookiesProvider>
      </Fragment>
    )
  }

  render() {
    const { store, persistor } = this.props

    return (
      <Elements stripe={stripePromise}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            {this.content}
          </PersistGate>
        </Provider>
      </Elements>
    )
  }
}

Root.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.element.isRequired,
}
