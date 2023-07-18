import React, { useState } from 'react'
import { connect } from 'react-redux'
import get from 'lodash.get'
import Form from '~components/Form'
import ContainerRow from '~components/ContainerRow'
import LoadingActivity from '~components/LoadingActivity'
import { userSelector } from '~redux/selectors/userSelector'
import './layout/style.scss'

const mapStateToProps = (state) => ({
  user: userSelector(state),
})

const mapDispatchToProps = {}

const Affiliates = ({ user }) => {
  const [loading, setLoading] = useState(true)
  const firstPromoter = get(user.result.user.user, 'first_promoter')
  let authToken = null
  if (firstPromoter) {
    authToken = firstPromoter.auth_token
  }

  return (
    <Form className="affiliates-page">
      {
        loading && <ContainerRow><LoadingActivity /></ContainerRow>
      }
      {
        authToken && (
        <iframe
          title="Affiliates"
          className="affiliates-iframe"
          width="100%"
          frameBorder="0"
          src={`https://${__CONFIG__.FP_SUBDOMAIN}.firstpromoter.com/iframe?at=${authToken}`}
          onLoad={() => setLoading(false)}
        />
        )
      }
    </Form>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Affiliates)
