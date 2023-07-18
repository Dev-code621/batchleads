import React from 'react'
import { useSelector } from 'react-redux'
import LoadingActivity from '~components/LoadingActivity'
import { selectedPropertySelector } from '~redux/selectors/propertySelector'
import './ModalContent.style.scss'

export default ({ children }) => {
  const property = useSelector(selectedPropertySelector)
  const onPropertyDetail = window.location.pathname === '/dashboard/properties/detail'
  const loading = onPropertyDetail && (property.loading || property.skipTracing.loading)
  return (
    <div className="page-modal-content">
      <div className="page-modal-inner">
        {
          children
        }
      </div>
      {loading && (
        <div className="page-modal-inner loading-view">
          <LoadingActivity width={30} height={30} color="white" />
        </div>
      )}
    </div>
  )
}
