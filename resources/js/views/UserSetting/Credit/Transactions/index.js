import React, { useEffect } from 'react'
import get from 'lodash.get'
import InfiniteScroll from '~components/Layout/Dashboard/InfiniteScroll'
import Form from '~components/Form'
import FormTitle from '~components/Layout/Dashboard/FormTitle'
import Transaction from './layout/Transaction'
import './layout/style.scss'

export default (props) => {
  const {
    history,
    getTransaction,
    user,
  } = props

  const transaction = get(user, 'transaction')

  const transactions = get(transaction, 'data')
  const loading = get(transaction, 'loading')
  const total = transaction ? transaction.total : 0
  const page = transaction ? transaction.page : 0
  const count = transaction ? transaction.count : 0
  const countPerPage = transaction ? transaction.count_per_page : 0

  const dataLength = count + (Number(page) - 1) * countPerPage

  const fetchData = () => {
    getTransaction(Number(page) + 1)
  }

  const refresh = () => {
    getTransaction(1)
  }

  useEffect(() => {
    getTransaction(1)
  }, [])

  return (
    <Form className="transaction-list">
      <FormTitle title="Transactions" hasRefresh refresh={refresh} loading={loading} hasBack history={history} />
      <InfiniteScroll
        dataLength={dataLength}
        next={fetchData}
        hasMore={total && total > countPerPage * Number(page)}
        refresh={refresh}
        noItemsMessage="No Transactions"
        loading={loading}
      >
        {transactions && transactions.map((item) => (
          <Transaction
            transaction={item}
            key={item.id}
          />
        ))}
      </InfiniteScroll>
    </Form>
  )
}
