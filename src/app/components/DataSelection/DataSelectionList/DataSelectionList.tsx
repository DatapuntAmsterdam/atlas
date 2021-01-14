import { FunctionComponent } from 'react'
import { generatePath, Link as RouterLink } from 'react-router-dom'
import styled from 'styled-components'
import { Link, themeSpacing } from '@amsterdam/asc-ui'
import { LocationDescriptor } from 'history'
import { getDetailPageData } from '../../../../store/redux-first-router/actions'
import DataSelectionFormatter from '../DataSelectionFormatter/DataSelectionFormatter'
import { routing } from '../../../routes'

type Props = {
  content: {
    head: []
    body: [
      {
        detailEndpoint: string
        content: string[]
      },
    ]
    formatters: string[]
  }
}

const StyledListItem = styled.li`
  margin-bottom: ${themeSpacing(2)};
`

export const toDetailPage = (endpoint: string): LocationDescriptor => {
  const { type, subtype, id } = getDetailPageData(endpoint)
  return {
    pathname: generatePath(routing.dataDetail.path, { type, subtype, id }),
  }
}

const DataSelectionList: FunctionComponent<Props> = ({ content }) => {
  return (
    <ul>
      {content.body.map((row, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <StyledListItem key={`${index}/${row.detailEndpoint}`}>
          <Link as={RouterLink} to={toDetailPage(row.detailEndpoint)} inList>
            {/*
            // @ts-ignore */}
            <DataSelectionFormatter
              // @ts-ignore
              variables={row.content[0]}
              formatter={content.formatters[0]}
              useInline
            />
          </Link>

          {row.content.map(
            (variables, i) =>
              i !== 0 && (
                // @ts-ignore
                <DataSelectionFormatter
                  // eslint-disable-next-line react/no-array-index-key
                  key={i}
                  // @ts-ignore
                  variables={variables}
                  formatter={content.formatters[i]}
                  useInline
                />
              ),
          )}
        </StyledListItem>
      ))}
    </ul>
  )
}

export default DataSelectionList