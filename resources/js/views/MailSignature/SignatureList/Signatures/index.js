import React, { useEffect, useState } from 'react'
import { fromJS } from 'immutable'
import InfiniteScroll from '~components/Layout/Dashboard/InfiniteScroll'
import Form from '~components/Form'
import Button from '~components/Button'
import NoItemsDescription from '~components/NoItemsDescription'
import Signature from './Signature'
import './style.scss'

export default ({
  getSignatures,
  initSignatures,
  mailSignature,
  history,
  signature,
  initSignature,
}) => {
  const [loaded, setLoaded] = useState(false)

  const {
    result: signatures, search, total, page, count_per_page: countPerPage, count, loading,
  } = mailSignature

  const dataLength = count + (Number(page) - 1) * countPerPage

  useEffect(() => {
    if (dataLength === 0) {
      initSignatures(search)
      getSignatures(1, search)
    }
  }, [])

  useEffect(() => {
    if (loaded) {
      initSignatures(search)
      getSignatures(1, search)
    }
    setLoaded(true)
  }, [search])

  const fetchData = () => {
    getSignatures(Number(page) + 1, search)
  }

  const refresh = () => {
    // initSignatures()
    getSignatures(1, search)
  }

  const gotoNewSignature = () => {
    initSignature()
    history.push('/dashboard/mailSignatures/new')
  }

  const gotoEditSignature = (temp) => {
    initSignature()
    history.push('/dashboard/mailSignatures/new', { signature: temp })
  }

  const renderSignature = () => {
    if (signature) {
      return (
        <Signature
          signature={fromJS(signature)}
          onClickItem={() => gotoEditSignature(fromJS(signature))}
        />
      )
    }

    return (
      <Form className="mail-signature-list">
        <InfiniteScroll
          dataLength={dataLength}
          next={fetchData}
          hasMore={total && total > countPerPage * Number(page)}
          refresh={refresh}
          loading={loading}
        >
          {dataLength === 0 && !search && !loading && (
            <NoItemsDescription description="You don't have any Signatures now,<br /> but you can create">
              <Button
                label="New Signature"
                height="48px"
                style={{
                  backgroundColor: '#3683bc',
                  fontSize: '13px',
                  borderRadius: '24px',
                }}
                onClick={gotoNewSignature}
              />
            </NoItemsDescription>
          )}
          {dataLength === 0 && search && !loading && (
            <NoItemsDescription description="No Signatures" />
          )}
          {signatures.map((item) => (
            <Signature
              signature={item}
              key={item.id}
              onClickItem={() => gotoEditSignature(item)}
            />
          ))}
        </InfiniteScroll>
      </Form>
    )
  }

  return renderSignature()
}
