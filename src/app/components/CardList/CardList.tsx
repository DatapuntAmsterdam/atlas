import React from 'react'
import { Card, CardContent, Heading, themeColor, themeSpacing } from '@datapunt/asc-ui'
import styled from '@datapunt/asc-core'
import EditorialCard from '../EditorialCard'
import ErrorMessage from '../ErrorMessage/ErrorMessage'
import { CMSResultItem, CMSResults } from '../../utils/useFromCMS'

const StyledCard = styled(Card)`
  border-top: 2px solid;
  align-items: flex-start;
  height: 100%;
  width: 100%;
  background-color: ${themeColor('tint', 'level2')}
    // Override the margin-bottom of the Card component when used in a CardContainer
    & {
    margin-bottom: 0px;
  }
`

const StyledCardContent = styled(CardContent)`
  padding: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
`

const StyledHeading = styled(Heading)`
  margin: ${themeSpacing(3, 0, 6)};
`

type CardListProps = {
  title: string
  results?: CMSResultItem[]
} & CMSResults

const CardList: React.FC<CardListProps> = ({ title, loading, error, results, fetchData }) => (
  <StyledCard isLoading={loading}>
    <StyledCardContent>
      {/*
          // @ts-ignore */}
      <StyledHeading forwardedAs="h4" styleAs="h3">
        {title}
      </StyledHeading>
      <div>
        {error && <ErrorMessage onClick={() => fetchData()} />}
        {results &&
          results.length > 0 &&
          results.map(
            ({ id, type, specialType, shortTitle, title: cardTitle, linkProps, teaserImage }) => (
              <EditorialCard
                {...{
                  key: id,
                  id,
                  type,
                  specialType,
                  title: shortTitle || cardTitle,
                  image: teaserImage,
                  imageDimensions: [44, 44],
                  compact: true, // Important: renders a simplified version of this card
                  ...linkProps,
                }}
              />
            ),
          )}
      </div>
    </StyledCardContent>
  </StyledCard>
)

export default CardList
