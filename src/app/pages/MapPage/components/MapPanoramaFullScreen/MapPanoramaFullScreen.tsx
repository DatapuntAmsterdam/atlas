import { constants, ControlButton, Map as MapComponent, useStateRef } from '@amsterdam/arm-core'
import type { FunctionComponent } from 'react'
import { useCallback } from 'react'
import styled from 'styled-components'
import { breakpoint } from '@amsterdam/asc-ui'
import useParam from '../../../../utils/useParam'
import { centerParam, zoomParam } from '../../query-params'
import { useIsEmbedded } from '../../../../contexts/ui'
import PanoramaViewer from '../PanoramaViewer/PanoramaViewer'
import BareBaseLayer from '../BaseLayerToggle/BareBaseLayerToggle/BareBaseLayer'
import Reduce from '../PanoramaViewer/reduce.svg'
import Enlarge from '../PanoramaViewer/enlarge.svg'

import MapPanel from '../MapPanel'

const MapWrapper = styled.div`
  position: absolute;
  bottom: 20px;
  left: 700px; // TODO if sidebar expanded or not - see LargeDrawerPanel.tsx  export const TABLET_M_WIDTH = 356 export const LAPTOP_WIDTH = 596
  width: 310px;
  height: 178px;
  background: #fff;
  border: 1px solid #ccc;
`

const ResizeButton = styled(ControlButton)`
  position: absolute;
  bottom: 15px;
  left: 15px;
  @media screen and ${breakpoint('max-width', 'tabletM')} {
    display: none; // below tabletM is always full screen, so no need to show this button
  }
`

const { DEFAULT_AMSTERDAM_MAPS_OPTIONS } = constants

interface MapPanoramaFullScreenProps {
  panoFullScreen: boolean
  setPanoFullScreen: (panoFullScreen: boolean) => void
}

const MapPanoramaFullScreen: FunctionComponent<MapPanoramaFullScreenProps> = ({
  panoFullScreen,
  setPanoFullScreen,
}) => {
  const [, setMapInstance, mapInstanceRef] = useStateRef<L.Map | null>(null)
  const [center, setCenter] = useParam(centerParam)
  const [zoom, setZoom] = useParam(zoomParam)
  const isEmbedded = useIsEmbedded()

  return (
    <>
      <PanoramaViewer fullScreen />
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
        <MapPanel />
        {/* <LeafletLayers /> */}
        <MapWrapper>
          <BareBaseLayer />
          <ResizeButton
            type="button"
            variant="blank"
            title="Volledig scherm"
            size={44}
            iconSize={40}
            data-testid="panoramaViewerFullscreenButton"
            onClick={() => {
              // TODO trackEvent
              // trackEvent({
              //   ...PANORAMA_FULLSCREEN_TOGGLE,
              //   name: panoFullScreen ? 'klein' : 'volledig',
              // })
              setPanoFullScreen(!panoFullScreen)
            }}
            icon={panoFullScreen ? <Reduce /> : <Enlarge />}
          />
        </MapWrapper>
      </MapComponent>
    </>
  )
}

export default MapPanoramaFullScreen
