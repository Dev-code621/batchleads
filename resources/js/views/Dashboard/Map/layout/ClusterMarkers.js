import React, {
  useState, useEffect, Fragment,
} from 'react'
import {
  OverlayView,
} from '@react-google-maps/api'
import useSupercluster from 'use-supercluster';
import { MapPin } from '~components/MapPin'

export const ClusterMarkers = React.memo(({
  mapChanges, mapRef, items, onTapPin,
}) => {
  const boundSW = mapRef.getBounds().getSouthWest();
  const boundNE = mapRef.getBounds().getNorthEast();
  const [bounds, setBounds] = useState([
    boundSW.lng(),
    boundSW.lat(),
    boundNE.lng(),
    boundNE.lat(),
  ]);
  const [zoom, setZoom] = useState(mapRef.getZoom());

  useEffect(() => {
    setBounds([
      boundSW.lng(),
      boundSW.lat(),
      boundNE.lng(),
      boundNE.lat(),
    ])
    setZoom(mapRef.getZoom())
  }, [mapChanges])

  const points = items.map((property) => ({
    type: 'Feature',
    properties: { cluster: false, property, category: property.id },
    geometry: {
      type: 'Point',
      coordinates: [
        parseFloat(property.location_longitude),
        parseFloat(property.location_latitude),
      ],
    },
  }));

  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom,
    options: { radius: 150, maxZoom: 18 },
  });
  return (
    <Fragment>
      {clusters.map((cluster) => {
        const [longitude, latitude] = cluster.geometry.coordinates;
        const {
          cluster: isCluster,
          point_count: pointCount,
          property,
        } = cluster.properties;

        if (isCluster) {
          return (
            <OverlayView
              key={`cluster-${cluster.id}`}
              position={{
                lat: latitude,
                lng: longitude,
              }}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
              <div
                className="cluster-marker"
                ref={(ref) => ref && google.maps.OverlayView.preventMapHitsFrom(ref)}
                style={{
                  backgroundColor: pointCount > 100 ? '#f6775b' : '#3683bc',
                  width: pointCount > 100 ? 50 : 40,
                  height: pointCount > 100 ? 50 : 40,
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const expansionZoom = Math.min(
                    supercluster.getClusterExpansionZoom(cluster.id),
                    20
                  );
                  mapRef.setZoom(expansionZoom);
                  mapRef.panTo({ lat: latitude, lng: longitude });
                }}
              >
                <div>{pointCount}</div>
              </div>
            </OverlayView>
          );
        }

        return (
          <OverlayView
            key={`property-${cluster.properties.property.id}`}
            position={{
              lat: latitude,
              lng: longitude,
            }}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <MapPin property={property} onClickPin={() => onTapPin(property)} />
          </OverlayView>
        );
      })}
    </Fragment>
  )
})
