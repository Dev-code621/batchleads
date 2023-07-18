import qs from 'querystring'
import httpClient from '../httpClient'

export const getCreditPackages = () => {
  return httpClient.get('/credit/package')
}

export const chargeCredit = ({ packageId }) => {
  return httpClient.post('/credit/charge', qs.stringify({ package_id: packageId }))
}

export const subscribe = ({
  planId,
  stripeToken,
  customerName,
  promoCode,
  addOns,
}) => {
  const data = {
    stripe_plan: planId,
    stripe_token: stripeToken,
    customer_name: customerName,
    promo_code: promoCode,
    add_ons: addOns,
  }
  return httpClient.post('/stripe/subscribe', data)
}

export const addCard = ({ stripeToken }) => {
  return httpClient.post('/stripe/addCard', qs.stringify({ stripe_token: stripeToken }))
}

export const getPlans = ({ period }) => {
  let yearlyOnly = 0
  if (period === 'year') {
    yearlyOnly = 1
  }
  return httpClient.get(`/stripe/subscribe/getPlans?yearly_only=${yearlyOnly}`)
}

export const getAddons = () => {
  return httpClient.get('/stripe/addons')
}

export const subscribeUpdate = ({ planId }) => {
  return httpClient.post('/stripe/subscribe/change', qs.stringify({ stripe_plan: planId }))
}

export const removeCard = ({ cardId }) => {
  return httpClient.get(`/stripe/removeCard?card_id=${cardId}`)
}

export const setDefaultCard = ({ cardId }) => {
  return httpClient.get(`/stripe/setDefaultCard?card_id=${cardId}`)
}

export const checkCreditBalance = (data) => {
  return httpClient.post('/credit/transaction/checkBalance', data)
}

export const endUserTrial = () => {
  return httpClient.get('/stripe/subscribe/endTrial')
}

export const getUpcomingInvoiceApi = () => {
  return httpClient.get('/stripe/getUpcomingInvoice')
}
