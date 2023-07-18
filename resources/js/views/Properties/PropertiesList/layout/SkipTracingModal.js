import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { toast } from '~common/helper'
import BaseModal from '~components/BaseModal'
import Button from '~components/Button'

import { checkCreditBalance } from '../../../../common/api/module/credit'
import {
  isAllPropertySelectedSelector,
  listFilterSelector,
  searchSelector,
  selectedPropertiesIdsSelector,
  skipTracingMultiResultSelector,
  unSelectedPropertiesIdsSelector,
} from '~redux/selectors/propertySelector';
import { skipTracingMulti } from '~redux/modules/property'

export default ({
  toggle, onClose, gotoBuyCredit, onFinish,
}) => {
  if (!toggle) return null
  const dispatch = useDispatch();
  const isAll = useSelector(isAllPropertySelectedSelector)
  const filter = useSelector(listFilterSelector)
  const search = useSelector(searchSelector)
  const propertyIds = useSelector(selectedPropertiesIdsSelector)
  const excludedPropertyIds = useSelector(unSelectedPropertiesIdsSelector)
  const { loading, error, success } = useSelector(skipTracingMultiResultSelector)
  const [balanceLoading, setBalanceLoading] = useState(false)
  const [balance, setBalance] = useState({})
  const cFilter = {
    search,
    folder_id: filter.folder.id,
    status: filter.status === 'All Deals' ? null : filter.status,
    user_id: filter.user.id,
    skip_traced: filter.skipTracing.id,
    owner_occupied: filter.owner.id,
    tags: filter.tags,
    created_at: filter.created_at,
  }
  const checkCredit = () => {
    setBalanceLoading(true)
    checkCreditBalance({
      type: 'skip_tracing',
      property_ids: isAll ? null : propertyIds,
      excluded_property_ids: excludedPropertyIds,
      filter: cFilter,
    })
      .then((res) => {
        setBalanceLoading(false)
        setBalance(res.data.data)
      })
      .catch((err) => {
        setBalanceLoading(false)
        toast.error(err.message)
      })
  }

  useEffect(() => {
    if (toggle) {
      checkCredit()
    }
  }, [toggle])

  useEffect(() => {
    if (!loading && success) {
      onFinish()
      toast.success('Updated properties.')
    }
    if (error && !loading) {
      toast.error(error.message)
      onClose()
    }
  }, [loading, error, success])

  const onContinue = () => {
    if (!balance.balance) {
      gotoBuyCredit()
    } else {
      dispatch(skipTracingMulti(isAll, propertyIds, cFilter, excludedPropertyIds))
    }
  }

  const footer = (
    <div className="footer-wrapper" style={{ justifyContent: 'flex-end' }}>
      <Button
        onClick={onContinue}
        label={balanceLoading ? 'Continue' : `${balance.balance ? 'Continue' : 'Purchase'}`}
        style={{ width: 120, height: 40 }}
      />
    </div>
  )

  return (
    <BaseModal
      toggle={toggle}
      onClose={onClose}
      title="BatchDriven Skip Tracing"
      footer={footer}
      loading={balanceLoading || loading}
      preventClose={balanceLoading || loading}
    >
      <div className="skip-tracing-modal-body">
        <div
          className="skip-tracing-modal-content"
        >
          {balanceLoading && (<div>Checking your credit balance....</div>)}
          {!balanceLoading && balance.balance && (
            <div>
              {`Your available credit balance is ${balance.current_credit_count}. You are about to skip trace ${propertyIds.length} records.
              This action will consume, at most, ${balance.required_credit_count} credits. Would you like to continue?`}
            </div>
          )}
          {!balanceLoading && !balance.balance && (
            <div>
              {`Your available credit balance is ${balance.current_credit_count}.
              This search will consume, at most, ${balance.required_credit_count} credits. Please purchase more credits.`}
            </div>
          )}
        </div>
      </div>
    </BaseModal>
  )
}
