import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { signatureSelector } from '~redux/selectors/signatureSelector'
import { actions as signatureActions } from '~redux/modules/signature'
import SelectItem from '~components/CollapsibleSelector/SelectItem'
import Collapsable from '~components/Collapsable'

const mapStateToProps = (state) => ({
  signatures: signatureSelector(state),
})

const mapDispatchToProps = {
  ...signatureActions,
}

const SignatureSelector = ({
  selectedSignature, onSelect, getSignatures, signatures,
}) => {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    getSignatures()
  }, [])
  const onSelectItem = (item) => {
    onSelect(item);
    setOpen(false);
  }

  return (
    <Collapsable trigger={selectedSignature ? selectedSignature.label : 'Select a Signature'} open={open} setOpenStatus={(flag) => setOpen(flag)}>
      {signatures.result && signatures.result.map((style) => {
        const signatureId = style.get('id')
        const label = style.get('label')
        return (
          <SelectItem
            item={label}
            selected={selectedSignature && signatureId === selectedSignature.id}
            onSelect={() => onSelectItem(style)}
            key={signatureId}
          />
        )
      })}
    </Collapsable>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(SignatureSelector)
