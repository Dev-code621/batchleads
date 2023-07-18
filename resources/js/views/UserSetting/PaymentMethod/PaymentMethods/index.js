import React, { useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import get from 'lodash.get'
import Form from '~common/components/Form'
import PaymentCard from '~common/components/PaymentCard'
import FormTitle from '~components/Layout/Dashboard/FormTitle'
import ContainerRow from '~components/ContainerRow'
import LoadingActivity from '~components/LoadingActivity'
import ScrollContainer from '~components/Layout/Dashboard/ScrollContainer'
import './layout/style.scss'

const PaymentMethods = withRouter(({
  history, user, removeCard, credit, getUser, initRemoveCard, setDefaultCard, initSetDefaultCard,
}) => {
  const loading = get(credit.removeCardResult, 'loading')
  const success = get(credit.removeCardResult, 'success')

  const loadingSetDefaultCard = get(credit.setDefaultCardResult, 'loading')
  const successSetDefaultCard = get(credit.setDefaultCardResult, 'success')

  useEffect(() => {
    if (success) {
      initRemoveCard()
      getUser(user)
    }
  }, [success])

  useEffect(() => {
    if (successSetDefaultCard) {
      initSetDefaultCard()
      getUser(user)
    }
  }, [successSetDefaultCard])

  const paymentMethods = user.result.user ? get(user.result.user.user, 'payment_methods') : null
  const defaultPaymentMethod = user.result.user ? get(user.result.user.user, 'payment_method') : null

  return (
    <Form className="payment-method-page">
      <FormTitle title="Payment Method" hasAdd onAdd={() => history.push('/dashboard/settings/paymentmethod/add')} hasBack history={history} />
      <ScrollContainer>
        {
          paymentMethods && paymentMethods.map((paymentMethod) => {
            const isDefault = paymentMethod.id === defaultPaymentMethod
            return (
              <ContainerRow>
                <PaymentCard
                  paymentMethod={paymentMethod}
                  isDefault={isDefault}
                  setDefaultCard={setDefaultCard}
                  removeCard={removeCard}
                />
              </ContainerRow>
            )
          })
        }
        <ContainerRow>
          {
            (loading || loadingSetDefaultCard) && <LoadingActivity />
          }
        </ContainerRow>
      </ScrollContainer>
    </Form>
  )
})

export default PaymentMethods
