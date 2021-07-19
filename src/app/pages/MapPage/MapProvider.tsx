import type { FunctionComponent } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useClient } from 'urql'
import useParam from '../../utils/useParam'
import type { MapState } from './MapContext'
import MapContext from './MapContext'
import {
  locationParam,
  mapLayersParam,
  panoFullScreenParam,
  panoHeadingParam,
} from './query-params'
import buildLeafletLayers from './utils/buildLeafletLayers'
import { DrawerState } from './components/DrawerOverlay'
import useCompare from '../../utils/useCompare'
import type { InfoBoxProps } from './legacy/types/details'
import { useIsEmbedded } from '../../contexts/ui'
import type { MapCollection } from '../../../api/cms_search/graphql'
// @ts-ignore
import { mapCollectionSearchQuery } from '../../../api/cms_search/mapCollections.graphql'

interface MapPanelOverlay {
  id: string
  isVisible: boolean
}

const MapContainer: FunctionComponent = ({ children }) => {
  const [activeMapLayers] = useParam(mapLayersParam)
  const [location] = useParam(locationParam)
  const [panoHeading] = useParam(panoHeadingParam)
  const [legendActive, setLegendActive] = useState(false)
  const [infoBox, setInfoBox] = useState<InfoBoxProps>()
  const [loading, setLoading] = useState(false)
  const [drawerState, setDrawerState] = useState(DrawerState.Open)
  const [detailFeature, setDetailFeature] = useState<MapState['detailFeature']>(null)
  const [panoImageDate, setPanoImageDate] = useState<MapState['panoImageDate']>(null)
  const [showMapDrawVisualization, setShowMapDrawVisualization] = useState(false)
  const [mapLayers, setMapLayers] = useState<MapCollection[]>([])
  const [panelHeader, setPanelHeader] = useState<MapState['panelHeader']>({ title: 'Resultaten' })
  const [panoFullScreen, setPanoFullScreen] = useParam(panoFullScreenParam)
  const browserLocation = useLocation()
  const isEmbedView = useIsEmbedded()
  const graphqlClient = useClient()

  const panoActive = panoHeading !== null && location !== null

  const overlays = useMemo<MapPanelOverlay[]>(
    () => activeMapLayers.map((layer) => ({ id: layer, isVisible: true })),
    [activeMapLayers],
  )

  // Todo: this should be refactored so we handle visibility of layers in components
  const formattedMapLayers = useMemo(
    () =>
      mapLayers.map((panelLayer) => ({
        ...panelLayer,
        mapLayers: panelLayer.mapLayers.map((mapLayer) => ({
          ...mapLayer,
          legendItems: [
            ...(mapLayer?.legendItems?.map((legendItem) => ({
              ...legendItem,
              url: legendItem?.url ?? mapLayer.url,
              isVisible: overlays.some(
                (overlay) =>
                  (overlay.id === legendItem.id && overlay.isVisible) || legendItem.notSelectable,
              ),
            })) || []),
          ],
          isVisible: overlays.some((overlay) =>
            [{ id: mapLayer.id }, ...(mapLayer.legendItems || [])].some(
              (legendItem) => overlay.id === legendItem.id && overlay.isVisible,
            ),
          ),
          isEmbedded: overlays.some((overlay) =>
            [{ id: mapLayer.id }, ...(mapLayer.legendItems || [])].some(
              (legendItem) => overlay.id === legendItem.id && isEmbedView,
            ),
          ),
        })),
      })),
    [overlays, isEmbedView, mapLayers],
  )

  const legendLeafletLayers = useMemo(
    () =>
      buildLeafletLayers(
        activeMapLayers,
        // @ts-ignore
        formattedMapLayers
          .map((collection) =>
            collection.mapLayers.map((mapLayer) => [mapLayer, ...mapLayer.legendItems]),
          )
          .flat()
          .flat(),
      ),
    [activeMapLayers, mapLayers],
  )

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    ;(async () => {
      try {
        const query =
          graphqlClient.query<{ mapCollectionSearch: { results: MapCollection[] } }>(
            mapCollectionSearchQuery,
          )
        const result = await query.toPromise()
        setMapLayers(result.data?.mapCollectionSearch.results ?? [])
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('MapContainer: problem fetching panel and map layers')
      }
    })()
  }, [])

  const pathChanged = useCompare(browserLocation.pathname)

  const locationChanged = useCompare(location)

  // Open DrawerPanel programmatically when: location parameter or pathname is changed, and panorama is not active
  useEffect(() => {
    if ((pathChanged || locationChanged) && location && !panoActive) {
      setDrawerState(DrawerState.Open)
    }
  }, [browserLocation, pathChanged, locationChanged, location, panoActive])

  return (
    <MapContext.Provider
      value={{
        panoActive,
        panelHeader,
        // @ts-ignore
        panelLayers: formattedMapLayers,
        detailFeature,
        panoImageDate,
        legendLeafletLayers,
        setDetailFeature,
        setPanelHeader,
        panoFullScreen,
        setPanoFullScreen,
        setPanoImageDate,
        showMapDrawVisualization,
        setShowMapDrawVisualization,
        setLegendActive,
        setDrawerState,
        legendActive,
        drawerState,
        setLoading,
        loading,
        infoBox,
        setInfoBox,
      }}
    >
      {children}
    </MapContext.Provider>
  )
}

export default MapContainer
