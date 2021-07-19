import type Fuse from 'fuse.js'
import { themeColor, themeSpacing } from '@amsterdam/asc-ui'
import { useMatomo } from '@datapunt/matomo-tracker-react'
import type { FunctionComponent } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useIsEmbedded } from '../../../../contexts/ui'
import LayerCollectionButton from './LayerCollectionButton'
import LayerLegend from './LayerLegend'
import LayerGroup from './LayerGroup'
import type { ExtendedMapGroup } from '../../legacy/services'
import useCompare from '../../../../utils/useCompare'

const MapCollectionList = styled.ul`
  background-color: ${themeColor('tint', 'level1')};
  border-top: none;
  list-style-type: none;
  padding: 0;
  user-select: none;
  margin-bottom: ${themeSpacing(3)};
`

export interface MapLegendProps {
  activeMapLayers: ExtendedMapGroup[]
  title: string
  onAddLayers: (layers: string[]) => void
  onRemoveLayers: (layers: string[]) => void
  matches: readonly Fuse.FuseResultMatch[] | undefined
}

// Todo: legacy component, should be refactored / simplified
const LayerCollection: FunctionComponent<MapLegendProps> = ({
  activeMapLayers,
  title,
  onRemoveLayers,
  onAddLayers,
  matches,
}) => {
  const { trackEvent } = useMatomo()
  const isEmbedView = useIsEmbedded()

  const trackLayerEnabled = useCallback(
    (mapLayer: ExtendedMapGroup) => {
      // Sanitize the collection title to use it as action
      const action = mapLayer.title.toLowerCase().replace(/[: ][ ]*/g, '_')

      if (!mapLayer.legendItems || mapLayer.legendItems.length === 0) {
        trackEvent({
          category: 'kaartlaag',
          action,
          name: mapLayer.title,
        })
      } else {
        mapLayer.legendItems.forEach(({ title: legendItemTitle }) =>
          trackEvent({
            category: 'kaartlaag',
            action,
            name: legendItemTitle,
          }),
        )
      }
    },
    [trackEvent],
  )

  // Todo: This need to be refactored on redux level, so MapLayers and LegendItems will get a isVisible option there.
  const mapLayers = activeMapLayers

  const titles = mapLayers
    .map(({ title: mapGroupTitle, legendItems }) => {
      const legendTitles = legendItems?.map(({ title: legendTitle }) => legendTitle)
      return [mapGroupTitle, ...(legendTitles || [])]
    })
    .flat()

  const [collectionOpen, setCollectionOpen] = useState(isEmbedView || false)

  const allVisible = mapLayers.every(({ isVisible }) => isVisible)
  const someVisible = mapLayers.some(({ isVisible }) => isVisible)
  const collectionIndeterminate =
    mapLayers.some(
      ({ isVisible, legendItems }) =>
        !isVisible ||
        legendItems?.some(({ isVisible: legendVisibility }: any) => !legendVisibility),
    ) && someVisible

  const handleLayerToggle = (checked: boolean, mapLayer: ExtendedMapGroup) => {
    // Only track the event when the mapGroup gets checked
    if (checked) {
      trackLayerEnabled(mapLayer)
    }
  }

  // Check if some of the maplayers are opened on first render
  const hasOpenMapLayers = useMemo(
    () =>
      mapLayers.some(
        ({ isVisible, legendItems }) =>
          isVisible ||
          (isVisible &&
            legendItems?.some(({ isVisible: legendItemIsVisible }: any) => legendItemIsVisible)), // legenditems could be visible in another MapLegend
      ),
    [mapLayers],
  )

  // Open the maplegend if some of the maplayers are opened
  useEffect(() => {
    if (hasOpenMapLayers) setCollectionOpen(true)
  }, [hasOpenMapLayers])

  const addOrRemoveLayer = (
    checked: boolean,
    layers: ExtendedMapGroup[],
    onlyInvisible = false,
  ) => {
    const layersToFilter = onlyInvisible ? layers.filter(({ isVisible }) => !isVisible) : layers
    const filteredMapLayers = layersToFilter
      .map((mapLayer) => {
        if (mapLayer?.legendItems?.length && mapLayer?.legendItems?.every(({ id }) => id)) {
          return mapLayer?.legendItems?.map((legendItem) => legendItem.id ?? '')
        }
        return mapLayer.id
      })
      .flat()
      .filter((id) => id)

    if (checked) {
      if (onAddLayers) {
        onAddLayers(filteredMapLayers)
      }
    } else if (onRemoveLayers) {
      onRemoveLayers(filteredMapLayers)
    }
  }

  const hasMatchedGroupLayers = useMemo(
    () =>
      mapLayers.some(({ title: mapGroupTitle }) =>
        matches?.find(({ value }) => mapGroupTitle === value),
      ),
    [matches, mapLayers],
  )

  const matchesChanged = useCompare(matches?.length)

  /**
   * Effect to automatically open the collections when user searched
   * When the search isn't changed (matchesChanged), it shouldn't run this effect
   */
  useEffect(() => {
    if (matchesChanged && matches?.length) {
      setCollectionOpen(matches.some(({ value }) => titles.includes(value ?? '')) ?? false)
    } else if (matchesChanged && !matches?.length) {
      setCollectionOpen(hasOpenMapLayers)
    }
  }, [titles, matchesChanged, matchesChanged, hasOpenMapLayers])

  const filteredMapLayers = useMemo(
    () =>
      mapLayers
        .filter(({ isEmbedded }) => (isEmbedView ? isEmbedded : true)) // Only include the embedded layers when in certain views
        .filter(({ title: mapGroupTitle }) =>
          // eslint-disable-next-line no-nested-ternary
          hasMatchedGroupLayers ? matches?.find(({ value }) => value === mapGroupTitle) : true,
        )
        .map((mapGroup) => {
          const layerIsChecked = mapGroup.isVisible
          const layerIsIndeterminate =
            mapGroup.legendItems?.some(({ isVisible }: any) => !isVisible) && layerIsChecked

          const hasLegendItems = mapGroup?.legendItems && mapGroup.legendItems.length > 0

          return {
            ...mapGroup,
            layerIsIndeterminate,
            layerIsChecked,
            hasLegendItems,
          }
        }),
    [mapLayers, matches],
  )

  return (
    <>
      {(!isEmbedView || (isEmbedView && mapLayers.some(({ isEmbedded }) => isEmbedded))) && ( // Also display the collection title when maplayer is embedded
        <LayerCollectionButton
          collectionIndeterminate={collectionIndeterminate}
          isOpen={collectionOpen}
          onClick={() => setCollectionOpen(!collectionOpen)}
          allVisible={allVisible}
          title={title}
        />
      )}
      {collectionOpen && (
        <MapCollectionList>
          {filteredMapLayers.map((mapGroup) => {
            if (!mapGroup.hasLegendItems) {
              return (
                <LayerLegend
                  key={mapGroup.id}
                  onAddLayers={onAddLayers}
                  onRemoveLayers={onRemoveLayers}
                  legendItem={mapGroup}
                />
              )
            }

            return (
              <LayerGroup
                key={mapGroup.id}
                mapGroup={mapGroup}
                layerIsChecked={mapGroup.layerIsChecked}
                layerIsIndeterminate={mapGroup.layerIsIndeterminate}
                addOrRemoveLayer={addOrRemoveLayer}
                isEmbedView={isEmbedView}
                handleLayerToggle={handleLayerToggle}
                onAddLayers={onAddLayers}
                onRemoveLayers={onRemoveLayers}
                matches={matches}
              />
            )
          })}
        </MapCollectionList>
      )}
    </>
  )
}

export default LayerCollection
