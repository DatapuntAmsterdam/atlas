import { Geometry } from 'geojson'
import React, { useMemo, useReducer, useState } from 'react'
import { useSelector } from 'react-redux'
import {
  getMapLayers as fetchMapLayers,
  getPanelLayers as fetchPanelLayers,
  MapCollection,
  MapLayer,
} from '../../../map/services'
import { getUser } from '../../../shared/ducks/user/user'
import { mapLayersParam, polygonParam, polylineParam } from '../../query-params'
import useParam from '../../utils/useParam'
import MapContext, { initialState, MapContextProps, MapState } from './MapContext'
import MapPage from './MapPage'
import buildLeafletLayers from './utils/buildLeafletLayers'

type Action =
  | { type: 'setPanelLayers'; payload: MapCollection[] }
  | { type: 'setMapLayers'; payload: MapLayer[] }
  | { type: 'setGeometry'; payload: Geometry }

const reducer = (state: MapState, action: Action): MapState => {
  switch (action.type) {
    case 'setPanelLayers':
      return {
        ...state,
        panelLayers: action.payload,
      }
    case 'setMapLayers':
      return {
        ...state,
        mapLayers: action.payload,
      }
    case 'setGeometry':
      return {
        ...state,
        geometry: action.payload,
      }
    default:
      return state
  }
}

const MapContainer: React.FC<MapContextProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [activeMapLayers] = useParam(mapLayersParam)
  const [polyline] = useParam(polylineParam)
  const [polygon] = useParam(polygonParam)
  const [showDrawTool, setShowDrawTool] = useState(!!(polyline || polygon))
  const user = useSelector(getUser)

  const legendLeafletLayers = useMemo(
    () => buildLeafletLayers(activeMapLayers, state.mapLayers, user),
    [activeMapLayers, state.mapLayers, user],
  )

  function setGeometry(payload: Geometry) {
    dispatch({ type: 'setGeometry', payload })
  }

  async function getPanelLayers() {
    const panelLayers = await fetchPanelLayers()

    dispatch({
      type: 'setPanelLayers',
      payload: panelLayers,
    })
  }

  async function getMapLayers() {
    const mapLayers = await fetchMapLayers()

    dispatch({
      type: 'setMapLayers',
      payload: mapLayers,
    })
  }

  const [polygons] = useParam(polygonParam)
  const [polylines] = useParam(polylineParam)

  const showDrawContent = useMemo(() => !!(polygons?.length || polylines?.length), [
    polygons,
    polylines,
  ])

  React.useEffect(() => {
    getPanelLayers()
    getMapLayers()
  }, [])

  return (
    <MapContext.Provider
      value={{
        ...state,
        legendLeafletLayers,
        setGeometry,
        getPanelLayers,
        getMapLayers,
        showDrawTool,
        setShowDrawTool,
        showDrawContent,
      }}
    >
      <MapPage>{children}</MapPage>
    </MapContext.Provider>
  )
}

export default MapContainer
