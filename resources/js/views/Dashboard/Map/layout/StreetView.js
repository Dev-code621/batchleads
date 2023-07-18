import React, { useState, useEffect, Fragment } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import {
  StreetViewPanorama,
} from '@react-google-maps/api'
import get from 'lodash.get'
import {
  FiPlus, FiMinus,
} from 'react-icons/fi'
import { FaMapPin, FaRoute } from 'react-icons/fa'
import { propertySelector } from '~redux/selectors/propertySelector'
import { actions as propertyActions } from '~redux/modules/property'
import { drivingRoutesSelector } from '~redux/selectors/drivingRoutesSelector'
import { actions as drivingRoutesActions } from '~redux/modules/drivingRoutes'
import { userSelector } from '~redux/selectors/userSelector'
import {
  geoDistance,
  decimalAdjust,
  toast,
} from '~common/helper'
import StreetViewPropertyInfo from './StreetViewPropertyInfo'
import Flag from '~assets/icons/Flag.png'
import { getAddressDetailfromLocation } from '../../../../common/api/module/property'
import './style.scss'

const mapStateToProps = (state) => ({
  property: propertySelector(state),
  drivingRoutes: drivingRoutesSelector(state),
  user: userSelector(state),
})

const mapDispatchToProps = {
  ...propertyActions,
  ...drivingRoutesActions,
}

let panorama = null
let infoWindow = null
const iconOffsety = 240
let markerList = []

const StreetView = withRouter(({
  showStreetView, property, user,
  getPropertyByDistance,
  setShowStreetView,
  removePin,
  selectProperty,
  streetviewPosition,
  history,
  createDrivingRoute, drivingRoutes, getDrivingRoutes,
  tracking, setTracking,
}) => {
  const [position, setPosition] = useState(streetviewPosition)
  const [active, setActive] = useState()
  const [startPosition, setStartPosition] = useState(null)
  const [stopPosition, setStopPosition] = useState(null)
  const [startTime, setStartTime] = useState(null)
  const [distance, setDistance] = useState(null)
  const [cordinates, setCordinates] = useState([])
  const [trackingId, setTrackingId] = useState(null)
  const { loading, error } = property.resultPropertyByDistance
  const propertyByDistance = get(property.resultPropertyByDistance, 'propertyByDistance')
  const { result } = drivingRoutes
  const { createResult } = result
  const { google } = window
  const radius = 50
  const zoom = 0

  const iconMarker = {
    url: `${Flag}`,
    size: new google.maps.Size(50, 50),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(0, iconOffsety),
  }

  const onClickPinst = (event, item, marker) => {
    setActive({ item, marker })
  }

  useEffect(() => {
    if (showStreetView && panorama) {
      setPosition({ ...position, streetviewPosition })
      panorama.setPosition(streetviewPosition)
      panorama.setVisible(true)
    }
    if (!showStreetView && tracking && cordinates.length > 0) {
      setTracking(false)
    }
  }, [showStreetView])

  const onHideStreetView = () => {
    markerList.map((marker) => {
      return marker.setMap(null)
    })
    markerList = []
    setActive(null)
    if (panorama) {
      panorama.setVisible(false)
    }
    setShowStreetView(false)
  }

  useEffect(() => {
    getPropertyByDistance(position.lat, position.lng, radius)
    if (tracking && cordinates.length > 0) {
      const oldPostion = cordinates[cordinates.length - 1]
      const dis = geoDistance(position, oldPostion)
      let tempCoordinates = [...cordinates]
      const tdistance = distance + dis
      if (dis > 0) {
        tempCoordinates.push(position)
      }
      setCordinates(tempCoordinates)
      setDistance(decimalAdjust('round', tdistance, -2))
    }
  }, [position])

  useEffect(() => {
    if (showStreetView && panorama) {
      setPosition({ ...position, streetviewPosition })
      panorama.setPosition(streetviewPosition)
    }
  }, [streetviewPosition])

  useEffect(() => {
    if (propertyByDistance) {
      markerList.map((marker) => {
        return marker.setMap(null)
      })
      markerList = []
      propertyByDistance.map((item) => {
        const marker = new google.maps.Marker({
          position: new google.maps.LatLng({
            lat: parseFloat(item.location_latitude),
            lng: parseFloat(item.location_longitude),
          })
        })
        marker.setIcon(iconMarker)
        marker.setMap(panorama)
        marker.addListener('click', (e) => {
          onClickPinst(e, item, marker)
        })
        markerList.push(marker)
        return true
      })
    }
  }, [propertyByDistance])

  const initTracking = () => {
    setStartPosition(position)
    setStopPosition(position)
    const now = Date.now()
    setStartTime(now)
    setTrackingId(now)
    setDistance(0)
    setCordinates([position, position])
  }

  useEffect(() => {
    if (createResult.success) {
      setStartPosition(null)
      setStopPosition(null)
      setStartTime(null)
      setTrackingId(null)
      setDistance(0)
      setCordinates([])
      getDrivingRoutes(1)
      toast.success('Route Saved!')
    }
    if (!createResult.success && createResult.error) {
      toast.error(error.message)
    }
  }, [createResult])

  const saveTracking = async () => {
    const gps = cordinates.map(({ lat, lng }) => ({ latitude: lat, longitude: lng }));
    try {
      setStopPosition(position)
      const startAddress = await getAddressDetailfromLocation(startPosition.lat, startPosition.lng)
      const endAddress = await getAddressDetailfromLocation(stopPosition.lat, stopPosition.lng)
      const time = Date.now() - startTime
      createDrivingRoute({
        user_id: user.result.user.user.id,
        start_address: startAddress.formatted_address.replace(', USA', ''),
        end_address: endAddress.formatted_address.replace(', USA', ''),
        total_hours: time / (1000),
        total_distance: distance,
        driving_route_temp_id: trackingId,
        gps,
        route_type: 'Virtual',
      });
      setCordinates([])
    } catch (errortrack) {
      console.log(errortrack)
      toast.error('Error in fetching Address')
      setCordinates([])
    }
  }

  useEffect(() => {
    if (tracking) {
      initTracking()
    } else if (cordinates.length > 0) {
      saveTracking()
    }
    setActive(null)
  }, [tracking])

  const addProperty = (propertyDetails) => {
    const details = propertyDetails
    if (tracking) {
      details.driving_route_temp_id = trackingId
    }
    selectProperty(details)
    setTimeout(() => {
      history.push('/dashboard/properties/detail')
    }, 500)
  }

  const setPropteryWindowcontent = (item) => {
    if (active) {
      const propertyDesc = (
        <StreetViewPropertyInfo
          property={item}
          removePin={removePin}
          selectProperty={addProperty}
          loading={loading}
          error={error}
        />
      )
      if (document.getElementById('window-item')) {
        ReactDOM.render(propertyDesc, document.getElementById('window-item'))
      } else {
        setTimeout(() => {
          setPropteryWindowcontent(item)
        }, 500)
      }
    }
  }

  useEffect(() => {
    if (active) {
      const { item, marker } = active
      infoWindow.content = '<div  class="infoBox-st" id="window-item">Items</div>'
      infoWindow.open(panorama, marker)
      setPropteryWindowcontent(item)
    } else if (infoWindow) {
      infoWindow.close()
    }
  }, [active])

  const zoomStViewIn = () => {
    const zoomIn = panorama.getZoom()
    panorama.setZoom(zoomIn + 1)
  }
  const zoomStViewOut = () => {
    const zoomOut = panorama.getZoom()
    panorama.setZoom(zoomOut - 1)
  }

  const StreetViewControl = (streetViewcontrolDiv) => {
    const mapTrackUI = document.createElement('div')
    const mapTrackUIHide = document.createElement('div')
    streetViewcontrolDiv.appendChild(mapTrackUI)
    mapTrackUI.className = 'my-current-position-container'
    ReactDOM.render(
      <FaRoute className="streetview-icon start" />,
      mapTrackUI
    )
    mapTrackUI.addEventListener('click', () => {
      setTracking(true)
      mapTrackUI.style.display = 'none'
      mapTrackUIHide.style.display = 'flex'
    })

    streetViewcontrolDiv.appendChild(mapTrackUIHide)
    mapTrackUIHide.className = 'my-current-position-container'
    ReactDOM.render(
      <FaRoute className="streetview-icon stop" />,
      mapTrackUIHide
    )
    mapTrackUIHide.style.display = 'none'
    mapTrackUIHide.addEventListener('click', () => {
      setTracking(false)
      mapTrackUI.style.display = 'flex'
      mapTrackUIHide.style.display = 'none'
    })

    const streetViewControlUI = document.createElement('div')
    streetViewcontrolDiv.appendChild(streetViewControlUI)
    streetViewControlUI.className = 'my-current-position-container'
    ReactDOM.render(
      <FaMapPin className="streetview-icon" />,
      streetViewControlUI
    )
    streetViewControlUI.addEventListener('click', () => {
      onHideStreetView()
    })

    const zoomControlUI = document.createElement('div')
    streetViewcontrolDiv.appendChild(zoomControlUI)
    zoomControlUI.className = 'zoom-container'

    ReactDOM.render(
      <div className="zoom-sub-container">
        <FiPlus className="plus-icon" onClick={zoomStViewIn} />
        <FiMinus className="plus-icon" onClick={zoomStViewOut} />
      </div>,
      zoomControlUI
    )
  }

  const createInfoBox = () => {
    infoWindow = new google.maps.InfoWindow({
      position: new google.maps.LatLng({
        lat: position.lat,
        lng: position.lng,
      }),
      content: '<div  class="infoBox-st" id="window-item">Items</div>',
      disableAutoPan: true,
    })
    infoWindow.close()
  }

  const updatePostion = () => {
    if (panorama) {
      const loc = panorama.getLocation()
      if (loc && loc.latLng) {
        setPosition({ ...position, lat: loc.latLng.lat(), lng: loc.latLng.lng() })
      }
    }
  }

  const onCloseStreetView = () => {
    onHideStreetView()
    return false
  }

  const onStreetViewLoad = (ref) => {
    panorama = ref
    const streetViewcontrolDiv = document.createElement('div')
    streetViewcontrolDiv.className = 'map-position-zoom-control-container-st'
    const streetViewControl = new StreetViewControl(streetViewcontrolDiv)
    streetViewcontrolDiv.index = 1
    panorama.controls[3].push(streetViewcontrolDiv)
    panorama.addListener('closeclick', () => { onCloseStreetView() })
    panorama.addListener('position_changed', () => { updatePostion() })
    createInfoBox()
  }

  return (
    <Fragment>
      <StreetViewPanorama
        id="gonock-streetview"
        onLoad={onStreetViewLoad}
        visible={false}
        zoom={zoom}
        options={{
          disableDefaultUI: true,
          addressControl: true,
          imageDateControl: true,
        }}
      />
      {loading && (
        <div className="map-loading-st">
          <div>Loading Properties...</div>
        </div>
      )}
    </Fragment>
  )
})

export default connect(mapStateToProps, mapDispatchToProps)(StreetView)
