import React from 'react'
import { connect } from 'react-redux'
import {
  Column,
  Row,
  Spinner,
  Publication,
  CustomHTMLBlock,
  Summary,
  PublicationContent,
  ArticleHeader,
  ArticleMetaList,
  Downloader,
} from '@datapunt/asc-ui'
import Footer from '../../components/Footer/Footer'
import SHARED_CONFIG from '../../../shared/services/shared-config/shared-config'
import { getLocationPayload } from '../../../store/redux-first-router/selectors'
import useDataFetching from '../../utils/useDataFetching'

/* istanbul ignore next */
const PublicationsPage = ({ endpoint }) => {
  const { fetchData, results, loading } = useDataFetching()

  React.useEffect(() => {
    fetchData(endpoint)
  }, [])

  const {
    title,
    created,
    // changed
    body,
    field_file_size: fileSize,
    field_file_type: fileType,
    field_publication_source: source,
  } = results ? results.data[0].attributes : {}

  return (
    <div className="c-dashboard__page o-max-width">
      <Row>
        <Column wrap="true" span={{ small: 1, medium: 1, big: 6, large: 12, xLarge: 12 }}>
          {loading && (
            <div className="loading-indicator">
              <Spinner size={100} color="secondary" />
            </div>
          )}
          {!loading && body && (
            <Publication>
              <Row>
                <Column wrap span={{ small: 1, medium: 2, big: 6, large: 12, xLarge: 12 }}>
                  <Column span={{ small: 1, medium: 2, big: 6, large: 12, xLarge: 12 }}>
                    <PublicationContent>
                      <ArticleHeader title={title} />
                      <ArticleMetaList
                        fields={[
                          { id: 1, label: source },
                          { id: 2, label: fileSize },
                          { id: 3, label: fileType },
                          { id: 4, label: created },
                        ]}
                      />
                    </PublicationContent>
                  </Column>
                  <Column span={{ small: 1, medium: 2, big: 3, large: 6, xLarge: 6 }}>
                    <Downloader
                      imageSrc="https://acc.cms.data.amsterdam.nl/sites/default/files/images/2019-factsheet-jeugdwerkloosheid-2014-2018.png"
                      description={`Download PDF (${fileSize})`}
                      onClick={() => console.log('download')}
                    />
                  </Column>
                  <Column span={{ small: 1, medium: 2, big: 3, large: 6, xLarge: 6 }}>
                    <PublicationContent>
                      <Summary>
                        Optioneel hier kan een kleine omschrijving komen. Van de 146.500 Amsterdamse
                        jongeren in de leeftijd van 15 tot en met 26 jaar waren er in 2018 gemiddeld
                        6.100 werkloos, dit komt neer op 6,2% van de beroepsbevolking.
                      </Summary>
                      <CustomHTMLBlock
                        dangerouslySetInnerHTML={{
                          __html: body.processed,
                        }}
                      />
                    </PublicationContent>
                  </Column>
                </Column>
              </Row>
            </Publication>
          )}
        </Column>
      </Row>
      {/* <Row>
        <Column wrap="true" span={{ small: 1, medium: 1, big: 6, large: 12, xLarge: 12 }}>
        </Column>
      </Row> */}
      <Footer />
    </div>
  )
}

const mapStateToProps = state => ({
  endpoint: `${SHARED_CONFIG.CMS_ROOT}publication?filter[drupal_internal__nid]=${
    getLocationPayload(state).id
  } `,
})

export default connect(
  mapStateToProps,
  null,
)(PublicationsPage)
