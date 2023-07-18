import React from 'react'
import 'react-tabs/style/react-tabs.css'
import FormTopHeader from '~components/Layout/Dashboard/FormTopHeader'
import FormTitle from '~components/Layout/Dashboard/FormTitle'
import Signatures from './Signatures/index'
import './style.scss'

export default (props) => {
  const {
    history,
    mailSignature,
    setSignatureSearch,
    initSignatureSearch,
    initSignature,
    match,
  } = props

  let selectedSignature = null;
  const { state } = history.location;
  if (state) {
    selectedSignature = state.signature;
  }

  const { search } = mailSignature
  const { isSelect } = match.params

  const onChangeSearch = (e) => {
    setSignatureSearch(e.target.value)
  }

  const clearSearch = () => {
    initSignatureSearch()
  }

  const gotoAdd = () => {
    initSignature()
    history.push('/dashboard/mailSignatures/new')
  }

  return (
    <div className="mail-signatures-page">
      <FormTopHeader
        showSearch={!selectedSignature}
        showAdd={!selectedSignature}
        showBack={isSelect || selectedSignature}
        search={search}
        onChangeSearch={onChangeSearch}
        onClearSearch={clearSearch}
        onAdd={gotoAdd}
        history={history}
      />
      <FormTitle title={selectedSignature ? 'Selected Signature' : 'Mail Signatures'} />
      <Signatures {...props} isSelect={isSelect} signature={selectedSignature} />
    </div>
  )
}
