import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import InfiniteScroll from 'react-infinite-scroller'
import Form from '~components/Form'
import FormTitle from '~components/Layout/Dashboard/FormTitle'
import ContainerRow from '~components/ContainerRow'
import SendBox from './layout/SendBox'
import ActivityItem from './layout/ActivityItem'
import NoItemsDescription from '~components/NoItemsDescription'
import LoadingActivity from '~components/LoadingActivity'

import { userSelector } from '~redux/selectors/userSelector'
import { activitiesSelector, selectedPropertySelector } from '~redux/selectors/propertySelector'
import { initPropertyActivities, getPropertyActivities, addPropertyNote } from '~redux/modules/property'

import './style.scss'

export default ({ history }) => {
  const [scrollParent, setScrollParent] = useState(null)
  const dispatch = useDispatch()
  const property = useSelector(selectedPropertySelector).item
  const activites = useSelector(activitiesSelector)
  const { user } = useSelector(userSelector).result.user
  const {
    loading, success, total, page, items, count_per_page: countPerPage,
  } = activites
  useEffect(() => {
    if (property.id) {
      dispatch(initPropertyActivities())
      dispatch(getPropertyActivities(property.id, 1))
    } else {
      history.push('/dashboard/properties')
    }
  }, [property.id])
  const reversedItems = [...items].reverse()

  const fetchData = () => {
    if (!loading) {
      dispatch(getPropertyActivities(property.id, page + 1))
    }
  }

  const scrollToBottom = () => {
    if (scrollParent) {
      scrollParent.scrollTo(
        0,
        scrollParent.scrollHeight
      )
    }
  }

  useEffect(() => {
    if (!loading && success && page === 1) {
      scrollToBottom()
    }
  }, [items])

  const send = (str) => {
    if (str.trim() !== '') {
      dispatch(addPropertyNote(property.id, str))
      setTimeout(() => {
        scrollToBottom()
      }, 100)
    }
  }
  const hasMore = !loading && total && total > countPerPage * Number(page)
  return (
    <Form className="property-history">
      <FormTitle title="Activities & Notes" hasBack history={history} />
      <div className="chat-history-box" ref={(ref) => setScrollParent(ref)}>
        <InfiniteScroll
          pageStart={0}
          isReverse
          loadMore={fetchData}
          hasMore={!!hasMore}
          useWindow={false}
          initialLoad={false}
          getScrollParent={() => scrollParent}
        >
          {loading && <ContainerRow><LoadingActivity /></ContainerRow>}
          {items.length === 0 && !loading && (
            <NoItemsDescription description="No Activities & Notes" />
          )}
          {reversedItems.map((item) => (
            <ActivityItem key={item.id || item.description} item={item} currentUser={user} />
          ))}
        </InfiniteScroll>
      </div>
      <ContainerRow className="chat-text-box">
        <SendBox sendMessage={send} />
      </ContainerRow>
    </Form>
  )
}
