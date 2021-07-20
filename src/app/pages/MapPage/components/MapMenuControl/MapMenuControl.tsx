import styled from 'styled-components'
import type { FunctionComponent } from 'react'
import { themeSpacing } from '@amsterdam/asc-ui'
import Control from '../Control'
import BaseLayerToggle from '../BaseLayerToggle'
import MapContextMenu from '../MapContextMenu/MapContextMenu'
import { useIsEmbedded } from '../../../../contexts/ui'
import { PanoramaMapMinimizeButton } from '../PanoramaViewer'

const StyledControl = styled(Control)`
  margin-left: ${themeSpacing(2)};
`

const Wrapper = styled.div`
  order: 3;
  display: inline-flex;
  align-self: flex-start;
  @media print {
    display: none;
  }
`

const MapMenuControl: FunctionComponent = () => {
  const isEmbedded = useIsEmbedded()
  return (
    <Wrapper style={isEmbedded ? { display: 'none' } : undefined} data-testid="mapMenuControls">
      {/* TODO if pano active */}
      <Control>
        <PanoramaMapMinimizeButton />
      </Control>
      {/* endif */}
      <Control>
        <BaseLayerToggle />
      </Control>
      <StyledControl>
        <MapContextMenu />
      </StyledControl>
    </Wrapper>
  )
}

export default MapMenuControl
