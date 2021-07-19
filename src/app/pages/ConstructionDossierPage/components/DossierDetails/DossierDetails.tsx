import { Download } from '@amsterdam/asc-assets'
import { Button, Heading, Link, List, ListItem, themeSpacing } from '@amsterdam/asc-ui'
import type { FunctionComponent } from 'react'
import { useMemo, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import styled from 'styled-components'
import type {
  Bestand,
  BouwdossierAccess,
  Single as Bouwdossier,
} from '../../../../../api/iiif-metadata/bouwdossier'
import { getScopes, isAuthenticated, SCOPES } from '../../../../../shared/services/auth/auth'
import { FEATURE_KEYCLOAK_AUTH, isFeatureEnabled } from '../../../../features'
import { toDataDetail } from '../../../../links'
import formatAddresses from '../../utils/formatAddresses'
import formatDossierAccessValue from '../../utils/formatDossierAccessValue'
import hasUserRights from '../../utils/hasUserRights'
import { useAuthToken } from '../../AuthTokenContext'
import ContentBlock, { DefinitionList, DefinitionListItem, SubHeading } from '../ContentBlock'
import DocumentDetails from '../DocumentDetails'
import DossierDetailsModal from '../DossierDetailsModal'

const Header = styled.header`
  padding: ${themeSpacing(5)};
`

const PageWrapper = styled.article`
  padding-bottom: ${themeSpacing(18)};
`

const DownloadButton = styled(Button)`
  margin-top: ${themeSpacing(5)};
  margin-left: ${themeSpacing(2)};
  flex-shrink: 0;
`

export type DossierDetailsModalType = 'login' | 'select' | 'download' | 'restricted'

export interface DossierDetailsProps {
  dossierId: string
  dossier: Bouwdossier
}

const DossierDetails: FunctionComponent<DossierDetailsProps> = ({
  dossierId,
  dossier,
  ...otherProps
}) => {
  const [selectedFiles, setSelectedFiles] = useState<Bestand[]>([])
  const [currentModal, setCurrentModal] = useState<DossierDetailsModalType | null>(null)
  const scopes = getScopes()
  const { token, isTokenExpired } = useAuthToken()
  const addresses = useMemo(() => formatAddresses(dossier.adressen), [dossier.adressen])
  const sortedDocuments = useMemo(
    () =>
      dossier.documenten.sort((a, b) =>
        (a.subdossier_titel ?? '').localeCompare(b.subdossier_titel ?? ''),
      ),
    [dossier.documenten],
  )

  // Only allow downloads from a signed in user if authenticated with Keycloak.
  // TODO: This logic can be removed once we switch to Keycloak entirely.
  const disableDownload = isAuthenticated() && !isFeatureEnabled(FEATURE_KEYCLOAK_AUTH)
  // Check user rights by the primary dossier object's access prop or if every child document is 'RESTRICTED'
  const restricted =
    dossier.access === 'RESTRICTED' ||
    dossier.documenten.every((doc) => doc.access === 'RESTRICTED')
  const hasRights = useMemo(
    () => hasUserRights(restricted, scopes, token, isTokenExpired),
    [scopes, token],
  )
  const restrictedFiles = useMemo(() => {
    return dossier.documenten
      .filter((document) => !hasDocumentAccess(document.access))
      .map((document) => document.bestanden)
      .flat()
  }, [dossier])

  function onDownloadFiles(files: Bestand[]) {
    if (files.length === 0) {
      setCurrentModal('select')
    } else {
      setSelectedFiles(files)
      setCurrentModal('download')
    }
  }

  function hasDocumentAccess(access: BouwdossierAccess) {
    if (access === 'PUBLIC') {
      return true
    }

    return scopes.includes(SCOPES['BD/X'])
  }

  function handleDownloadAllClick() {
    // For each dossier document - get the files and then merge each document's results into a single array
    const files = dossier.documenten
      .filter((doc) => hasDocumentAccess(doc.access))
      .map((doc) => doc.bestanden)
      .flat()

    setSelectedFiles(files)

    // If we have excluded files we need to list them in a modal
    if (!restrictedFiles.length) {
      setCurrentModal('download')
    } else {
      setCurrentModal('restricted')
    }
  }

  return (
    <>
      <DossierDetailsModal
        currentModal={currentModal}
        setModal={setCurrentModal}
        selectedFiles={selectedFiles}
        restrictedFiles={restrictedFiles}
      />

      <PageWrapper {...otherProps}>
        <Header>
          <Heading data-testid="dossierDetailsTitle">{dossier.titel}</Heading>
          <SubHeading forwardedAs="h2">Bouw- en omgevingsdossiers</SubHeading>
        </Header>

        <DefinitionList data-testid="definitionList">
          <DefinitionListItem term="Titel">{dossier.titel}</DefinitionListItem>
          <DefinitionListItem term="Datering">{dossier.datering}</DefinitionListItem>
          <DefinitionListItem term="Type">{dossier.dossier_type}</DefinitionListItem>
          <DefinitionListItem term="Dossiernummer">{dossier.dossiernr}</DefinitionListItem>
          <DefinitionListItem term="Openbaarheid">
            {formatDossierAccessValue(dossier.access)}
          </DefinitionListItem>
          {dossier.olo_liaan_nummer ? (
            <DefinitionListItem term="OLO of liaan nummer" data-testid="oloLiaanNumber">
              {dossier.olo_liaan_nummer}
            </DefinitionListItem>
          ) : null}
        </DefinitionList>

        {hasRights && !disableDownload && !restricted && (
          <DownloadButton
            type="button"
            variant="primary"
            iconLeft={<Download />}
            data-testid="downloadAllButton"
            onClick={handleDownloadAllClick}
          >
            Download geheel dossier
          </DownloadButton>
        )}

        {sortedDocuments.map((document, index) => (
          <DocumentDetails
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            index={index}
            dossierId={dossierId}
            dossier={dossier}
            document={document}
            onRequestLoginLink={() => setCurrentModal('login')}
            onDownloadFiles={onDownloadFiles}
          />
        ))}

        {addresses.length && (
          <ContentBlock data-testid="constructionDossierAddresses">
            <SubHeading forwardedAs="h3">Adressen</SubHeading>
            <List>
              {addresses.map((address) => (
                <ListItem key={address.id}>
                  <Link
                    as={RouterLink}
                    inList
                    to={toDataDetail({
                      type: 'bag',
                      subtype: address.type,
                      id: address.id,
                    })}
                  >
                    <span>{address.label}</span>
                  </Link>
                </ListItem>
              ))}
            </List>
          </ContentBlock>
        )}
      </PageWrapper>
    </>
  )
}

export default DossierDetails
