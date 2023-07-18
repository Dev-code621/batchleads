import React, { memo } from 'react'
import { IoMdClose } from 'react-icons/io'
import Form from '~components/Form'
import Button from '~components/Button'

export default memo(({ length, onClose, onContinue }) => {
  return (
    <Form className="search-info-window">
      <div className="close-icon"><IoMdClose role="button" onClick={onClose} /></div>
      <div className="title">Save Properties</div>
      <div className="content">{`We've found ${length} properties.`}</div>
      <Button label="Continue" onClick={onContinue} />
    </Form>
  )
})
