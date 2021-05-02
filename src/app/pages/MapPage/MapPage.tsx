import { constants, Map as MapComponent, useStateRef } from '@amsterdam/arm-core'
import L from 'leaflet'
import { FunctionComponent, useCallback, useEffect } from 'react'
import styled, { createGlobalStyle, css } from 'styled-components'
import PanoramaViewer from '../../components/PanoramaViewer/PanoramaViewer'
import useParam from '../../utils/useParam'
import LeafletLayers from './LeafletLayers'
import { useMapContext } from './MapContext'
import MapMarkers from './MapMarkers'
import {
  centerParam,
  drawToolOpenParam,
  locationParam,
  panoHeadingParam,
  panoPitchParam,
  polygonParam,
  polylineParam,
  zoomParam,
} from './query-params'
import MapPanel from './components/MapPanel'
import DataSelectionProvider from './components/DrawTool/DataSelectionProvider'

const MapView = styled.div`
  height: 100%;
  position: relative;
  z-index: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  @media print {
    overflow: scroll;
  }
`

const GlobalStyle = createGlobalStyle<{
  panoActive?: boolean
  panoFullScreen: boolean
}>`
  body {
    touch-action: none;
    overflow: hidden; // This will prevent the scrollBar on iOS due to navigation bar
    @media print {
      overflow: auto;
    }
  }

  // Need to set the styled globally and not as a Styled Component as this will cause problems with leaflet calculating the map canvas / dimensions
  .leaflet-container {
    position: sticky !important;
    height: ${({ panoActive }) => (panoActive ? '50%' : '100%')};
    @media print {
      min-height: 100vh;
      page-break-after: always;
    }

    ${({ panoFullScreen }) =>
      panoFullScreen &&
      css`
        display: none;
      `}
  }
`

const { DEFAULT_AMSTERDAM_MAPS_OPTIONS } = constants

const MapPage: FunctionComponent = () => {
  const { panoFullScreen } = useMapContext()
  const [, setMapInstance, mapInstanceRef] = useStateRef<L.Map | null>(null)
  const [center, setCenter] = useParam(centerParam)
  const [zoom, setZoom] = useParam(zoomParam)
  const [location] = useParam(locationParam)
  const [panoPitch] = useParam(panoPitchParam)
  const [panoHeading] = useParam(panoHeadingParam)
  const [polygon] = useParam(polygonParam)
  const [polyline] = useParam(polylineParam)
  const [, setShowDrawTool] = useParam(drawToolOpenParam)

  const panoActive = panoHeading !== null && location !== null

  // This is necessary to call, because we resize the map dynamically
  // https://leafletjs.com/reference-1.7.1.html#map-invalidatesize
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.invalidateSize()
    }
  }, [panoFullScreen, panoPitch, mapInstanceRef])

  useEffect(() => {
    mapInstanceRef.current?.setZoom(zoom)
  }, [zoom])

  useEffect(() => {
    if (polygon || polyline) {
      setShowDrawTool(true, 'replace')
    }
  }, [polygon, polyline])

  return (
    <MapView>
      <GlobalStyle panoActive={panoActive} panoFullScreen={panoFullScreen} />
      <MapComponent
        setInstance={setMapInstance}
        options={{
          ...DEFAULT_AMSTERDAM_MAPS_OPTIONS,
          zoom: zoom ?? DEFAULT_AMSTERDAM_MAPS_OPTIONS.zoom,
          center: center ?? DEFAULT_AMSTERDAM_MAPS_OPTIONS.center,
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
        <DataSelectionProvider>
          <LeafletLayers />

          {panoActive && <PanoramaViewer />}
          <MapMarkers panoActive={panoActive} />
          <MapPanel />
        </DataSelectionProvider>
      </MapComponent>
    </MapView>
  )
}

export default MapPage
