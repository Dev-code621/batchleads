import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import get from 'lodash.get'
import Switch from 'react-switch'
import Form from '~common/components/Form'
import FormTitle from '~components/Layout/Dashboard/FormTitle'
import ScrollContainer from '~components/Layout/Dashboard/ScrollContainer'
import ContainerRow from '~components/ContainerRow'
import CreditPackageSelector from '~components/CollapsibleSelector/CreditPackageSelector'
import Button from '~components/Button'
import LoadingActivity from '~components/LoadingActivity'
import ErrorMessage from '~components/ErrorMessage'
import { toast } from '~common/helper'
import './layout/style.scss'

const AutoRecharge = withRouter(
  ({
    history, user, updateAutoRecharge, initUpdateAutoRecharge, getUser,
  }) => {
    const setting = user.result.user
      ? get(user.result.user.user, 'auto_recharge_setting')
      : null
    const updateAutoRechargeResult = user.update_auto_recharge
    const loading = get(updateAutoRechargeResult, 'loading')
    const success = get(updateAutoRechargeResult, 'success')
    const error = get(updateAutoRechargeResult, 'error')

    const [enabled, setEnabled] = useState(false)
    const [threshold, setThreshold] = useState(null)
    const [amount, setAmount] = useState(null)
    const [errorThreshold, setErrorThreshold] = useState(null)
    const [errorCreditPackage, setErrorCreditPackage] = useState(null)

    useEffect(() => {
      initUpdateAutoRecharge()
      setEnabled(setting ? setting.status : false)
      setThreshold(setting ? setting.threshold : null)
      setAmount(setting ? setting.credit_package : null)
    }, [])

    useEffect(() => {
      if (success) {
        toast.success('Saved!')
        getUser(user)
      }
      initUpdateAutoRecharge()
    }, [success])

    useEffect(() => {
      if (error) {
        toast.error(error.message)
      }
      initUpdateAutoRecharge()
    }, [error])

    const onChangeStatus = () => {
      setEnabled(!enabled)
    }

    const onSave = () => {
      if (!threshold) {
        setErrorThreshold('Need to select value')
        return
      }
      if (!amount) {
        setErrorCreditPackage('Need to select value')
        return
      }
      if (enabled) {
        let creditAmount = threshold
        if (threshold.credit_amount) {
          creditAmount = threshold.credit_amount
        }
        updateAutoRecharge(enabled, creditAmount, amount.id)
      } else {
        updateAutoRecharge(enabled)
      }
    }

    const onSelectThreshold = (item) => {
      setErrorThreshold(null)
      setThreshold(item)
    }

    const onSelectAmount = (item) => {
      setErrorCreditPackage(null)
      setAmount(item)
    }

    return (
      <Form className="auto-recharge-setting-page">
        <FormTitle title="Auto Recharge" hasBack history={history} />
        <ScrollContainer>
          <ContainerRow className="auto-recharge-setting" title="Auto Recharge">
            <Switch
              onChange={onChangeStatus}
              checked={enabled}
              checkedIcon={false}
              uncheckedIcon={false}
              onColor="#3683bc"
            />
          </ContainerRow>
          {
            enabled ? (
              <React.Fragment>
                <ContainerRow title="Recharge when Balance is below">
                  <CreditPackageSelector
                    onSelect={onSelectThreshold}
                    amount={
                      (threshold && threshold.credit_amount) ? threshold.credit_amount : threshold
                    }
                    selectedCreditPackage={threshold}
                  />
                </ContainerRow>
                <ErrorMessage message={errorThreshold} />
                <ContainerRow title="Recharge Amount">
                  <CreditPackageSelector
                    onSelect={onSelectAmount}
                    selectedCreditPackage={amount}
                  />
                </ContainerRow>
                <ErrorMessage message={errorCreditPackage} />
              </React.Fragment>
            ) : null
          }
          <ContainerRow>
            {
            loading ? <LoadingActivity /> : (
              <Button
                label="SAVE"
                width="70%"
                height={48}
                onClick={onSave}
              />
            )
          }
          </ContainerRow>
        </ScrollContainer>
      </Form>
    )
  }
)

export default AutoRecharge
