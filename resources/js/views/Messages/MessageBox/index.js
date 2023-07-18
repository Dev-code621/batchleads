import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import InfiniteScroll from '~components/Layout/Dashboard/InfiniteScroll'
import Form from '~components/Form'
import FormTitle from '~components/Layout/Dashboard/FormTitle'
import { deleteMasterSelector } from '~redux/selectors/messageSelector'
import { deleteMessageMaster, initDeleteMessageMaster } from '~redux/modules/message'
import Message from './layout/Message'
import './layout/style.scss'

export default (props) => {
  const {
    history,
    getMessageBox,
    setSelectedMaster,
    message,
  } = props
  const deleteResult = useSelector(deleteMasterSelector)
  const dispatch = useDispatch()

  const { messageBox } = message
  const {
    data: messages,
    total,
    page,
    count_per_page: countPerPage,
    count,
    loading,
  } = messageBox
  const dataLength = count + (Number(page) - 1) * countPerPage

  const fetchData = () => {
    getMessageBox(Number(page) + 1)
  }

  const refresh = () => {
    getMessageBox(1)
  }

  const gotoDetail = (item) => {
    setSelectedMaster(item)
    history.push(`/dashboard/messages/${item.id}`)
  }

  useEffect(() => {
    getMessageBox(1)
    dispatch(initDeleteMessageMaster())
  }, [])

  useEffect(() => {
    if (!deleteResult.loading && deleteResult.success) {
      refresh()
      dispatch(initDeleteMessageMaster())
    }
  }, [deleteResult])

  const deleteMaster = (masterId) => {
    dispatch(deleteMessageMaster(masterId))
  }

  return (
    <Form className="message-list">
      <FormTitle title="Messages" hasRefresh refresh={refresh} loading={loading} />
      <InfiniteScroll
        dataLength={dataLength}
        next={fetchData}
        hasMore={total && total > countPerPage * Number(page)}
        refresh={refresh}
        noItemsMessage="No Messages"
        loading={loading || deleteResult.loading}
      >
        {messages.map((item) => (
          <Message
            message={item}
            key={item.id}
            onClickItem={() => gotoDetail(item)}
            onDelete={() => deleteMaster(item.id)}
          />
        ))}
      </InfiniteScroll>
    </Form>
  )
}
