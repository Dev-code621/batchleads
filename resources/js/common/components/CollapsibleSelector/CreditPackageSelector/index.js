import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import Collapsible from '~components/Collapsable'
import SelectItem from '../SelectItem'
import { creditSelector } from '~redux/selectors/creditSelector'
import { actions as creditActions } from '~redux/modules/credit'

const mapStateToProps = (state) => ({
  credit: creditSelector(state),
})

const mapDispatchToProps = {
  ...creditActions,
}

const CreditPackageSelector = ({
  selectedCreditPackage,
  onSelect,
  credit,
  getCreditPackages,
  amount,
}) => {
  useEffect(() => {
    getCreditPackages()
  }, [])

  const { packages } = credit
  const { data } = packages
  const [open, setOpen] = useState(false);
  const onSelectItem = (item) => {
    onSelect(item);
    setOpen(false);
  }

  let trigger = null
  if (selectedCreditPackage) {
    trigger = selectedCreditPackage.credit_amount ? `${selectedCreditPackage.credit_amount} Credits` : ''
  }
  data.map((item) => {
    if (item.credit_amount === amount) {
      trigger = `${item.credit_amount} Credits`
    }
    return 1
  })

  return (
    <Collapsible trigger={trigger} open={open} setOpenStatus={(flag) => setOpen(flag)}>
      {
        data && data.map((item) => (
          <SelectItem
            item={`${item.credit_amount} Credits ($${item.price})`}
            selected={selectedCreditPackage && selectedCreditPackage.id === item.id}
            onSelect={() => onSelectItem(item)}
            key={item.id}
          />
        ))
      }
    </Collapsible>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(CreditPackageSelector)
