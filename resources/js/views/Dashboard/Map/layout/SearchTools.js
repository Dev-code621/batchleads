import React, { useState, useEffect, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { StandaloneSearchBox, DrawingManager } from '@react-google-maps/api'
import { FiFilter, FiSearch } from 'react-icons/fi'
import { AiOutlineCloseCircle } from 'react-icons/ai'

import SearchFilterModal from './SearchFilterModal'
import { useThemeState } from '~common/theme-context'

import { getMapSearch, initMapSearch, updateMapOption } from '~redux/modules/property'
import { searchFilterSelector, mapSearchResultSelector } from '~redux/selectors/propertySelector'
import SearchModeSelector from './SearchModeSelector'

let drawingManager = null

export default ({
  type, mapRef, onLoadSearchBox, onPlacesChanged,
  setShowMapFilter, showFilter, onCloseFilter,
}) => {
  const dispatch = useDispatch();
  const filter = useSelector(searchFilterSelector)
  const theme = useThemeState()
  const {
    success, items, loading,
  } = useSelector(mapSearchResultSelector)
  const [searchKey, setSearchKey] = useState('')
  const [drawMode, setDrawMode] = useState('hand')
  const [filterToggle, setFilterToggle] = useState(false)
  const [shapeArray, setShapeArray] = useState([])

  useEffect(() => {
    dispatch(initMapSearch(type))
  }, [])

  useEffect(() => {
    setFilterToggle(showFilter)
  }, [showFilter])

  useEffect(() => {
    if (items.length > 0 && mapRef && !loading && success) {
      mapRef.panTo({
        lat: items[0].location_latitude,
        lng: items[0].location_longitude,
      })
    }
  }, [success, loading])

  const removeShapes = () => {
    shapeArray.forEach((item) => {
      item.setMap(null)
    })
    if (!drawingManager) {
      return
    }
    drawingManager.setDrawingMode(null);
    setDrawMode('hand')
    setShapeArray([])
    dispatch(initMapSearch('region'))
  }

  useEffect(() => {
    dispatch(initMapSearch(type))
    removeShapes()
  }, [type])

  const searchRegion = () => {
    if (shapeArray.length < 1) {
      return
    }
    const shape = shapeArray[0]
    let coords = []
    if (typeof shape.getBounds === 'function') {
      const bounds = shape.getBounds()
      coords = [
        { lat: bounds.getNorthEast().lat(), lon: bounds.getNorthEast().lng() },
        { lat: bounds.getSouthWest().lat(), lon: bounds.getNorthEast().lng() },
        { lat: bounds.getSouthWest().lat(), lon: bounds.getSouthWest().lng() },
        { lat: bounds.getNorthEast().lat(), lon: bounds.getSouthWest().lng() },
      ]
    }
    if (typeof shape.getPath === 'function') {
      coords = shape.getPath().getArray().map((polygon) => ({
        lat: polygon.lat(),
        lon: polygon.lng(),
      }))
    }
    dispatch(getMapSearch(1, 'region', coords, filter.region))
  }

  const onClickFilter = (flag) => {
    if (type === 'address') {
      setShowMapFilter(flag)
    } else {
      setFilterToggle(true)
    }
  }

  const onClickSearch = () => {
    if (type === 'region') {
      searchRegion()
    }
  }

  const onClickDrawMode = (mode) => {
    setDrawMode(mode)
    if (!drawingManager) {
      return;
    }
    if (mode === 'hand') {
      // eslint-disable-next-line no-undef
      drawingManager.setDrawingMode(null);
    } else if (mode === 'poly') {
      // eslint-disable-next-line no-undef
      drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
    } else if (mode === 'rect') {
      // eslint-disable-next-line no-undef
      drawingManager.setDrawingMode(google.maps.drawing.OverlayType.RECTANGLE);
    }
  }

  const onPolygonComplete = (polygon) => {
    removeShapes()
    polygon.setEditable(true)
    setShapeArray([...shapeArray, polygon])
    drawingManager.setDrawingMode(null);
  }
  const onRectangleComplete = (rect) => {
    removeShapes()
    rect.setEditable(true)
    setShapeArray([...shapeArray, rect])
    drawingManager.setDrawingMode(null);
  }

  useEffect(() => {
    if (shapeArray.length > 0 && !loading && !success && type === 'region') {
      onClickFilter();
      onClickSearch();
    }
  }, [shapeArray, filter.region, loading, success, type])

  const onLoadManager = (manager) => {
    drawingManager = manager
  }

  const clearKey = () => {
    const el = document.getElementById('place-search-input')
    if (el) {
      el.value = ''
      el.focus()
    }
    setSearchKey('')
    removeShapes()
    if (type !== 'region') {
      dispatch(updateMapOption({ type: 'address' }))
    }
  }

  const closeFilter = (status) => {
    onCloseFilter(status)
    setFilterToggle(status)
  }

  const polyOptions = theme.theme === 'theme-dark'
    ? {
      editable: true,
      fillColor: '#F7775B',
      strokeColor: '#F7775B',
      fillOpacity: 0.3,
      strokeOpacity: 0.3,
    }
    : {
      editable: true,
    }

  return (
    <div className={`map-search-tool-container ${theme.theme}`}>
      {type !== 'region' && (
        <StandaloneSearchBox onLoad={onLoadSearchBox} onPlacesChanged={onPlacesChanged}>
          <input
            type="text"
            id="place-search-input"
            onChange={(e) => setSearchKey(e.target.value)}
            placeholder="Search address, city, zip, county..."
            className="map-search-input"
          />
        </StandaloneSearchBox>
      )}
      {type === 'region' && (
        <div className="map-search-input drawing-container">
          {drawingManager && (
            <Fragment>
              <div className={`draw-tool${drawMode === 'hand' ? ' active' : ''}`} onClick={() => onClickDrawMode('hand')}>
                <svg width="30" height="34" viewBox="0 0 30 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M29.3718 8.52139C29.375 7.99358 29.2437 7.47366 28.9904 7.01059C28.7371 6.54751 28.3701 6.15653 27.9239 5.87445C27.4778 5.59237 26.9672 5.42848 26.4403 5.3982C25.9133 5.36793 25.3873 5.47226 24.9118 5.70139C24.8804 5.16986 24.7165 4.65464 24.4349 4.20271C24.1533 3.75079 23.7631 3.37653 23.2998 3.11407C22.8365 2.85161 22.3149 2.70929 21.7825 2.70009C21.2501 2.69089 20.7239 2.8151 20.2518 3.06139C20.1986 2.29702 19.8802 1.57519 19.3517 1.02047C18.8231 0.465738 18.1175 0.112897 17.3566 0.0228194C16.5957 -0.0672579 15.8272 0.111079 15.1837 0.52706C14.5402 0.943041 14.0621 1.57058 13.8318 2.30139C13.3304 2.00062 12.7566 1.84163 12.1718 1.84139C11.7416 1.8427 11.3158 1.92891 10.9189 2.09508C10.522 2.26125 10.1618 2.50412 9.85898 2.80975C9.55613 3.11539 9.31658 3.47779 9.15405 3.87619C8.99152 4.27458 8.90921 4.70113 8.91185 5.13139V17.7914C7.63185 16.1914 6.38185 14.6114 6.19185 14.3414C5.90265 13.8822 5.50107 13.5043 5.02511 13.2436C4.54914 12.9829 4.01453 12.8479 3.47185 12.8514C3.01154 12.8375 2.55326 12.9181 2.1253 13.0881C1.69735 13.2582 1.30879 13.5142 0.983624 13.8403C0.658457 14.1664 0.403577 14.5557 0.234718 14.9842C0.0658589 15.4126 -0.0133957 15.8711 0.00184647 16.3314C0.0918465 18.1314 3.57185 24.4914 5.91185 27.9514C9.45185 33.1914 12.8318 33.9514 12.9818 33.9514H23.5018C23.7009 33.9492 23.8939 33.8826 24.0518 33.7614C25.8476 32.1065 27.1462 29.9837 27.8018 27.6314C28.8018 24.5414 29.3318 20.1014 29.3818 14.0714L29.3718 8.52139ZM26.0918 27.0714C25.5303 28.9747 24.5224 30.7163 23.1518 32.1514H13.2418C12.7718 32.0114 10.1718 31.0514 7.37185 26.9014C4.57185 22.7514 1.85185 17.2214 1.80185 16.2414C1.79379 16.0321 1.82967 15.8234 1.90717 15.6287C1.98468 15.4341 2.10209 15.2579 2.25185 15.1114C2.39936 14.9596 2.57696 14.8402 2.77327 14.761C2.96958 14.6818 3.18027 14.6445 3.39185 14.6514C3.65602 14.636 3.91927 14.6942 4.15232 14.8196C4.38537 14.9449 4.57906 15.1325 4.71185 15.3614C5.00185 15.7914 7.07185 18.3614 8.28185 19.8914L10.7118 18.2514V5.13139C10.695 4.92748 10.7207 4.7223 10.7872 4.52881C10.8537 4.33532 10.9596 4.15772 11.0982 4.00722C11.2368 3.85672 11.4051 3.7366 11.5925 3.65443C11.7799 3.57226 11.9822 3.52984 12.1868 3.52984C12.3914 3.52984 12.5938 3.57226 12.7812 3.65443C12.9686 3.7366 13.1369 3.85672 13.2755 4.00722C13.4141 4.15772 13.52 4.33532 13.5865 4.52881C13.653 4.7223 13.6786 4.92748 13.6618 5.13139V16.2714H15.4618V3.27139C15.5044 2.90341 15.6807 2.56391 15.9573 2.31748C16.2339 2.07105 16.5914 1.93489 16.9618 1.93489C17.3323 1.93489 17.6898 2.07105 17.9664 2.31748C18.2429 2.56391 18.4193 2.90341 18.4618 3.27139V16.4014H20.2618V5.95139C20.2453 5.75423 20.2699 5.55577 20.334 5.36858C20.3981 5.1814 20.5004 5.00955 20.6343 4.86392C20.7682 4.71828 20.9309 4.60202 21.1121 4.5225C21.2933 4.44298 21.489 4.40192 21.6868 4.40192C21.8847 4.40192 22.0804 4.44298 22.2616 4.5225C22.4428 4.60202 22.6055 4.71828 22.7394 4.86392C22.8733 5.00955 22.9756 5.1814 23.0397 5.36858C23.1038 5.55577 23.1284 5.75423 23.1118 5.95139V17.3914H24.9118V8.49139C24.9407 8.15985 25.0928 7.85117 25.3381 7.62627C25.5834 7.40137 25.9041 7.27661 26.2368 7.27661C26.5696 7.27661 26.8903 7.40137 27.1356 7.62627C27.3809 7.85117 27.533 8.15985 27.5618 8.49139V14.0414C27.5318 19.9514 27.0518 24.1614 26.0918 27.0714Z" />
                </svg>
              </div>
              <div className={`draw-tool${drawMode === 'poly' ? ' active' : ''}`} onClick={() => onClickDrawMode('poly')}>
                <svg width="30" height="29" viewBox="0 0 30 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.5169 19.5971L23.6097 19.69L23.7389 19.6662C24.0101 19.6163 24.2761 19.5833 24.5508 19.5833C27.0776 19.5833 29.1328 21.6399 29.1328 24.1667C29.1328 26.6933 27.0762 28.7499 24.5494 28.75C23.605 28.747 22.6847 28.4517 21.9149 27.9048C21.1448 27.3577 20.5631 26.5857 20.2495 25.6948L20.1907 25.5278H20.0137H9.75194H9.57486L9.5161 25.6948C9.20271 26.5859 8.62101 27.358 7.85097 27.9051C7.0811 28.452 6.16075 28.7472 5.21636 28.75C2.68966 28.75 0.633046 26.6936 0.632813 24.1671C0.636151 23.2226 0.93154 22.3022 1.4785 21.5321C2.02554 20.7619 2.79744 20.1798 3.68837 19.8655L3.85521 19.8067V19.6298V9.36861V9.19234L3.68918 9.13313C1.91293 8.49978 0.632812 6.81988 0.632812 4.83333C0.632812 2.30664 2.68955 0.25 5.21641 0.25C7.74328 0.25 9.80002 2.30664 9.80002 4.83333C9.80002 5.1066 9.76698 5.37578 9.71718 5.64497L9.69327 5.77426L9.78624 5.86723L23.5169 19.5971ZM6.57761 19.6298V19.8061L6.74376 19.8653C7.38308 20.0929 7.96364 20.4601 8.44324 20.9402C8.92284 21.4203 9.28942 22.0012 9.51634 22.6408L9.57538 22.8072H9.75194H20.0153H20.1916L20.2508 22.6411C20.4277 22.1444 20.6902 21.6825 21.0264 21.2762L21.1714 21.1009L21.0106 20.9401L8.4448 8.375L8.28476 8.21496L8.10964 8.35835C7.70395 8.69054 7.24546 8.95477 6.74322 9.1349L6.57761 9.19429V9.37022V19.6298ZM5.20524 26.0275L5.21641 26.028L5.22759 26.0275C5.70674 26.0061 6.15916 25.8007 6.49065 25.4541C6.82214 25.1074 7.00715 24.6463 7.00715 24.1667C7.00715 23.687 6.82214 23.2259 6.49065 22.8793C6.15916 22.5327 5.70674 22.3272 5.22758 22.3058L5.21641 22.3053L5.20524 22.3058C4.72609 22.3272 4.27367 22.5327 3.94218 22.8793C3.61068 23.2259 3.42568 23.687 3.42568 24.1667C3.42568 24.6463 3.61068 25.1074 3.94218 25.4541C4.27367 25.8007 4.72609 26.0061 5.20524 26.0275ZM24.5396 26.0275L24.5508 26.028L24.562 26.0275C25.0411 26.0061 25.4936 25.8007 25.8251 25.4541C26.1566 25.1074 26.3416 24.6463 26.3416 24.1667C26.3416 23.687 26.1566 23.2259 25.8251 22.8793C25.4936 22.5327 25.0411 22.3272 24.562 22.3058L24.5508 22.3053L24.5397 22.3058C24.0605 22.3272 23.6081 22.5327 23.2766 22.8793C22.9451 23.2259 22.7601 23.687 22.7601 24.1667C22.7601 24.6463 22.9451 25.1074 23.2766 25.4541C23.6081 25.8007 24.0605 26.0061 24.5396 26.0275ZM6.25178 3.28537C5.94523 3.08088 5.58491 2.9719 5.21641 2.97222L3.60521 4.83333L3.35521 4.83308C3.35521 4.83317 3.35521 4.83325 3.35521 4.83333C3.35489 5.20182 3.46388 5.56212 3.66838 5.86866C3.87293 6.17527 4.16384 6.41431 4.5043 6.55552C4.84476 6.69673 5.21946 6.73378 5.58098 6.66197C5.9425 6.59015 6.27459 6.41271 6.53523 6.15209C6.79586 5.89147 6.97331 5.5594 7.04513 5.19789C7.11695 4.83638 7.0799 4.46169 6.93868 4.12125C6.79746 3.7808 6.5584 3.4899 6.25178 3.28537Z" />
                </svg>
              </div>
              <div className={`draw-tool${drawMode === 'rect' ? ' active' : ''}`} onClick={() => onClickDrawMode('rect')}>
                <svg width="30" height="29" viewBox="0 0 30 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24.5495 2.97222C24.918 2.9719 25.2783 3.08088 25.5848 3.28537C25.8914 3.48991 26.1304 3.78081 26.2717 4.12125C26.4129 4.4617 26.4499 4.83638 26.3781 5.19789C26.3063 5.55939 26.1289 5.89147 25.8682 6.15209C25.6076 6.41271 25.2755 6.59015 24.914 6.66197C24.5525 6.73378 24.1778 6.69673 23.8374 6.55552C23.497 6.4143 23.2061 6.17527 23.0015 5.86866C22.797 5.56205 22.688 5.20165 22.6884 4.83308M24.5495 2.97222C23.522 2.97222 22.6885 3.80757 22.6884 4.83308M24.5495 2.97222V3.22222M24.5495 2.97222V3.22222M24.5495 2.97222C24.5494 2.97222 24.5493 2.97222 24.5492 2.97222L24.5495 3.22222M24.5495 2.97222V3.22222M22.6884 4.83308L22.9384 4.83333H22.6884C22.6884 4.83325 22.6884 4.83317 22.6884 4.83308ZM20.0142 3.47222H20.1913L20.25 3.30517C20.5634 2.4141 21.1451 1.64198 21.9151 1.0949C22.685 0.5479 23.6054 0.252748 24.5498 0.25C27.0763 0.25019 29.1327 2.3066 29.1328 4.83307C29.1296 5.77776 28.8341 6.69831 28.2868 7.4684C27.7395 8.23864 26.9672 8.82061 26.076 9.13441L25.909 9.1932V9.37022V19.6298V19.8067L26.0758 19.8655C26.9667 20.1798 27.7385 20.7619 28.2856 21.5321C28.8325 22.3022 29.1278 23.2225 29.1312 24.167C29.131 26.6935 27.0746 28.7499 24.548 28.75C23.6037 28.747 22.6835 28.4517 21.9137 27.9048C21.1437 27.3578 20.562 26.5857 20.2484 25.6948L20.1896 25.5278H20.0126H9.75142H9.57434L9.51558 25.6948C9.20221 26.5859 8.62054 27.358 7.85054 27.9051C7.08071 28.452 6.16042 28.7472 5.21609 28.75C2.68955 28.75 0.633046 26.6936 0.632813 24.1671C0.636151 23.2226 0.931525 22.3022 1.47845 21.5321C2.02546 20.7619 2.79732 20.1798 3.6882 19.8655L3.85503 19.8067V19.6298V9.36861V9.19234L3.689 9.13313C1.91286 8.49978 0.632812 6.81989 0.632812 4.83333C0.632812 2.30675 2.68925 0.250193 5.21579 0.25C6.16022 0.252748 7.08063 0.5479 7.85054 1.0949C8.62054 1.64198 9.20221 2.4141 9.51558 3.30516L9.57434 3.47222H9.75142H20.0142ZM20.0142 22.8056H20.1907L20.2498 22.6392C20.4769 22 20.8435 21.4194 21.3231 20.9395C21.8026 20.4597 22.3831 20.0928 23.0222 19.8653L23.1884 19.8062V19.6298V9.36861V9.19212L23.0221 9.13303C22.3828 8.90594 21.8022 8.53929 21.3224 8.05973C20.8425 7.58017 20.4756 6.99975 20.2481 6.36062L20.189 6.19444H20.0126H9.75142H9.57493L9.51585 6.36075C9.28875 7 8.9221 7.58063 8.44254 8.06045C7.96298 8.54028 7.38256 8.90724 6.74344 9.13469L6.57726 9.19383V9.37022V19.6298V19.8062L6.74344 19.8653C7.38256 20.0928 7.96298 20.4597 8.44254 20.9395C8.9221 21.4194 9.28875 22 9.51585 22.6392L9.57493 22.8056H9.75142H20.0142ZM5.20497 26.0275L5.21615 26.028L5.22732 26.0275C5.70645 26.0061 6.15885 25.8007 6.49033 25.454C6.8218 25.1074 7.0068 24.6463 7.0068 24.1667C7.0068 23.6871 6.8218 23.2259 6.49033 22.8793C6.15886 22.5327 5.70645 22.3272 5.22732 22.3058L5.21615 22.3053L5.20498 22.3058C4.72584 22.3272 4.27344 22.5327 3.94196 22.8793C3.61049 23.2259 3.42549 23.6871 3.42549 24.1667C3.42549 24.6463 3.61049 25.1074 3.94196 25.454C4.27344 25.8007 4.72584 26.0061 5.20497 26.0275ZM24.5383 26.0275L24.5495 26.028L24.5607 26.0275C25.0398 26.0061 25.4922 25.8007 25.8237 25.454C26.1551 25.1074 26.3401 24.6463 26.3401 24.1667C26.3401 23.6871 26.1551 23.2259 25.8237 22.8793C25.4922 22.5327 25.0398 22.3272 24.5607 22.3058L24.5495 22.3053L24.5383 22.3058C24.0592 22.3272 23.6068 22.5327 23.2753 22.8793C22.9438 23.2259 22.7588 23.6871 22.7588 24.1667C22.7588 24.6463 22.9438 25.1074 23.2753 25.454C23.6068 25.8007 24.0592 26.0061 24.5383 26.0275ZM6.25147 3.28537C5.94493 3.08088 5.58463 2.9719 5.21615 2.97222L3.60503 4.83333L3.35504 4.83308C3.35504 4.83317 3.35503 4.83325 3.35503 4.83333C3.35472 5.20182 3.46369 5.56212 3.66818 5.86866C3.87272 6.17526 4.16362 6.4143 4.50406 6.55552C4.84451 6.69673 5.21919 6.73378 5.5807 6.66196C5.9422 6.59015 6.27428 6.41271 6.5349 6.15209C6.79552 5.89147 6.97296 5.55939 7.04478 5.19789C7.11659 4.83638 7.07955 4.4617 6.93833 4.12125C6.79712 3.78081 6.55808 3.48991 6.25147 3.28537Z" />
                </svg>
              </div>
            </Fragment>
          )}
        </div>
      )}
      {(searchKey || shapeArray.length > 0) && (
        <AiOutlineCloseCircle size={25} color="#454545" className="close-icon" onClick={clearKey} />
      )}
      {type === 'region' && (
        <div className="search-button-container" onClick={onClickSearch}>
          <FiSearch className="filter-icon" />
        </div>
      )}
      <div className={`property-filter-container${type !== 'region' ? ' location-mode' : ''}`} onClick={() => onClickFilter(true)}>
        <FiFilter className="filter-icon" />
      </div>
      <SearchModeSelector />
      {type !== 'address'
      && (
        <SearchFilterModal
          type={type}
          toggle={filterToggle}
          onClose={() => closeFilter(false)}
          bodyOpenClassName={theme.theme}
        />
      )
      }
      <DrawingManager
        onLoad={onLoadManager}
        onUnmount={removeShapes}
        options={{
          drawingControlOptions: {
            drawingModes: [],
            drawingControl: true,
          },
          polygonOptions: polyOptions,
          rectangleOptions: polyOptions,
        }}
        onPolygonComplete={onPolygonComplete}
        onRectangleComplete={onRectangleComplete}
      />
    </div>
  )
}
