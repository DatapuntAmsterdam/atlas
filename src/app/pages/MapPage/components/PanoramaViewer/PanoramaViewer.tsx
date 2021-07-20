import usePromise, { isFulfilled, isPending } from '@amsterdam/use-promise'
import { useMatomo } from '@datapunt/matomo-tracker-react'
import type { FunctionComponent } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { toGeoSearch } from '../../../../links'
import useBuildQueryString from '../../../../utils/useBuildQueryString'
import useMarzipano from '../../../../utils/useMarzipano'
import useParam from '../../../../utils/useParam'
import { useMapContext } from '../../MapContext'
import {
  COORDINATE_PRECISION,
  locationParam,
  panoFovParam,
  panoFullScreenParam,
  panoHeadingParam,
  panoPitchParam,
  panoTagParam,
} from '../../query-params'
import { PANO_LABELS } from './constants'
import { HotspotButton } from './Hotspot'
import { loadScene } from './marzipano/marzipano'
import { getImageDataById, getImageDataByLocation } from './panorama-api/panorama-api'

const MarzipanoView = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
`

const PanoramaStyle = styled.div<{ panoFullScreen: boolean; loading: boolean }>`
  height: ${({ panoFullScreen }) => (panoFullScreen ? '100%' : '50%')};
  position: relative;
  order: -1; // Put the PanoramaViewer above the Map
  ${({ loading }) =>
    loading &&
    css`
      ${HotspotButton},
      canvas + div {
        cursor: progress !important;
      }
    `}
`

export const PANO_LAYERS = [
  'pano-pano2021bi',
  'pano-pano2020woz',
  'pano-pano2020bi',
  'pano-pano2019woz',
  'pano-pano2019bi',
  'pano-pano2018woz',
  'pano-pano2018bi',
  'pano-pano2017woz',
  'pano-pano2017bi',
  'pano-pano2016bi',
]

interface PanoramaViewerProps {
  fullScreen: boolean
}

const PanoramaViewer: FunctionComponent<PanoramaViewerProps> = ({ fullScreen }) => {
  const ref = useRef<HTMLDivElement>(null)
  const { setPanoImageDate, setLoading, loading } = useMapContext()
  const [panoPitch] = useParam(panoPitchParam)
  const [panoHeading] = useParam(panoHeadingParam)
  const [panoFov] = useParam(panoFovParam)
  const [panoTag] = useParam(panoTagParam)
  const [panoFullScreen] = useParam(panoFullScreenParam)
  const [location] = useParam(locationParam)
  const { marzipanoViewer, currentMarzipanoView } = useMarzipano(ref)
  const [hotspotId, setHotspotId] = useState(null)
  const history = useHistory()
  const { buildQueryString } = useBuildQueryString()
  const { trackEvent } = useMatomo()

  const hotspotResult = usePromise(async () => {
    if (!hotspotId) {
      return null
    }
    return getImageDataById(
      hotspotId as any,
      PANO_LABELS.find(({ id: labelId }) => labelId === panoTag)?.tags,
    )
  }, [hotspotId])

  const imageDataResult = usePromise(async () => {
    if (!location) {
      return null
    }
    return getImageDataByLocation(
      [location.lat, location.lng],
      PANO_LABELS.find(({ id }) => id === panoTag)?.tags || [],
    )
  }, [location, panoTag])

  useEffect(() => {
    setLoading(isPending(hotspotResult))

    if (isFulfilled(hotspotResult) && hotspotResult.value !== null) {
      history.push({
        ...toGeoSearch(),
        search: buildQueryString([
          [
            locationParam,
            { lat: hotspotResult.value.location[0], lng: hotspotResult.value.location[1] },
          ],
        ]),
      })
    }
  }, [hotspotResult])

  const fetchPanoramaImage = useCallback(
    (res) => {
      setPanoImageDate(res.date)
      loadScene(
        marzipanoViewer,
        setHotspotId,
        res.image,
        panoHeading ?? (panoPitchParam.initialValue as number),
        panoPitch ?? (panoPitchParam.initialValue as number),
        panoFov ?? (panoFovParam.initialValue as number),
        res.hotspots,
        trackEvent,
      )
    },
    [panoPitch, panoHeading, setPanoImageDate, marzipanoViewer, setHotspotId],
  )

  // Update the URL queries when the view changes
  useEffect(() => {
    if (currentMarzipanoView) {
      history.replace({
        search: buildQueryString([
          [panoHeadingParam, currentMarzipanoView.heading],
          [panoPitchParam, currentMarzipanoView.pitch],
          [panoFovParam, currentMarzipanoView.fov],
        ]),
      })
    }
  }, [currentMarzipanoView])

  // Reset the FOV when toggling fullscreen.
  // This will solve the issue that when the viewer is on full screen, it's zoomed in too much
  useEffect(() => {
    if (marzipanoViewer) {
      marzipanoViewer.updateSize() // Updates the stage size to fill the containing element.
      if (panoHeading && marzipanoViewer.view()) {
        setTimeout(() => {
          marzipanoViewer.view().setFov(100) // some high number, the viewer itself will set the max FOV
        }, 0)
      }
    }
  }, [marzipanoViewer, panoFullScreen])

  useEffect(() => {
    setLoading(isPending(imageDataResult))

    if (isFulfilled(imageDataResult) && imageDataResult.value !== null) {
      fetchPanoramaImage(imageDataResult.value)
      const panoramaLocation = {
        lat: parseFloat(imageDataResult.value.location[0].toFixed(COORDINATE_PRECISION)),
        lng: parseFloat(imageDataResult.value.location[1].toFixed(COORDINATE_PRECISION)),
      }
      if (
        location &&
        (panoramaLocation.lat !== location.lat || panoramaLocation.lng !== location.lng)
      ) {
        history.replace({
          search: buildQueryString([[locationParam, panoramaLocation]]),
        })
      }
    }
  }, [imageDataResult])

  return (
    <PanoramaStyle loading={loading} panoFullScreen={fullScreen}>
      <MarzipanoView ref={ref} />
    </PanoramaStyle>
  )
}

export default PanoramaViewer
