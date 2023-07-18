import React from 'react'
import Button from '~components/Button'
import LoadingActivity from '~components/LoadingActivity'

export default ({
  id, price, credit_amount: amount, buy, loading,
}) => (
  <div className="list-item credit-package">
    <div className="package-price">{`$ ${price}`}</div>
    <div className="package-amount">{`${amount} credits`}</div>
    {
      loading ? <LoadingActivity /> : (
        <Button
          label="Buy"
          width="70%"
          onClick={() => buy(id)}
          style={{ height: 40 }}
        />
      )
    }
  </div>
)
