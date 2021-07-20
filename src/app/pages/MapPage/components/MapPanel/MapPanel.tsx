import { Heading, themeColor, themeSpacing } from '@amsterdam/asc-ui'
import type { FunctionComponent } from 'react'
import { useEffect, useMemo } from 'react'
import { matchPath, Route, Switch, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { useMatomo } from '@datapunt/matomo-tracker-react'
import { useDataSelection } from '../../../../components/DataSelection/DataSelectionContext'
import { routing } from '../../../../routes'
import useParam from '../../../../utils/useParam'
import DetailPanel from '../DetailPanel/DetailPanel'
import MapSearchResults from '../MapSearchResults/MapSearchResults'
import { useMapContext } from '../../MapContext'
import { locationParam, mapLayersParam } from '../../query-params'
import DrawerOverlay, { DeviceMode, DrawerState } from '../DrawerOverlay'
import { DrawerPanelHeader, LargeDrawerPanel, SmallDrawerPanel } from '../DrawerPanel'
import DrawResults from '../DrawTool/DrawResults'
import MapLayersPanel from '../MapLayersPanel'
import useMapControls from './useMapControls'
import { LEGEND_CLOSE } from '../../matomo-events'
import DetailInfoBox from '../DetailPanel/DetailInfoBox'

const TitleHeading = styled(Heading)`
  margin: 0;
`

const SubtitleHeading = styled(Heading)`
  color: ${themeColor('secondary')};
  margin: 0;
`

const DrawerContainer = styled.div`
  padding: ${themeSpacing(0, 4)};

  @media print {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-column-gap: ${themeSpacing(1)};
    grid-row-gap: ${themeSpacing(1)};
  }
`

const StyledLargeDrawerPanel = styled(LargeDrawerPanel)<{ show: boolean }>`
  display: ${({ show }) => (show ? 'block' : 'none')};
`

const LegendDrawerPanelHeader = styled(DrawerPanelHeader)`
  position: sticky;
  top: 0;
  z-index: 10000;
  box-shadow: 0 1px 4px ${themeColor('tint', 'level4')};
  background-color: ${themeColor('tint', 'level1')};
`

const StyledDetailInfoBox = styled(DetailInfoBox)`
  position: absolute;
  right: 0;
  top: 0;
`

const MapPanel: FunctionComponent = () => {
  const { setDrawerState, panelHeader, legendActive, drawerState, setLegendActive, infoBox } =
    useMapContext()
  const [activeMapLayers] = useParam(mapLayersParam)
  const [locationParameter] = useParam(locationParam)
  const location = useLocation()
  const { activeFilters } = useDataSelection()
  const { trackEvent } = useMatomo()
  // TODO: Replace this logic with 'useRouteMatch()' when the following PR has been released:
  // https://github.com/ReactTraining/react-router/pull/7822
  const dataDetailMatch = useMemo(
    () => matchPath(location.pathname, routing.dataDetail.path),
    [location.pathname, routing.dataDetail.path],
  )

  const dataSearchGeoMatch = useMemo(
    () => matchPath(location.pathname, routing.dataSearchGeo.path),
    [location.pathname, routing.dataSearchGeo.path],
  )
  const dataSelectionMatch = useMemo(
    () =>
      matchPath(location.pathname, routing.addresses.path) ||
      matchPath(location.pathname, routing.establishments.path) ||
      matchPath(location.pathname, routing.cadastralObjects.path),
    [location.pathname, routing],
  )

  const onCloseLegend = () => {
    setLegendActive(false)
    trackEvent(LEGEND_CLOSE)
  }

  // Hide the legend when any of the following events occur:
  // - The user selects an item on the map, navigating to a detail panel.
  // - The user selects a point on the map, navigating to a geo search panel.
  // - The users moves the point on the map, whilst already having the geo search panel open.
  useEffect(() => {
    if (dataDetailMatch || (dataSearchGeoMatch && locationParameter) || dataSelectionMatch) {
      setLegendActive(false)
    } else if (activeMapLayers.length) {
      // Show the legend explicitly when the user activates a map layer from outside the legend eg. clicking on a AutoSuggest / searchbar dropdown result
      setLegendActive(true)
      setDrawerState(DrawerState.Open)
    }
  }, [dataDetailMatch, dataSearchGeoMatch, locationParameter])

  const controls = useMapControls()

  const showContentPanel = useMemo(() => {
    if (
      // Also geosearch-page always needs a location parameter
      matchPath(location.pathname, {
        path: routing.data.path,
        exact: true,
      }) ||
      (dataSearchGeoMatch && !locationParameter)
    ) {
      return false
    }

    // Other pages definitely have content in drawer panel
    return true
  }, [matchPath, location, locationParameter, legendActive, activeFilters])

  return (
    <>
      <DrawerOverlay
        mode={DeviceMode.Desktop}
        controls={controls}
        state={!showContentPanel && !legendActive ? DrawerState.Closed : drawerState}
        onStateChange={setDrawerState}
      >
        {showContentPanel && (
          <StyledLargeDrawerPanel data-testid="drawerPanel" show={!legendActive}>
            <DrawerPanelHeader>
              {panelHeader.type && <SubtitleHeading as="h6">{panelHeader.type}</SubtitleHeading>}
              <TitleHeading styleAs="h2">{panelHeader.title}</TitleHeading>
              {panelHeader.customElement && panelHeader.customElement}
              {infoBox && <StyledDetailInfoBox {...infoBox} />}
            </DrawerPanelHeader>
            <DrawerContainer>
              <Switch>
                <Route path={routing.dataSearchGeo.path}>
                  <MapSearchResults />
                </Route>
                <Route path={[routing.dataDetail.path]}>
                  <DetailPanel />
                </Route>
                <Route
                  path={[
                    routing.addresses.path,
                    routing.establishments.path,
                    routing.cadastralObjects.path,
                  ]}
                  exact
                >
                  <DrawResults />
                </Route>
              </Switch>
            </DrawerContainer>
          </StyledLargeDrawerPanel>
        )}
        {legendActive && (
          <SmallDrawerPanel data-testid="drawerPanel">
            <LegendDrawerPanelHeader onClose={onCloseLegend}>
              <TitleHeading styleAs="h2">Legenda</TitleHeading>
            </LegendDrawerPanelHeader>
            <MapLayersPanel />
          </SmallDrawerPanel>
        )}
      </DrawerOverlay>
    </>
  )
}

export default MapPanel
