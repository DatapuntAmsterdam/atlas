import { themeColor, themeSpacing } from '@amsterdam/asc-ui'
import styled, { css } from 'styled-components'
import { DeviceMode, isMobile } from '../DrawerOverlay'
import { slideInDesktop, slideInMobile } from './keyframes'

const STACK_SPACING = 8

interface DrawerPanelProps {
  stackLevel?: number
  deviceMode?: DeviceMode
}

// I tried to get this to work with 'defaultProps' to reduce repetition,
// but I could not come to a solution that works with Styled Components and TS.
// If you like a challenge, check out: https://github.com/microsoft/TypeScript/issues/27425
const defaultDeviceMode = DeviceMode.Mobile

const DrawerPanel = styled.div<DrawerPanelProps>`
  height: 100%;
  width: 100%;
  overflow-y: auto;
  animation: ${({ deviceMode = defaultDeviceMode }) =>
      isMobile(deviceMode) ? slideInMobile : slideInDesktop}
    0.25s ease-in-out;
  background-color: ${themeColor('tint', 'level1')};

  @media print {
    position: relative;
    width: 100% !important;
    page-break-before: always;
  }

  ${({ deviceMode = defaultDeviceMode, stackLevel = 0 }) => {
    if (isMobile(deviceMode)) {
      return css`
        margin-top: ${themeSpacing(STACK_SPACING * stackLevel)};
      `
    }
  }}
`

export default DrawerPanel
