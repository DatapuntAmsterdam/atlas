import { ChevronRight } from '@datapunt/asc-assets'
import styled from '@datapunt/asc-core'
import {
  breakpoint,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Heading,
  Icon,
  Link,
  Paragraph,
  styles,
  svgFill,
  themeColor,
  themeSpacing,
} from '@datapunt/asc-ui'
import PropTypes from 'prop-types'
import React from 'react'
import { focusOutline } from './services/styles'

const StyledHeading = styled(Heading)`
  margin-bottom: 0;
`

const StyledIcon = styled(Icon)`
  @media screen and ${breakpoint('max-width', 'mobileL')} {
    max-width: 36px;
  }
`

const StyledCard = styled(Card)`
  width: 100%;
  margin-bottom: 0;
`

const StyledLink = styled(Link)`
  position: relative;
  width: 100%;
  break-inside: avoid;
  display: flex;
  margin-bottom: ${themeSpacing(2)};

  &:hover{
    ${StyledHeading} {
      color: ${themeColor('secondary')};
      text-decoration: underline;}

    ${styles.IconStyle} {
      ${svgFill('secondary')};
    }
  }

  &:focus {
    background: none;
    ${StyledCard}::after {
      ${focusOutline()}
    }
    
  }

  &:last-child {
    margin-bottom: 0;
  }
}
`

const StyledCardMedia = styled(CardMedia)`
  max-width: 20%;

  ${styles.CardMediaWrapperStyle} {
    padding: ${themeSpacing(2)};
  }

  @media screen and ${breakpoint('min-width', 'tabletS')} and ${breakpoint(
  'max-width',
  'tabletM',
)} {
      max-width: 15%;
    }
  }
`

const StyledCardContent = styled(CardContent)`
  min-height: inherit;
  align-self: flex-start;
  padding: ${themeSpacing(2)};
`

const StyledCardActions = styled(CardActions)`
  padding-left: 0 !important;
`

const StyledParagraph = styled(Paragraph)`
  font-size: 14px;
  line-height: 17px;
  height: 34px; // two times the line-height
  overflow: hidden; // make sure the text doesn't falls outside this Paragraph
`

const NavigationCard = ({
  loading,
  showError,
  CardIcon,
  title,
  description,
  href,
  ...otherProps
}) => (
  <StyledLink href={href} linkType="blank" {...otherProps}>
    <StyledCard horizontal loading={loading} animateLoading={!showError}>
      <StyledCardMedia backgroundColor="level2">
        <CardIcon />
      </StyledCardMedia>
      <StyledCardContent>
        <StyledHeading $as="h4">{title}</StyledHeading>
        <StyledParagraph>{description}</StyledParagraph>
      </StyledCardContent>
      <StyledCardActions>
        <StyledIcon size={15}>
          <ChevronRight />
        </StyledIcon>
      </StyledCardActions>
    </StyledCard>
  </StyledLink>
)

NavigationCard.defaultProps = {
  loading: false,
  showError: false,
}

NavigationCard.propTypes = {
  loading: PropTypes.bool,
  showError: PropTypes.bool,
  CardIcon: PropTypes.shape({}).isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
}

export default NavigationCard
