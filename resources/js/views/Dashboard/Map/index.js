import React, {
  useState, useEffect, Fragment, useCallback,
} from 'react'
import ReactDOM from 'react-dom'
import { withRouter } from 'react-router-dom'
import { connect, useSelector } from 'react-redux'
import {
  GoogleMap,
  OverlayView,
  Polyline,
  Marker,
  Circle,
} from '@react-google-maps/api'
import {
  FiPlus,
  FiMinus,
  FiMap,
} from 'react-icons/fi'
import { TiLocationArrowOutline } from 'react-icons/ti'
import { FaCircle, FaStreetView } from 'react-icons/fa'
import Modal from 'react-modal'
import get from 'lodash.get'
import debounce from 'lodash.debounce'
import moment from 'moment'
import TagManager from 'react-gtm-module'
import { drivingRoutesSelector } from '~redux/selectors/drivingRoutesSelector'
import {
  propertySelector,
  searchModeSelector,
  mapSearchResultSelector,
  saveSearchedResultSelector,
  searchFilterSelector,
  mapResultListSelector,
} from '~redux/selectors/propertySelector'
import { useThemeState } from '~common/theme-context'
import { creditSelector } from '~redux/selectors/creditSelector'
import { userSelector } from '~redux/selectors/userSelector'
import { actions as propertyActions } from '~redux/modules/property'
import { actions as drivingRoutesActions } from '~redux/modules/drivingRoutes'
import { actions as creditActions } from '~redux/modules/credit'
import PropertyInfoWindow from './layout/PropertyInfoWindow'
import LoadingActivity from '~components/LoadingActivity'
import { MapPin } from '~components/MapPin'
import StreetView from './layout/StreetView'
import MapContextMenu from './layout/MapContextMenu'
import { getAddressFormats, toast } from '~common/helper'
import './layout/style.scss'
import MapOptions from './layout/MapOptions'
import MapFilter from './layout/MapFilter'
import SearchSaveOptions from './layout/SearchSaveOptions'
import SearchTools from './layout/SearchTools'
import { ClusterMarkers } from './layout/ClusterMarkers'
import { HomeDrivingRoutes } from './layout/HomeDrivingRoutes'

const mapStateToProps = (state) => ({
  property: propertySelector(state),
  drivingRoute: drivingRoutesSelector(state),
  credit: creditSelector(state),
  user: userSelector(state),
})

const mapDispatchToProps = {
  ...propertyActions,
  ...drivingRoutesActions,
  ...creditActions,
}

let searchBox = null
let map = null

const defaultZoom = 11
const mapTypeViewModalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    top: '50%',
    left: '100%',
    right: 'auto',
    bottom: 'auto',
    marginLeft: '-150px',
    transform: 'translate(-50%, -50%)',
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    border: 'none',
    background: 'transparent',
    borderRadius: 0,
  },
}
const mapOptionModalStyle = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    top: '50%',
    left: '100%',
    right: 'auto',
    bottom: 'auto',
    marginLeft: '-215px',
    transform: 'translate(-50%, -50%)',
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    border: 'none',
    background: 'transparent',
    borderRadius: 0,
  },
}
const routeOptions = {
  strokeColor: '#0c7de3',
  strokeOpacity: 1,
  strokeWeight: 5,
  fillColor: '#0c7de3',
  fillOpacity: 0.35,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
  radius: 30000,
  zIndex: 1,
}

let folderIdForBulkAdd = 0
let propertiesForBulkAdd = []

const MyMap = withRouter(({
  history,
  getPropertyByLatLng,
  property,
  drivingRoute,
  getPropertyByAddress,
  initDrivingRoute,
  getMapProperties,
  selectProperty,
  initPropertyByAddress,
  updateMapOption,
  credit,
  endTrial,
  initEndTrial,
  saveSearchedProperties,
  getMapSearch,
  updateSearchModeFilter,
  getHomeDrivingRoutes,
  user,
  // initMapSearch,
}) => {
  const [initLocation, setInitLocation] = useState(false);
  const [selectedLat, setSelectedLat] = useState(0)
  const [selectedLng, setSelectedLng] = useState(0)
  const [addressPin, setAddressPin] = useState(null)
  const [currentLat, setCurrentLat] = useState(0)
  const [currentLng, setCurrentLng] = useState(0)
  const [showMapType, setShowMapType] = useState(false)
  const [showMapFilter, setShowMapFilter] = useState(false)
  const [mapType, setMapType] = useState('roadmap')
  const [showDrivingRoutes, setShowDrivingRoutes] = useState(false)
  const [previousPoint, setPreviousPoint] = useState({ lat: 0, lon: 0 })
  const [addressLoading, setAddressLoading] = useState(false)
  // const [showSearchResultInfo, setShowSearchResultInfo] = useState(false)
  const [showSearchSave, setShowSearchSave] = useState(false)
  const [showSearchFilter, setShowSearchFilter] = useState(false)
  const [showStreetView, setShowStreetView] = useState(false)
  const [streetviewPosition, setStreetviewPosition] = useState({ lat: -1, lng: -1 })
  const [dragging, setDragging] = useState(false)
  const [showContext, setContextMenu] = useState(false)
  const [tracking, setTracking] = useState(false)
  const searchMode = useSelector(searchModeSelector)
  const {
    loading: mapSearchLoading,
    items: mapSearchItems,
    // total: mapSearchResultCount,
  } = useSelector(mapSearchResultSelector)
  const {
    loading: saveSearchedLoaing,
    error: saveSearchedError,
    success: saveSearchedSuccess,
  } = useSelector(saveSearchedResultSelector)
  const mapSearchFilter = useSelector(searchFilterSelector)
  const { mapResult, selectedProperty, mapFilter } = property
  const { loading, error: searchError } = property.resultPropertyByLatLng
  const addressRes = property.resultPropertyByAddress
  const { loading: mapLoading } = mapResult
  const selectedPropertyItem = get(selectedProperty, 'item')
  const endTrialSuccess = get(credit.endTrialResult, 'success')
  const mapResultList = useSelector(mapResultListSelector)
  const subscriptionDetails = user.result.user ? get(user.result.user.user, 'subscription') : null
  const [mapChanges, setMapChanges] = useState(null)
  const theme = useThemeState()
  const [bounds, setBounds] = useState(null);

  const loadMapProperties1 = (page, location, filter = mapFilter) => {
    const mapBounds = map.getBounds()
    const ne = mapBounds.getNorthEast()
    const sw = mapBounds.getSouthWest()

    const updatedFilter = {
      folder_id: filter.folder.id,
      status: filter.status !== 'All Deals' ? filter.status : null,
      user_id: filter.user.id,
      skip_traced: filter.skipTracing.id,
      owner_occupied: filter.owner.id,
      ne_lat: ne.lat(),
      ne_lon: ne.lng(),
      sw_lat: sw.lat(),
      sw_lon: sw.lng(),
      created_at: filter.created_at ? moment(filter.created_at).format('YYYY-MM-DD') : '',
      radius: 9000, // 5 mile
      tags: filter.tags,
      pageSize: 3000,
    };
    getMapProperties(page, updatedFilter, true)
    if (showDrivingRoutes) {
      getHomeDrivingRoutes(1, {
        ne_lat: ne.lat(),
        ne_lon: ne.lng(),
        sw_lat: sw.lat(),
        sw_lon: sw.lng(),
      })
    }
  }

  useEffect(() => {
    if (showDrivingRoutes && map) {
      const mapBounds = map.getBounds()
      const ne = mapBounds.getNorthEast()
      const sw = mapBounds.getSouthWest()
      getHomeDrivingRoutes(1, {
        ne_lat: ne.lat(),
        ne_lon: ne.lng(),
        sw_lat: sw.lat(),
        sw_lon: sw.lng(),
      })
    }
  }, [showDrivingRoutes])

  const loadMapProperties = useCallback(debounce(loadMapProperties1, 1000), []);

  const contextMenu = {
    itemsClassName: '',
    items: [
      {
        icon: '',
        className: '',
        label: 'Go to Street View',
        value: 'streetview',
      },
    ],
  }

  const hideContextMenu = () => {
    setContextMenu(false)
    document.removeEventListener('click', hideContextMenu);
  }

  const showContextMenu = () => {
    if (!showContext) {
      document.addEventListener('click', hideContextMenu);
    }
    setContextMenu(!showContext)
  }

  const removePin = () => {
    setSelectedLat(null);
    setSelectedLng(null);
    setAddressPin(null);
  }

  useEffect(() => {
    const OneSignal = window.OneSignal || []
    OneSignal.push(() => {
      OneSignal.on('notificationDisplay', (event) => {
        const { data } = event
        if (data) {
          const { type } = data
          if (type === 'property_add') {
            loadMapProperties(1, previousPoint)
          }
        }
      })
    })
  }, [])

  useEffect(() => {
    if (showMapType) {
      setShowMapType(false)
    }
    if (searchMode !== 'address') {
      removePin()
    }
  }, [searchMode])

  useEffect(() => {
    if (!saveSearchedLoaing && saveSearchedSuccess) {
      toast.success('Properties will be added in a few minutes.')
      updateMapOption({ type: 'address' })
      loadMapProperties(1, previousPoint)
    }
    if (saveSearchedError && !saveSearchedLoaing) {
      const { status, data } = saveSearchedError.response
      if (status === 434) {
        const {
          current_count: currentCount,
          count_to_add: countToAdd,
          trial_count: trialCount,
        } = data.data
        if (confirm(`You are going to add ${countToAdd} properties, but in trial period allowed to add ${trialCount} properties, you currently have ${currentCount} properties. Do you want to end Trial and continue?`)) {
          endTrial()
        }
        return
      }
      toast.error(saveSearchedError.message)
    }
  }, [saveSearchedLoaing, saveSearchedSuccess, saveSearchedError])

  useEffect(() => {
    // const {
    //   total, propertyListData, page,
    // } = mapResult
    // if (!mapLoading && (total > propertyListData.length && propertyListData.length <= 1000)) {
    //   loadMapProperties(Number(page) + 1, previousPoint)
    // }
  }, [mapResult.propertyListData])

  useEffect(() => {
    if (endTrialSuccess) {
      const tagManagerArgs = {
        dataLayer: {
          event: 'user_subscribed',
          currencyCode: subscriptionDetails.amount / 100,
          transactionTotal: subscriptionDetails.currency,
        },
      }
      TagManager.dataLayer(tagManagerArgs)
      initEndTrial()
      saveSearchedProperties(folderIdForBulkAdd, propertiesForBulkAdd)
    }
  }, [endTrialSuccess])

  useEffect(() => {
    if (addressRes.success && !addressRes.loading && !addressRes.error && addressRes.item) {
      setSelectedLat(addressRes.item.location_latitude)
      setSelectedLng(addressRes.item.location_longitude)
      setAddressPin(addressRes.item)
      map.panTo({
        lat: addressRes.item.location_latitude,
        lng: addressRes.item.location_longitude,
      })
      initPropertyByAddress()
      setAddressLoading(false)
    }
    if ((addressRes.error && !addressRes.loading) || searchError) {
      toast.error('Can not find the property with this location!')
      removePin()
      initPropertyByAddress()
      setAddressLoading(false)
    }
  }, [addressRes, searchError])

  useEffect(() => {
    if (history.location.pathname === '/dashboard/properties/detail' && !selectedPropertyItem.address1) {
      setSelectedLat(null);
      setSelectedLng(null);
      history.push('/dashboard/properties');
    }
  }, [history.location])

  useEffect(() => {
    if (window.UsersnapCX) {
      if (showMapFilter) {
        window.UsersnapCX.hideButton()
      } else {
        window.UsersnapCX.showButton()
      }
    }
  }, [showMapFilter])

  let routes = drivingRoute.drivingRoute && JSON.parse(drivingRoute.drivingRoute.gps)
  let drivingRouteStart = null
  let drivingRouteEnd = null
  if (routes) {
    routes = routes.map((route) => {
      return {
        lat: route.latitude,
        lng: route.longitude,
      }
    })
    // eslint-disable-next-line prefer-destructuring
    drivingRouteStart = routes[0]
    drivingRouteEnd = routes[routes.length - 1]
  }

  useEffect(() => {
    if (routes && routes.length > 0) {
      map.setCenter({ ...routes[0] })
    }
  }, [drivingRoute.result])

  const gotoMyCurrentPosition = () => {
    initDrivingRoute()
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (initLocation) {
          return;
        }
        setInitLocation(true);
        const { latitude, longitude } = pos.coords
        setCurrentLat(latitude)
        setCurrentLng(longitude)
        map.setCenter({
          lat: latitude,
          lng: longitude,
        })
        map.setZoom(defaultZoom)
      },
      (err) => console.log(err)
    )
  }

  const zoomIn = () => {
    map.setZoom(map.getZoom() + 1)
  }

  const zoomOut = () => {
    map.setZoom(map.getZoom() - 1)
  }

  const onLoadSearchBox = (ref) => {
    searchBox = ref
    gotoMyCurrentPosition()
    return true
  }

  // const onDragStart = () => {
  //   setDragging(true)
  // }

  const mouseMove = (event) => {
    if (dragging) {
      setStreetviewPosition({
        ...streetviewPosition,
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      })
    }
  }

  const onDrop = () => {
    if (dragging) {
      setDragging(false)
      setShowStreetView(true)
    }
  }

  const CenterControl = (controlDiv) => {
    const mapTypeControlUI = document.createElement('div')
    controlDiv.appendChild(mapTypeControlUI)
    mapTypeControlUI.className = 'my-current-position-container'
    ReactDOM.render(
      <FiMap className="map-type-icon" />,
      mapTypeControlUI
    )
    mapTypeControlUI.addEventListener('click', () => {
      setShowMapType(true)
    })


    const myPositionControlUI = document.createElement('div')
    controlDiv.appendChild(myPositionControlUI)
    myPositionControlUI.className = 'my-current-position-container'
    ReactDOM.render(
      <TiLocationArrowOutline className="location-icon" />,
      myPositionControlUI
    )
    myPositionControlUI.addEventListener('click', () => {
      gotoMyCurrentPosition()
    })

    const zoomControlUI = document.createElement('div')
    controlDiv.appendChild(zoomControlUI)
    zoomControlUI.className = 'zoom-container'

    ReactDOM.render(
      <div className="zoom-sub-container">
        <FiPlus className="plus-icon" onClick={zoomIn} />
        <FiMinus className="plus-icon" onClick={zoomOut} />
      </div>,
      zoomControlUI
    )
  }

  const openContextMenu = (event) => {
    setStreetviewPosition({
      ...streetviewPosition,
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    })
    setDragging(false)
    showContextMenu()
  }

  const onContextClick = (e, item) => {
    if (item.value === 'streetview') {
      setDragging(false)
      setShowStreetView(true)
      e.stopPropagation();
      e.preventDefault();
    }
  }

  const findProperty = (event) => {
    if (showContext) {
      return
    }
    setContextMenu(false)
    if (searchMode !== 'address') {
      return
    }
    if (selectedLat && selectedLng) {
      removePin()
      return
    }
    initDrivingRoute()
    const { latLng } = event
    const latitude = latLng.lat()
    const longitude = latLng.lng()
    setSelectedLat(latitude)
    setSelectedLng(longitude)
    map.panTo({
      lat: latitude,
      lng: longitude,
    })
    map.setZoom(18)
    getPropertyByLatLng(latitude, longitude)
  }

  const onLoadMap = (ref) => {
    map = ref
    const controlDiv = document.createElement('div')
    controlDiv.className = `map-position-zoom-control-container ${theme.theme}}`
    // eslint-disable-next-line no-unused-vars
    const centerControl = new CenterControl(controlDiv)
    controlDiv.index = 1
    map.controls[7].push(controlDiv)
  }

  const onPlacesChanged = () => {
    const places = searchBox.getPlaces()
    if (places.length > 0) {
      if (places[0].address_components) {
        const searchKey = places[0].address_components[0].long_name
        if (places[0].address_components[0].types.includes('postal_code')) {
          updateMapOption({ type: 'zip' })
          updateSearchModeFilter({ type: 'zip', key: 'searchKey', value: searchKey })
          if (!mapSearchFilter.zip.visited) {
            setShowSearchFilter(true)
          } else {
            setTimeout(() => {
              getMapSearch(1, 'zip', [], mapSearchFilter.zip, searchKey)
            }, 100)
          }
        } else if (places[0].address_components[0].types.includes('administrative_area_level_2')) {
          updateMapOption({ type: 'county' })
          const state = places[0].address_components.find((address) => address.types.includes('administrative_area_level_1')).short_name
          const countyKey = `${searchKey}, ${state}`
          updateSearchModeFilter({ type: 'county', key: 'searchKey', value: countyKey })
          if (!mapSearchFilter.county.visited) {
            setShowSearchFilter(true)
          } else {
            setTimeout(() => {
              getMapSearch(1, 'county', [], mapSearchFilter.county, '', countyKey)
            }, 100)
          }
        } else if (places[0].address_components[0].types.includes('locality') || places[0].address_components[0].types.includes('sublocality')) {
          updateMapOption({ type: 'city' })
          const state = places[0].address_components.find((address) => address.types.includes('administrative_area_level_1')).short_name
          const cityKey = `${searchKey}, ${state}`
          updateSearchModeFilter({ type: 'city', key: 'searchKey', value: cityKey })
          if (!mapSearchFilter.city.visited) {
            setShowSearchFilter(true)
          } else {
            setTimeout(() => {
              getMapSearch(1, 'city', [], mapSearchFilter.city, '', cityKey)
            }, 100)
          }
        } else {
          updateMapOption({ type: 'address' })
          setTimeout(() => {
            getPropertyByAddress(getAddressFormats(places[0].address_components))
          }, 100)
          setAddressLoading(true)
        }
      }
      const { location } = places[0].geometry
      map.setCenter({
        lat: location.lat(),
        lng: location.lng(),
      })
      map.setZoom(18);
    }
  }

  const onChangedMapCenter = () => {
    if (!map || searchMode !== 'address') {
      return;
    }
    setMapChanges(Date.now());
    setBounds(map.getBounds());
    const location = { lat: map.getCenter().lat(), lon: map.getCenter().lng() }
    loadMapProperties(1, location)
  }

  const closeMapTypeModal = () => {
    setShowMapType(false)
  }

  const closeMapFilterModal = () => {
    setShowMapFilter(false);
  }

  const closeSearchSaveModal = (folderId, selectedProperties) => {
    folderIdForBulkAdd = folderId
    propertiesForBulkAdd = selectedProperties
    setShowSearchSave(false)
  }

  const applyNewFilter = (newFilter) => {
    setShowMapFilter(false);
    loadMapProperties(1, previousPoint, newFilter)
  }

  const afterOpenMapTypeModal = () => {
  }

  const setGoogleMapType = (type) => {
    setMapType(type)
    map.setMapTypeId(type)
  }

  const onClickPin = (item) => {
    setContextMenu(false)
    selectProperty(item)
    history.push('/dashboard/properties/detail')
  }

  const darkModeStyle = theme.theme === 'theme-dark'
    ? [
      { elementType: 'geometry.stroke', stylers: [{ color: '#AAAAAA', weight: 5 }] },
      { elementType: 'geometry.fill', stylers: [{ color: '#454545' }] },
      { elementType: 'labels.text.stroke', stylers: [{ color: '#454545' }] },
      { elementType: 'labels.text.fill', stylers: [{ color: '#AAAAAA' }] },
      {
        featureType: 'administrative.locality',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#3683BC' }],
      },
      {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#d59563' }],
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [{ color: '#263c3f' }],
      },
      {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#3683BC' }],
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ color: '#5C5C5C' }],
      },
      {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#1BE377' }],
      },
      {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#1BE377' }],
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{ color: '#cccccc' }],
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#5d5d5d' }],
      },
      {
        featureType: 'road.highway',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#1BE377' }],
      },
      {
        featureType: 'transit',
        elementType: 'geometry',
        stylers: [{ color: '#5f5f5f' }],
      },
      {
        featureType: 'transit.station',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#1BE377' }],
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#17263c' }],
      },
      {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#515c6d' }],
      },
      {
        featureType: 'water',
        elementType: 'labels.text.stroke',
        stylers: [{ color: '#17263c' }],
      },
    ]
    : []

  const draggingClass = dragging ? 'main-map dragging' : 'main-map'
  const mapClass = `${draggingClass} ${theme.theme}`

  return (
    <div style={{ height: '100vh' }} className={mapClass} onMouseUp={(event) => onDrop(event)}>
      <GoogleMap
        id="gonock-map"
        onLoad={onLoadMap}
        zoom={defaultZoom}
        mapContainerStyle={{
          height: '100%',
          width: '100%',
        }}
        onIdle={onChangedMapCenter}
        onClick={findProperty}
        options={{
          disableDefaultUI: true,
          streetViewControl: true,
          streetViewControlOptions: {
            position: 3,
          },
          styles: darkModeStyle,
        }}
        onRightClick={openContextMenu}
        onMouseMove={mouseMove}
      >
        <OverlayView
          position={{
            lat: currentLat,
            lng: currentLng,
          }}
          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        >
          <FaCircle className="my-position" />
        </OverlayView>
        <SearchTools
          type={searchMode}
          mapRef={map}
          showFilter={showSearchFilter}
          onLoadSearchBox={onLoadSearchBox}
          onPlacesChanged={onPlacesChanged}
          setShowMapFilter={setShowMapFilter}
          onCloseFilter={setShowSearchFilter}
        />
        {searchMode === 'address' && !showStreetView && (
          <Fragment>
            {!searchError && selectedLat && selectedLng && (
              <Fragment>
                <OverlayView
                  position={{
                    lat: selectedLat,
                    lng: selectedLng,
                  }}
                  mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                >
                  <MapPin />
                </OverlayView>
                {!loading && (
                  <PropertyInfoWindow
                    position={{
                      lat: selectedLat,
                      lng: selectedLng,
                    }}
                    pin={addressPin}
                    removePin={removePin}
                  />
                )}
              </Fragment>
            )}
            {
              selectedLat && selectedLng && (loading || addressLoading) && (
                <OverlayView
                  position={{
                    lat: selectedLat,
                    lng: selectedLng,
                  }}
                  mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                >
                  <div className="my-position-loading"><LoadingActivity width={20} /></div>
                </OverlayView>
              )
            }
            {
              routes && !showDrivingRoutes && <Polyline path={routes} options={routeOptions} />
            }
            {
              routes && !showDrivingRoutes && (
                <Marker
                  position={{
                    ...drivingRouteStart,
                  }}
                />
              )
            }
            {
              routes && !showDrivingRoutes && (
                <Marker
                  position={{
                    ...drivingRouteEnd,
                  }}
                />
              )
            }
            {bounds && (
              <HomeDrivingRoutes showDrivingRoutes={showDrivingRoutes} />
            )}
            {map && map.getBounds() && map.getZoom() && (
              <ClusterMarkers
                mapChanges={mapChanges}
                mapRef={map}
                items={mapResultList}
                onTapPin={onClickPin}
              />
            )}
          </Fragment>
        )}
        {searchMode !== 'address' && (
          <Fragment>
            {mapSearchItems.map((item) => (
              <OverlayView
                key={item.address1}
                position={{
                  lat: item.location_latitude,
                  lng: item.location_longitude,
                }}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
              >
                <MapPin property={item} onClickPin={() => onClickPin(item)} />
              </OverlayView>
            ))}
          </Fragment>
        )}

        <StreetView
          mainMap={map}
          showStreetView={showStreetView}
          setShowStreetView={setShowStreetView}
          selectedLat={selectedLat}
          selectedLng={selectedLng}
          mapResult={mapResult}
          mapSearchItems={mapSearchItems}
          onClick={findProperty}
          addressPin={addressPin}
          removePin={removePin}
          streetviewPosition={streetviewPosition}
          tracking={tracking}
          setTracking={setTracking}
        />
        {dragging
          && (
            <Fragment>
              <OverlayView
                position={streetviewPosition}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
              >
                <FaStreetView className="drag-position" />
              </OverlayView>
              <Circle
                className="area-circle"
                options={{
                  center: streetviewPosition,
                  strokeColor: '#0000FF',
                  strokeOpacity: 0.8,
                  strokeWeight: 1,
                  fillOpacity: 0,
                  radius: 3,
                  zIndex: 1,
                  draggable: true,
                }}
              />
            </Fragment>
          )
        }
        {showContext && (
          <OverlayView
            position={streetviewPosition}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <MapContextMenu
              items={contextMenu.items}
              onClickItem={onContextClick}
            />
          </OverlayView>
        )}
      </GoogleMap>
      {(mapLoading || addressLoading) && (
        <div className="map-loading">
          <div>Loading Properties...</div>
        </div>
      )}
      {(mapSearchLoading || saveSearchedLoaing) && (
        <div className="map-search-loading"><LoadingActivity color="white" width={40} /></div>
      )}
      <Modal
        isOpen={showSearchSave}
        onRequestClose={closeSearchSaveModal}
        style={mapTypeViewModalStyles}
        ariaHideApp={false}
        bodyOpenClassName={theme.theme}
      >
        <SearchSaveOptions
          onClickItem={onClickPin}
          close={
            (folderId, selectedProperties) => closeSearchSaveModal(folderId, selectedProperties)}
        />
      </Modal>
      <Modal
        isOpen={showMapType}
        onAfterOpen={afterOpenMapTypeModal}
        onRequestClose={closeMapTypeModal}
        style={mapOptionModalStyle}
        ariaHideApp={false}
        bodyOpenClassName={theme.theme}
      >
        <MapOptions
          setMapType={setGoogleMapType}
          type={mapType}
          showDrivingRoutes={showDrivingRoutes}
          setShowDrivingRoutes={setShowDrivingRoutes}
        />
      </Modal>
      <Modal
        isOpen={showMapFilter}
        onAfterOpen={afterOpenMapTypeModal}
        onRequestClose={closeMapFilterModal}
        style={mapTypeViewModalStyles}
        ariaHideApp={false}
        bodyOpenClassName={theme.theme}
      >
        <MapFilter close={applyNewFilter} />
      </Modal>
    </div>
  )
})

export default connect(mapStateToProps, mapDispatchToProps)(MyMap)
