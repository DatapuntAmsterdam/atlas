import { FunctionComponent, MouseEventHandler, useMemo } from 'react'
import { Icon, Label, styles, themeColor, themeSpacing } from '@amsterdam/asc-ui'
import { ChevronDown } from '@amsterdam/asc-assets'
import styled, { css } from 'styled-components'

const TitleWrapper = styled.div`
  display: flex;
`

const StyledLabel = styled(Label)`
  width: 100%;
`

interface LayerButtonProps {
  isOpen?: boolean
  hasActiveLayer?: boolean
}

const LayerButton = styled.button<LayerButtonProps>`
  display: flex;
  cursor: pointer;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: ${themeSpacing(0, 3)};
  background-color: ${themeColor('tint', 'level2')};
  margin-bottom: ${themeSpacing(1)};
  ${({ hasActiveLayer }) =>
    hasActiveLayer &&
    css`
      background-color: ${themeColor('support', 'focus')};
    `}

  & > ${styles.IconStyle} {
    transition: transform 0.2s ease-in-out;
    ${({ isOpen }) =>
      isOpen &&
      css`
        transform: rotate(180deg);
      `}
  }
`

const LayerCollectionButton: FunctionComponent<{
  onClick: MouseEventHandler<HTMLButtonElement>
  title: string
  collectionIndeterminate: boolean
  allVisible: boolean
  isOpen: boolean
}> = ({ title, isOpen, onClick, collectionIndeterminate, allVisible }) => {
  const testId: string = useMemo(
    () =>
      title
        .split(' ')
        .map((word: string) => `${word.charAt(0).toUpperCase()}${word.substring(1)}`)
        .join(''),
    [title],
  )

  return (
    <LayerButton
      data-testid={`mapLegendLayerButton${testId}`}
      onClick={onClick}
      isOpen={isOpen}
      hasActiveLayer={collectionIndeterminate || allVisible}
    >
      <TitleWrapper>
        <StyledLabel key={title} label={title} />
      </TitleWrapper>
      <Icon size={15}>
        <ChevronDown />
      </Icon>
    </LayerButton>
  )
}

export default LayerCollectionButton
