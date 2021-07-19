import { constants, Map as MapComponent, Scale, useStateRef } from '@amsterdam/arm-core'
import type { FunctionComponent } from 'react'
import { useCallback, useEffect } from 'react'
import type { Theme } from '@amsterdam/asc-ui'
import { themeSpacing } from '@amsterdam/asc-ui'
import styled, { createGlobalStyle, css } from 'styled-components'
import type L from 'leaflet'
import PanoramaViewer from './components/PanoramaViewer/PanoramaViewer'
import useParam from '../../utils/useParam'
import LeafletLayers from './LeafletLayers'
import { useMapContext } from './MapContext'
import MapMarker from './components/MapMarker'
import { centerParam, panoPitchParam, zoomParam } from './query-params'
import MapPanel from './components/MapPanel'
import { useDataSelection } from '../../components/DataSelection/DataSelectionContext'
import { useIsEmbedded } from '../../contexts/ui'

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
  theme: Theme.ThemeInterface
  loading: boolean
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
    cursor: default;
    height: ${({ panoActive }) => (panoActive ? '50%' : '100%')};
    ${({ panoActive }) =>
      panoActive &&
      css`
        border-top: 2px solid;
      `};

    @media print {
      min-height: 100vh;
      page-break-after: always;
    }

    ${({ loading }) =>
      loading &&
      css`
        cursor: progress;
      `}

    ${({ panoFullScreen }) =>
      panoFullScreen &&
      css`
        display: none;
      `}
  }
  .leaflet-control-container .leaflet-control-scale {
    margin: ${themeSpacing(0, 16, 4, 0)} !important;
  }
`

const { DEFAULT_AMSTERDAM_MAPS_OPTIONS } = constants

const MapPage: FunctionComponent = () => {
  const { panoFullScreen, loading, panoActive } = useMapContext()
  const { drawToolLocked } = useDataSelection()
  const [, setMapInstance, mapInstanceRef] = useStateRef<L.Map | null>(null)
  const [center, setCenter] = useParam(centerParam)
  const [zoom, setZoom] = useParam(zoomParam)
  const [panoPitch] = useParam(panoPitchParam)
  const isEmbedded = useIsEmbedded()

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

  return (
    <MapView>
      <GlobalStyle loading={loading} panoActive={panoActive} panoFullScreen={panoFullScreen} />
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

        {panoActive && <PanoramaViewer />}
        {!drawToolLocked && <MapMarker panoActive={panoActive} />}
        <MapPanel />
        <Scale
          options={{
            position: 'bottomright',
            metric: true,
            imperial: false,
          }}
        />
      </MapComponent>
    </MapView>
  )
}

export default MapPage
