import React from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import ScrollContainer from './ScrollContainer'
import ContainerRow from '~components/ContainerRow'
import LoadingActivity from '~components/LoadingActivity'
import NoItemsDescription from '~components/NoItemsDescription'

export default ({
  children,
  next,
  refresh,
  dataLength,
  hasMore,
  loading,
  noItemsMessage,
  hideNoItemsMessage,
  scrollableTarget,
}) => (
  <ScrollContainer id={scrollableTarget}>
    <InfiniteScroll
      dataLength={dataLength}
      next={next}
      hasMore={hasMore}
      refreshFunction={refresh}
      pullDownToRefresh
      pullDownToRefreshContent={
        <h3 style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</h3>
      }
      releaseToRefreshContent={
        <h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>
      }
      scrollableTarget={scrollableTarget || 'form-scroll-container'}
      pullDownToRefreshThreshold="30"
    >
      {!hideNoItemsMessage && dataLength === 0 && !loading && (
        <NoItemsDescription description={noItemsMessage} />
      )}
      {children}
    </InfiniteScroll>
    {loading && (
      <ContainerRow>
        <LoadingActivity />
      </ContainerRow>
    )}
  </ScrollContainer>
);
