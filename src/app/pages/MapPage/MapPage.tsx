import { useStateRef } from '@amsterdam/arm-core'
import type { FunctionComponent } from 'react'
import { useEffect } from 'react'
import type { Theme } from '@amsterdam/asc-ui'
import { Alert, Link, Paragraph, themeSpacing } from '@amsterdam/asc-ui'
import { Link as RouterLink } from 'react-router-dom'
import styled, { createGlobalStyle, css } from 'styled-components'
import type L from 'leaflet'
import useParam from '../../utils/useParam'
import { useMapContext } from './MapContext'
import { panoPitchParam, zoomParam } from './query-params'
import { useDataSelection } from '../../components/DataSelection/DataSelectionContext'
import { createCookie, getCookie } from '../../../shared/services/cookie/cookie'
import { toBedieningPage } from '../../links'

import MapPanoramaFullScreen from './components/MapPanoramaFullScreen'
import MapPanoramaMinimized from './components/MapPanoramaMinimized'

import MapWithNoPanorama from './components/MapWithNoPanorama'
// import MapWrapper from './components/MapWrapper'

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
    height: 100%;
    width: 100%;

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

    ${({ panoFullScreen, panoActive }) =>
      !panoFullScreen &&
      panoActive &&
      css`
        height: 50%;
      `}
  }
  .leaflet-control-container .leaflet-control-scale {
    margin: ${themeSpacing(0, 16, 4, 0)} !important;
  }
`

// const { DEFAULT_AMSTERDAM_MAPS_OPTIONS } = constants

const ALERT_COOKIE = 'map-update-alert-dismissed'

const MapPage: FunctionComponent = () => {
  const { panoFullScreen, setPanoFullScreen, loading, panoActive } = useMapContext()
  const { drawToolLocked } = useDataSelection()
  // const [, setMapInstance, mapInstanceRef] = useStateRef<L.Map | null>(null)
  const [, , mapInstanceRef] = useStateRef<L.Map | null>(null)
  // const [center, setCenter] = useParam(centerParam)
  // const [zoom, setZoom] = useParam(zoomParam)
  const [zoom] = useParam(zoomParam)
  const [panoPitch] = useParam(panoPitchParam)
  // const isEmbedded = useIsEmbedded()

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
    <>
      {/* Hide alert for 30 days after dismissing the alert */}
      {!getCookie(ALERT_COOKIE) && (
        <Alert level="warning" dismissible onDismiss={() => createCookie(ALERT_COOKIE, '1', 720)}>
          <Paragraph>
            De kaart en de werking van de tekentool zijn vernieuwd. Voor meer info kunt u de{' '}
            <Link as={RouterLink} to={toBedieningPage()}>
              help-pagina
            </Link>{' '}
            raadplegen.
          </Paragraph>
        </Alert>
      )}
      <MapView>
        <GlobalStyle loading={loading} panoActive={panoActive} panoFullScreen={panoFullScreen} />

        {panoActive && panoFullScreen ? (
          <MapPanoramaFullScreen
            panoFullScreen={panoFullScreen}
            setPanoFullScreen={setPanoFullScreen}
          />
        ) : null}

        {panoActive && !panoFullScreen ? (
          <MapPanoramaMinimized drawToolLocked={drawToolLocked} />
        ) : null}

        {!panoActive ? <MapWithNoPanorama drawToolLocked={drawToolLocked} /> : null}
      </MapView>
    </>
  )
}

export default MapPage
