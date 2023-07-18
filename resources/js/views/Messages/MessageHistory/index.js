import React, { useEffect } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import { useSelector } from 'react-redux'
import Form from '~components/Form'
import ContainerRow from '~components/ContainerRow'
import FormTitle from '~components/Layout/Dashboard/FormTitle'
import LoadingActivity from '~components/LoadingActivity'
import NoItemsDescription from '~components/NoItemsDescription'
import {
  formatPhoneNumber,
  formatPhoneNumberForApiRequest,
  toast,
} from '~common/helper'
import Message from './layout/Message'
import './layout/style.scss'
import SendBox from './layout/SendBox'
import RightHomeButton from './layout/RightHomeButton'
import LocationIcon from '~assets/icons/location.svg'
import { propertiesByPhoneNumberSelector } from '~redux/selectors/propertySelector'

export default (props) => {
  const {
    history,
    match,
    initMessageHistory,
    getMessageHistory,
    sendMessage,
    message,
    markMessageRead,
    getPropertiesByPhoneNumber,
    selectProperty,
  } = props
  const propertiesByPhoneNumber = useSelector(propertiesByPhoneNumberSelector)
  let propertiesForContextMenu = null
  if (propertiesByPhoneNumber.data) {
    propertiesForContextMenu = propertiesByPhoneNumber.data.map((item) => {
      return {
        label: item.property && item.property.address1,
        value: item.property && item.property.id,
        ...item.property,
      }
    })
  }
  const masterId = match.params[0]

  const { messageHistory, master, sendingMessage } = message
  const {
    data: messages,
    total,
    page,
    count_per_page: countPerPage,
    count,
    loading,
    receiving,
  } = messageHistory

  const { loading: isSending, error } = sendingMessage

  const dataLength = count + (Number(page) - 1) * countPerPage

  const messaageList = messages.reverse()

  const fetchData = () => {
    getMessageHistory(masterId, Number(page) + 1)
  }

  const send = (str) => {
    const id = new Date().getTime()
    sendMessage(id, str, master.phone_number)
  }

  useEffect(() => {
    if (!master.id) {
      history.goBack()
    }
  }, [])

  useEffect(() => {
    if (master.phone_number) {
      getPropertiesByPhoneNumber(
        formatPhoneNumberForApiRequest(master.phone_number)
      )
    }
  }, [master.phone_number])

  useEffect(() => {
    initMessageHistory()
    getMessageHistory(masterId, 1)
  }, [masterId])

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  let scrollView = null
  const scrollToBottom = () => {
    scrollView.scrollComponent.parentElement.scrollTo(
      0,
      scrollView.scrollComponent.parentElement.scrollHeight
    )
  }

  useEffect(() => {
    if (!loading && Number(page) === 1) {
      scrollToBottom()
      markMessageRead(masterId)
    }
  }, [loading])

  useEffect(() => {
    if (isSending) {
      scrollToBottom()
    }
  }, [isSending])

  useEffect(() => {
    if (receiving) {
      scrollToBottom()
    }
  }, [receiving])

  const onClickProperty = (item) => {
    selectProperty(item)
    history.push('/dashboard/properties/detail')
  }

  return (
    <Form className="message-history">
      <FormTitle
        title={formatPhoneNumber(master.phone_number)}
        hasBack
        history={history}
      >
        {propertiesForContextMenu && (
          <RightHomeButton
            items={propertiesForContextMenu}
            onClickItem={(item) => onClickProperty(item)}
            itemIcon={LocationIcon}
          />
        )}
      </FormTitle>
      <div className="chat-history-box">
        <InfiniteScroll
          pageStart={0}
          loadMore={fetchData}
          hasMore={!loading && total && total > countPerPage * Number(page)}
          isReverse
          useWindow={false}
          initialLoad={false}
          ref={(ref) => {
            scrollView = ref
            return true
          }}
        >
          {loading && (
            <ContainerRow>
              <LoadingActivity />
            </ContainerRow>
          )}
          {dataLength === 0 && !loading && (
            <NoItemsDescription description="No Messages" />
          )}
          {messaageList.map((item) => (
            <Message
              message={item}
              key={item.id}
              isReceive={master.phone_number === item.sender}
            />
          ))}
        </InfiniteScroll>
      </div>
      <ContainerRow className="chat-text-box">
        <SendBox sendMessage={send} />
      </ContainerRow>
    </Form>
  )
}
