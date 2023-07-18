import React from 'react'
import { withRouter } from 'react-router-dom'
import get from 'lodash.get'
import Form from '~common/components/Form'
import FormTitle from '~components/Layout/Dashboard/FormTitle'
import ContainerRow from '~components/ContainerRow'
import Button from '~components/Button'
import NavItem from '~components/NavItem'
import CreditInfo from './layout/CreditInfo'
import './layout/style.scss'

const Credit = withRouter(({
  history, user,
}) => {
  const setting = user.result.user
    ? get(user.result.user.user, 'auto_recharge_setting')
    : null

  const gotoToHistory = () => {
    history.push('/dashboard/settings/credit/transaction')
  }

  const gotoToBuy = () => {
    history.push('/dashboard/settings/credit/buy')
  }

  const credit = user.result.user
    ? get(user.result.user.user, 'credit')
    : null

  return (
    <Form className="credit-page">
      <FormTitle title="Credits" hasBack history={history} />
      <CreditInfo history={history} balance={credit && credit.ballance} />
      <ContainerRow>
        <Button
          label="Buy Credit"
          width="90%"
          onClick={gotoToBuy}
        />
      </ContainerRow>
      <ContainerRow>
        <NavItem
          title="Auto-Recharge"
          description={`${setting && setting.status === 1 ? 'ON' : 'OFF'}`}
          onClick={() => history.push('/dashboard/settings/autorecharge')}
        />
      </ContainerRow>
      <ContainerRow>
        <Button
          label="Transaction History"
          width="90%"
          onClick={gotoToHistory}
          color="white"
        />
      </ContainerRow>
    </Form>
  )
})

export default Credit
