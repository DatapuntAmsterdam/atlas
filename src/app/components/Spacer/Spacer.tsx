import styled from 'styled-components'
import { themeColor, themeSpacing } from '@amsterdam/asc-ui'

const Spacer = styled.div`
  width: 100%;
  margin: ${themeSpacing(2, 0)};
  border-bottom: 3px solid ${themeColor('tint', 'level2')};

  @media print {
    display: none;
  }
`

export default Spacer
