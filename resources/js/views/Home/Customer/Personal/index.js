import React from 'react'
import Container from '../layout/Container'
import Input from '~components/Input'
import Button from '~components/Button'
import TextArea from '~components/TextArea'
import User from '~assets/icons/user.svg'

export default () => {
  return (
    <Container title="Removal Request">
      <form>
        <div className="bg-container">
          <div className="bg-1" />
          <div className="bg-2" />
          <div className="bg-3" />
        </div>
        <div className="form-description">
          Your personal privacy is our highest priority and we are happy
          accommodate your request to remove your personal information from our
          services.
          <br />
          We may need to reach out to you directly via email to verify
          your request and assure that it will be processed safely and
          accurately. Please check your email for correspondence over the next
          few days.
        </div>
        <div className="form-description">
          <Input
            type="text"
            placeholder="First Name*"
            width="100%"
            className="input"
            icon={User}
            height={35}
          />
          <Input
            type="text"
            placeholder="Last Name*"
            width="100%"
            className="input"
            icon={User}
            height={35}
          />
          <Input
            type="email"
            placeholder="Email Address*"
            width="100%"
            className="input"
            height={35}
          />
          <TextArea
            placeholder="Comment"
            fontSize={14}
            width="100%"
            className="input-field"
          />
          <Button
            label="REMOVE MY DATA"
            width="50%"
            height={40}
            color="transparent"
          />
        </div>
      </form>
    </Container>
  )
}
