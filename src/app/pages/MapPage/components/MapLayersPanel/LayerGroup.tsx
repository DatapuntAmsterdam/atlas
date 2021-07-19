import type Fuse from 'fuse.js'
import type { FunctionComponent, MouseEvent as ReactMouseEvent } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import styled, { css } from 'styled-components'
import { Alert, Checkbox, Icon, Label, themeColor, themeSpacing } from '@amsterdam/asc-ui'
import { ChevronDown } from '@amsterdam/asc-assets'
import { isAuthorised } from '../../legacy/utils/map-layer'
import LoginLink from '../../../../components/Links/LoginLink/LoginLink'
import LayerLegend from './LayerLegend'
import type { ExtendedMapGroup, ExtendedMapGroupLegendItem } from '../../legacy/services'
import LayerLegendZoomButton from './LayerLegendZoomButton'

const StyledCheckbox = styled(Checkbox)`
  margin-left: ${themeSpacing(-1)};
  padding-right: ${themeSpacing(3)};
`

const MapLayerWithLegendList = styled.ul`
  margin-left: ${themeSpacing(4)};
  width: 100%;
  order: 2;
`
const StyledLabel = styled(Label)`
  text-align: left;
`

const StyledAlert = styled(Alert)`
  margin: ${themeSpacing(3, 0)};
  padding: ${themeSpacing(3)};

  & * {
    margin: 0 auto;
  }
`

const ToggleButton = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  background-color: ${themeColor('tint', 'level1')};
  padding: ${themeSpacing(0, 3, 0, 2)};
  justify-content: space-between;
`

const MapLayerItemStyle = styled.li`
  display: flex;
  flex-wrap: wrap;
  cursor: pointer;
  border-bottom: 1px solid ${themeColor('tint', 'level4')};
`

// Make sure the "size" attribute won't be set in the HTML output
const ChevronIcon = styled(Icon)<{ open: boolean }>`
  order: 1;
  transition: transform 0.2s ease-in-out;
  ${({ open }) =>
    open &&
    css`
      transform: rotate(180deg);
    `}
`

const StyledLayerLegend = styled(LayerLegend)`
  &:last-of-type {
    border-bottom: 0;
  }
`

interface MapLayerItemProps {
  mapGroup: ExtendedMapGroup
  layerIsChecked: boolean
  layerIsIndeterminate?: boolean
  onRemoveLayers: any
  onAddLayers: any
  handleLayerToggle: any
  addOrRemoveLayer: any
  isEmbedView: boolean
  matches?: readonly Fuse.FuseResultMatch[]
}

const LayerGroup: FunctionComponent<MapLayerItemProps> = ({
  mapGroup,
  layerIsChecked,
  layerIsIndeterminate,
  addOrRemoveLayer,
  isEmbedView,
  handleLayerToggle,
  onAddLayers,
  onRemoveLayers,
  matches,
}) => {
  const [open, setOpen] = useState(isEmbedView || layerIsChecked || false)

  const onHandleChecked = useCallback(
    (event: ReactMouseEvent<HTMLInputElement>) => {
      if (!open && event.currentTarget.checked) {
        setOpen(true)
      }
      addOrRemoveLayer(event.currentTarget.checked, [mapGroup])
      // Sometimes we dont want the active maplayers to be deleted from the query parameters in the url
      if (isEmbedView || layerIsIndeterminate) {
        return (
          mapGroup?.legendItems &&
          mapGroup?.legendItems?.length > 0 &&
          mapGroup.legendItems?.some(({ id }: any) => id !== null) &&
          mapGroup.legendItems?.filter(({ isVisible }: any) =>
            layerIsIndeterminate ? !isVisible : true,
          )
        )
      }
      return handleLayerToggle(event.currentTarget.checked, mapGroup)
    },
    [addOrRemoveLayer, isEmbedView, layerIsIndeterminate, mapGroup, setOpen, open],
  )

  const hasMatchedLegends = useMemo(
    () =>
      mapGroup?.legendItems?.some(({ title: mapLegendTitle }) =>
        matches?.find(({ value }) => mapLegendTitle === value),
      ),
    [matches, mapGroup.legendItems],
  )

  /**
   * Effect to automatically open the mapGroup when one of the legend items are matched
   */
  useEffect(() => {
    setOpen(hasMatchedLegends ?? false)
  }, [hasMatchedLegends])

  return (
    <MapLayerItemStyle>
      <ToggleButton
        type="button"
        onClick={() => {
          setOpen(!open)
        }}
      >
        <StyledLabel
          htmlFor={mapGroup.id}
          key={mapGroup.id}
          label={mapGroup.title}
          onClick={(event) => {
            event.stopPropagation()
          }}
        >
          <StyledCheckbox
            id={mapGroup.id}
            className="checkbox"
            // @ts-ignore
            variant="tertiary"
            checked={layerIsChecked && !layerIsIndeterminate}
            indeterminate={layerIsIndeterminate}
            name={mapGroup.title}
            onChange={onHandleChecked}
          />
        </StyledLabel>
        <ChevronIcon open={open} size={15}>
          <ChevronDown />
        </ChevronIcon>

        {isAuthorised(mapGroup) && layerIsChecked && <LayerLegendZoomButton mapGroup={mapGroup} />}
      </ToggleButton>
      {!isAuthorised(mapGroup) && (
        <StyledAlert level="info">
          <LoginLink showChevron={false}>Kaartlaag zichtbaar na inloggen</LoginLink>
        </StyledAlert>
      )}
      {isAuthorised(mapGroup) && open && (
        <MapLayerWithLegendList>
          {mapGroup.legendItems
            ?.filter(({ title }) =>
              hasMatchedLegends ? matches?.find(({ value }) => value === title) : true,
            )
            .map((legendItem) => (
              <StyledLayerLegend
                key={legendItem.id}
                legendItem={
                  {
                    ...mapGroup,
                    ...legendItem,
                  } as ExtendedMapGroupLegendItem & ExtendedMapGroup
                }
                onAddLayers={onAddLayers}
                onRemoveLayers={onRemoveLayers}
              />
            ))}
        </MapLayerWithLegendList>
      )}
    </MapLayerItemStyle>
  )
}

export default LayerGroup
