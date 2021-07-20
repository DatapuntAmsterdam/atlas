import { useCallback, useMemo } from 'react'
import { ControlButton } from '@amsterdam/arm-core'
import { Close } from '@amsterdam/asc-assets'
import { useMatomo } from '@datapunt/matomo-tracker-react'
import styled from 'styled-components'
import { useHistory, useLocation } from 'react-router-dom'
import {
  mapLayersParam,
  panoFovParam,
  panoFullScreenParam,
  panoHeadingParam,
  panoPitchParam,
  panoTagParam,
} from '../../query-params'
import useBuildQueryString from '../../../../utils/useBuildQueryString'
import { PANO_LAYERS } from './PanoramaViewer'
import useParam from '../../../../utils/useParam'
import Control from '../Control'
import { PANORAMA_CLOSE } from '../../matomo-events'

const StyledControl = styled(Control)`
  align-self: flex-end;
`

const PanoramaCloseButton = () => {
  const history = useHistory()
  const browserLocation = useLocation()
  const { buildQueryString } = useBuildQueryString()
  const [activeLayers] = useParam(mapLayersParam)
  const { trackEvent } = useMatomo()

  const activeLayersWithoutPano = useMemo(
    () => activeLayers.filter((id) => !PANO_LAYERS.includes(id)),
    [activeLayers],
  )

  const onClose = useCallback(() => {
    trackEvent(PANORAMA_CLOSE)
    history.push({
      pathname: browserLocation.pathname,
      search: buildQueryString(
        [[mapLayersParam, activeLayersWithoutPano]],
        [panoHeadingParam, panoPitchParam, panoTagParam, panoFovParam, panoFullScreenParam],
      ),
    })
  }, [browserLocation])

  return (
    <StyledControl data-testid="panoramaControls">
      <ControlButton
        type="button"
        variant="blank"
        title="Panorama sluiten"
        size={44}
        iconSize={25}
        onClick={onClose}
        data-testid="panoramaViewerCloseButton"
        icon={<Close />}
      />
    </StyledControl>
  )
}

export default PanoramaCloseButton
