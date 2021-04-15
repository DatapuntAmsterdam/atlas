import {
  Column,
  CompactThemeProvider,
  Footer as FooterComponent,
  FooterBottom,
  FooterSection,
  FooterTop,
  Link,
  List,
  ListItem,
  Paragraph,
  Row,
  themeSpacing,
} from '@amsterdam/asc-ui'
import { FunctionComponent } from 'react'
import styled from 'styled-components'
import {
  FOOTER_LINKS_COLOFON,
  FOOTER_LINKS_HELP,
  FOOTER_LINKS_SOCIAL,
  FOOTER_LINK_PRIVACY,
} from '../../../shared/config/content-links'
import { openFeedbackForm } from '../Modal/FeedbackModal'
import FooterLinks from './FooterLinks'

const PrivacyLink = styled(Link)`
  margin-bottom: ${themeSpacing(3)};
`

const StyledParagraph = styled(Paragraph)`
  margin-bottom: ${themeSpacing(5)};
`

const Button = styled.button`
  background-color: transparent;
`

export const FOOTER_ID = 'footer'

const Footer: FunctionComponent = () => (
  <CompactThemeProvider>
    <FooterComponent id={FOOTER_ID}>
      <FooterTop>
        <Row>
          <Column
            wrap
            span={{ small: 1, medium: 2, big: 2, large: 4, xLarge: 4 }}
            data-testid="footerColofon"
          >
            <FooterSection title="Colofon">
              <FooterLinks links={FOOTER_LINKS_COLOFON} />
            </FooterSection>
          </Column>
          <Column
            wrap
            span={{ small: 1, medium: 2, big: 2, large: 4, xLarge: 4 }}
            data-testid="footerFollowUs"
          >
            <FooterSection title="Volg de gemeente">
              <FooterLinks links={FOOTER_LINKS_SOCIAL} />
            </FooterSection>
          </Column>
          <Column
            wrap
            span={{ small: 1, medium: 2, big: 2, large: 4, xLarge: 4 }}
            data-testid="footerQuestions"
          >
            <FooterSection title="Vragen">
              <StyledParagraph>
                Heeft u een vraag en kunt u het antwoord niet vinden op deze website? Of heeft u
                bevindingen? Neem dan contact met ons op.
              </StyledParagraph>
              <FooterLinks links={FOOTER_LINKS_HELP}>
                <ListItem>
                  {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                  <Link $darkBackground type="button" as={Button} inList onClick={openFeedbackForm}>
                    Feedback geven
                  </Link>
                </ListItem>
              </FooterLinks>
            </FooterSection>
          </Column>
        </Row>
      </FooterTop>
      <FooterBottom>
        <List>
          <ListItem>
            <PrivacyLink
              data-testid={FOOTER_LINK_PRIVACY.testId}
              href={FOOTER_LINK_PRIVACY.href}
              inList
            >
              {FOOTER_LINK_PRIVACY.title}
            </PrivacyLink>
          </ListItem>
        </List>
      </FooterBottom>
    </FooterComponent>
  </CompactThemeProvider>
)

export default Footer
