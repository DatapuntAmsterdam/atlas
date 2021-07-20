import { MapPanelContext, Marker as ARMMarker } from '@amsterdam/arm-core'
import { useMatomo } from '@datapunt/matomo-tracker-react'
import type { LeafletMouseEvent } from 'leaflet'
import type { FunctionComponent } from 'react'
import { useCallback, useEffect } from 'react'
import { matchPath, useHistory, useLocation } from 'react-router-dom'
import { toDataDetail, toGeoSearch } from '../../../../links'
import { routing } from '../../../../routes'
import useBuildQueryString from '../../../../utils/useBuildQueryString'
import useLeafletEvent from '../../../../utils/useLeafletEvent'
import useMapCenterToMarker from '../../../../utils/useMapCenterToMarker'
import useParam from '../../../../utils/useParam'
import useRequiredContext from '../../../../utils/useRequiredContext'
import fetchNearestDetail from '../../legacy/services/nearest-detail/nearest-detail'
import { useMapContext } from '../../MapContext'
import { MARKER_SET } from '../../matomo-events'
import { locationParam, polygonParam, zoomParam } from '../../query-params'
import { SnapPoint } from '../../types'
import PanoramaViewerMarker from '../PanoramaViewer/PanoramaViewerMarker'
import useCustomEvent from '../../../../utils/useCustomEvent'

export interface MarkerProps {
  panoActive: boolean
}

const MapMarker: FunctionComponent<MarkerProps> = ({ panoActive }) => {
  const [position] = useParam(locationParam)
  const { legendLeafletLayers, setLoading } = useMapContext()
  const [zoom] = useParam(zoomParam)
  const [polygon] = useParam(polygonParam)
  const location = useLocation()
  const history = useHistory()
  const { trackEvent } = useMatomo()
  const { buildQueryString } = useBuildQueryString()
  const { panToWithPanelOffset, panToFitPrintMode } = useMapCenterToMarker()

  const { setPositionFromSnapPoint } = useRequiredContext(MapPanelContext)

  async function handleMapClick(e: LeafletMouseEvent) {
    // Always open the drawer when user clicks on the map
    const layers = legendLeafletLayers
      .filter(({ layer }) => layer.detailUrl && zoom >= layer.minZoom)
      .map(({ layer }) => layer)

    let nearestDetails = null
    if (layers.length > 0) {
      setLoading(true)
      nearestDetails = await fetchNearestDetail(
        { latitude: e.latlng.lat, longitude: e.latlng.lng },
        layers,
        zoom,
      )
      setLoading(false)
    }
    if (nearestDetails) {
      // @ts-ignore
      const { type, subType, id } = nearestDetails
      history.push({
        ...toDataDetail({ type, subtype: subType ?? '', id }),
        search: buildQueryString([[locationParam, e.latlng]]),
      })
    } else {
      trackEvent(MARKER_SET)
      history.push({
        ...toGeoSearch(),
        search: buildQueryString([[locationParam, e.latlng]], [polygonParam]),
      })
    }
  }

  const onHandleBeforePrint = useCallback(() => {
    if (position) {
      panToFitPrintMode(position)
    }
  }, [position])

  const onHandleAfterPrint = useCallback(() => {
    if (position) {
      panToWithPanelOffset(position)
    }
  }, [position])

  useCustomEvent(window, 'beforeprint', onHandleBeforePrint)
  useCustomEvent(window, 'afterprint', onHandleAfterPrint)

  useEffect(() => {
    if (position && matchPath(location.pathname, routing.dataSearchGeo.path)) {
      panToWithPanelOffset(position)
    }
  }, [position])

  useLeafletEvent(
    'click',
    (event) => {
      setPositionFromSnapPoint(SnapPoint.Halfway)
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      handleMapClick(event)
    },
    [location, legendLeafletLayers],
  )

  const showPanoMarker = panoActive
  const showSearchMarker =
    position &&
    !polygon &&
    !matchPath(location.pathname, { path: routing.dataDetail.path, exact: true }) &&
    !(
      matchPath(location.pathname, routing.addresses.path) ||
      matchPath(location.pathname, routing.establishments.path) ||
      matchPath(location.pathname, routing.cadastralObjects.path)
    )

  if (showPanoMarker) {
    return <PanoramaViewerMarker position={position} />
  }

  if (showSearchMarker && position) {
    return <ARMMarker latLng={position} />
  }

  return null
}

export default MapMarker
