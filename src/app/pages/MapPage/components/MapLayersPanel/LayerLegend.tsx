import type { ElementType, FunctionComponent } from 'react'
import { useMemo } from 'react'
import styled, { css } from 'styled-components'
import { Checkbox, Label, themeColor, themeSpacing } from '@amsterdam/asc-ui'
import MAP_CONFIG from '../../legacy/services/map.config'
import type { ExtendedMapGroup } from '../../legacy/services'
import { isAuthorised } from '../../legacy/utils/map-layer'
import LayerLegendZoomButton from './LayerLegendZoomButton'

const StyledLabel = styled(Label)`
  width: 100%;
  margin-right: auto !important;
`

const StyledCheckbox = styled(Checkbox)`
  padding-right: 0;
  margin-left: ${themeSpacing(-1)};
`

const NonSelectableLegendParagraph = styled.p`
  margin-bottom: ${themeSpacing(2)};
  margin-right: auto !important;
`

const MapLegendImage = styled.div`
  box-sizing: content-box;
  display: inline-block;
  height: 16px;
  line-height: 16px;
  width: 16px;
  margin-left: ${themeSpacing(3)};

  & + * {
    margin-left: ${themeSpacing(2)} !important;
  }

  & > img {
    height: auto;
    width: inherit;
  }
`

const MapLayerWithLegendStyle = styled.li<{ notSelectable: boolean }>`
  align-items: center;
  display: flex;
  padding: ${themeSpacing(0, 3, 0, 2)};
  ${({ notSelectable }) =>
    notSelectable
      ? css`
          margin-left: 23px;
        `
      : css`
          border-bottom: 1px solid ${themeColor('tint', 'level4')};
        `}
`

interface MapLayerWithLegendItemProps {
  legendItem: ExtendedMapGroup
  onAddLayers: (id: string[]) => void
  onRemoveLayers: (id: string[]) => void
}

const LayerLegend: FunctionComponent<MapLayerWithLegendItemProps & Partial<HTMLLIElement>> = ({
  legendItem,
  onAddLayers,
  onRemoveLayers,
  className,
}) => {
  const LegendLabel = useMemo(
    () =>
      !legendItem.notSelectable
        ? (StyledLabel as ElementType)
        : (NonSelectableLegendParagraph as ElementType),
    [legendItem],
  )

  const icon = legendItem.iconUrl
    ? legendItem.iconUrl
    : new URL(`${MAP_CONFIG.OVERLAY_ROOT}${legendItem.legendIconURI as string}`).toString()

  return (
    <MapLayerWithLegendStyle notSelectable={legendItem.notSelectable} className={className}>
      <LegendLabel htmlFor={legendItem.id} label={legendItem.title}>
        {!legendItem.notSelectable ? (
          <StyledCheckbox
            id={legendItem.id ?? '1'}
            className="checkbox"
            // @ts-ignore
            variant="tertiary"
            checked={legendItem.isVisible ?? false}
            name={legendItem.title}
            onChange={
              /* istanbul ignore next */
              () => {
                if (!legendItem.isVisible) {
                  if (onAddLayers) {
                    onAddLayers([legendItem.id ?? '1'])
                  }
                } else if (onRemoveLayers) {
                  onRemoveLayers([legendItem.id ?? '1'])
                }
              }
            }
          />
        ) : (
          legendItem.title
        )}
      </LegendLabel>
      {isAuthorised(legendItem) && legendItem.isVisible && (
        <LayerLegendZoomButton mapGroup={legendItem} />
      )}
      <MapLegendImage>
        <img alt={legendItem.title} src={icon} />
      </MapLegendImage>
    </MapLayerWithLegendStyle>
  )
}

export default LayerLegend
