import type { FunctionComponent } from 'react'
import styled from 'styled-components'
import { TextField, themeSpacing } from '@amsterdam/asc-ui'
import useParam from '../../../../utils/useParam'
import { useMapContext } from '../../MapContext'
import { mapLayersParam } from '../../query-params'
import useFuse from '../../../../utils/useFuse'
import LayerCollection from './LayerCollection'
import type { ExtendedMapGroup } from '../../legacy/services'

const MapPanelContent = styled.div`
  margin: ${themeSpacing(3, 0)};
  padding: ${themeSpacing(0, 3)};
`

const MapPanelWrapper = styled.div`
  margin-top: ${themeSpacing(4)};
`

const MapLayersPanel: FunctionComponent = () => {
  const { panelLayers } = useMapContext()
  const [activeLayers, setActiveMapLayers] = useParam(mapLayersParam)
  const { query, updateQuery, results } = useFuse(panelLayers, {
    keys: ['title', 'mapLayers.title', 'mapLayers.legendItems.title'],
    threshold: 0.2,
    findAllMatches: true,
    includeMatches: true,
    minMatchCharLength: 2,
  })

  return (
    <MapPanelContent data-testid="legendPanel">
      <TextField
        type="text"
        id="mapLegendSearchBar"
        onChange={(e) => updateQuery(e.target.value)}
        onClear={() => updateQuery('')}
        value={query}
        placeholder="Zoek op kaartlaag"
      />
      <MapPanelWrapper data-testid="mapPanel" aria-label="Kaartlagen legenda">
        {results.map(({ item: { id, mapLayers, title }, matches }) => (
          <LayerCollection
            matches={matches}
            onAddLayers={(layers: string[]) => {
              if (layers) {
                setActiveMapLayers([...activeLayers, ...layers])
              }
            }}
            onRemoveLayers={(layers: string[]) => {
              setActiveMapLayers(activeLayers.filter((layer) => !layers.includes(layer)))
            }}
            key={id}
            activeMapLayers={mapLayers as ExtendedMapGroup[]}
            title={title}
          />
        ))}
      </MapPanelWrapper>
    </MapPanelContent>
  )
}

export default MapLayersPanel
