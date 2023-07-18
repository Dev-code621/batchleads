import React, { useState } from 'react'
import { AiFillEdit } from 'react-icons/ai'
import Input from '~components/Input'

export default ({ sendMessage, onFocus }) => {
  const [messageToSend, setMessageToSend] = useState('')

  const send = () => {
    sendMessage(messageToSend)
    setMessageToSend('')
  }

  const onKeyDown = (e) => {
    if (e.keyCode === 13) {
      send()
    }
  }

  return (
    <React.Fragment>
      <Input
        noIcon
        placeholder="Add Notes"
        value={
          messageToSend
        }
        onChange={
          (e) => setMessageToSend(e.target.value)
        }
        onKeyDown={
          onKeyDown
        }
        onFocus={onFocus}
      />
      <div
        className="send-button"
        onKeyPress={() => {}}
        role="button"
        tabIndex="0"
        onClick={send}
      >
        <AiFillEdit className="send-icon" />
      </div>
    </React.Fragment>
  )
}
