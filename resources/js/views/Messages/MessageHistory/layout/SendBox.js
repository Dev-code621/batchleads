import React, { useState } from 'react'
import Input from '~components/Input'
import RoundIconButton from './RoundIconButton'

export default ({ sendMessage, onFocus }) => {
  const [messageToSend, setMessageToSend] = useState('')

  const send = () => {
    if (messageToSend) {
      sendMessage(messageToSend)
      setMessageToSend('')
    }
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
        placeholder="Type a message to send"
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
      <RoundIconButton className="send-button" onClick={send} />
    </React.Fragment>
  )
}
