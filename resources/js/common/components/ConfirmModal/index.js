import React from 'react'
import BaseModal from '~components/BaseModal'
import Button from '~components/Button'

export default ({
  title,
  message,
  onOK,
  onCancel,
  OKLabel,
  onOther,
  otherLabel,
  show,
}) => {
  const footer = (
    <div className="footer-wrapper" style={{ justifyContent: 'flex-end' }}>
      <Button
        onClick={onOK}
        label={OKLabel || 'OK'}
        style={{ width: 120, height: 40 }}
      />
      {
        onOther && (
          <Button
            onClick={onOther}
            label={otherLabel}
            style={{ width: 120, height: 40 }}
          />
        )
      }
      <Button
        color="white"
        onClick={onCancel}
        label="Cancel"
        style={{ width: 120, height: 40 }}
      />
    </div>
  )

  return (
    <BaseModal
      toggle={show}
      onClose={onCancel}
      title={title}
      footer={footer}
      loading={false}
      preventClose={false}
    >
      <div dangerouslySetInnerHTML={{ __html: message }} />
    </BaseModal>
  )
}
