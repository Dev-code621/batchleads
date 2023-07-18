import React from 'react'
import Switch from 'react-switch'
import Form from '~components/Form'
import FormTitle from '~components/Layout/Dashboard/FormTitle'
import ContainerRow from '~common/components/ContainerRow'

const MapOptions = ({
  type = 'roadmap', showDrivingRoutes = false, setMapType, setShowDrivingRoutes,
}) => {
  const standardClassName = type === 'roadmap' ? 'map-type-standard selected' : 'map-type-standard'
  const satelliteClassName = type === 'satellite' ? 'map-type-satellite selected' : 'map-type-satellite'

  return (
    <Form className="map-options-form">
      <FormTitle title="Map Options" />
      <ContainerRow title="Map Type">
        <div className="map-type-selector">
          <div onClick={() => setMapType('roadmap')} className={standardClassName}>Standard</div>
          <div onClick={() => setMapType('satellite')} className={satelliteClassName}>Satellite</div>
        </div>
      </ContainerRow>
      <div className="driving-route">
        <div className="label-container">
          <div className="title">Display Past Drive Routes</div>
          <div className="color-container">
            <div className="color-label green">0-6 months</div>
            <div className="color-label yellow">6-12 months</div>
            <div className="color-label red">12-24 months</div>
          </div>
        </div>
        <Switch
          onChange={() => setShowDrivingRoutes(!showDrivingRoutes)}
          checked={showDrivingRoutes}
          checkedIcon={false}
          uncheckedIcon={false}
          onColor="#3683bc"
        />
      </div>
    </Form>
  )
}

export default MapOptions
