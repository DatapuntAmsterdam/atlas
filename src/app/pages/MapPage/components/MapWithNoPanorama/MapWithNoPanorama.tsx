import { constants, Map as MapComponent, Scale, useStateRef } from '@amsterdam/arm-core'
import type { FunctionComponent } from 'react'
import { useCallback } from 'react'
import useParam from '../../../../utils/useParam'
import { centerParam, zoomParam } from '../../query-params'
import { useIsEmbedded } from '../../../../contexts/ui'
import LeafletLayers from '../../LeafletLayers'
import MapPanel from '../MapPanel'
import MapMarker from '../MapMarker'

const { DEFAULT_AMSTERDAM_MAPS_OPTIONS } = constants

interface MapWithNoPanoramaProps {
  drawToolLocked: boolean
}

const MapWithNoPanorama: FunctionComponent<MapWithNoPanoramaProps> = ({ drawToolLocked }) => {
  const [, setMapInstance, mapInstanceRef] = useStateRef<L.Map | null>(null)
  const [center, setCenter] = useParam(centerParam)
  const [zoom, setZoom] = useParam(zoomParam)
  const isEmbedded = useIsEmbedded()

  return (
    <MapComponent
      setInstance={setMapInstance}
      options={{
        ...DEFAULT_AMSTERDAM_MAPS_OPTIONS,
        zoom: zoom ?? DEFAULT_AMSTERDAM_MAPS_OPTIONS.zoom,
        center: center ?? DEFAULT_AMSTERDAM_MAPS_OPTIONS.center,
        attributionControl: false,
        minZoom: 7,
        scrollWheelZoom: !isEmbedded,
      }}
      events={{
        zoomend: useCallback(() => {
          if (mapInstanceRef?.current) {
            setZoom(mapInstanceRef.current.getZoom(), 'replace')
          }
        }, [mapInstanceRef, setZoom]),
        moveend: useCallback(() => {
          if (mapInstanceRef?.current) {
            setCenter(mapInstanceRef.current.getCenter(), 'replace')
          }
        }, [mapInstanceRef, setCenter]),
      }}
    >
      <LeafletLayers />

      <>
        {!drawToolLocked && <MapMarker panoActive={false} />}
        <MapPanel />
        <Scale
          options={{
            position: 'bottomright',
            metric: true,
            imperial: false,
          }}
        />
      </>
    </MapComponent>
  )
}

export default MapWithNoPanorama
