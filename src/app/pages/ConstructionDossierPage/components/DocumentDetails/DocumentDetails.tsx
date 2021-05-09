import { Download } from '@amsterdam/asc-assets'
import { Alert, Button, Heading, themeColor, themeSpacing } from '@amsterdam/asc-ui'
import { FunctionComponent, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import {
  Bestand,
  Document,
  Single as Bouwdossier,
} from '../../../../../api/iiif-metadata/bouwdossier'
import { getUserScopes, userIsAuthenticated } from '../../../../../shared/ducks/user/user'
import { SCOPES } from '../../../../../shared/services/auth/auth'
import { FEATURE_KEYCLOAK_AUTH, isFeatureEnabled } from '../../../../features'
import { useAuthToken } from '../../AuthTokenContext'
import ContentBlock, { DefinitionList, DefinitionListItem, SubHeading } from '../ContentBlock'
import FilesGallery from '../FilesGallery'
import LinkButton from '../LinkButton'
import LoginLinkButton from '../LoginLinkButton'
import RequestDownloadModal from '../RequestDownloadModal'
import SelectFilesModal from '../SelectFilesModal'

export interface DocumentDetailsProps {
  dossierId: string
  dossier: Bouwdossier
  document: Document
  onRequestLoginLink: () => void
}

const DocumentHeaderBlock = styled(ContentBlock)`
  display: flex;
`

const DocumentHeading = styled(SubHeading)`
  margin-right: auto;
`

const DownloadButton = styled(Button)`
  margin-left: ${themeSpacing(2)};
  flex-shrink: 0;
`

const GalleryContainer = styled.div`
  border-bottom: 1px solid ${themeColor('tint', 'level3')};
  padding: ${themeSpacing(5, 5, 10, 5)};
`

const StyledAlert = styled(Alert)`
  margin-bottom: ${themeSpacing(5)} !important;
`

const DocumentDetails: FunctionComponent<DocumentDetailsProps> = ({
  dossierId,
  dossier,
  document,
  onRequestLoginLink,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<Bestand[]>([])
  const [showSelectFilesModal, setShowSelectFilesModal] = useState(false)
  const [showRequestDownloadModal, setShowRequestDownloadModal] = useState(false)
  const scopes = useSelector(getUserScopes)
  const token = useAuthToken()

  // Only allow downloads from a signed in user if authenticated with Keycloak.
  // TODO: This logic can be removed once we switch to Keycloak entirely.
  const authenticated = useSelector(userIsAuthenticated)
  const disableDownload = authenticated && !isFeatureEnabled(FEATURE_KEYCLOAK_AUTH)

  const restricted = dossier.access === 'RESTRICTED'
  const hasRights = useMemo(() => {
    // Only users with extended rights can view restricted documents.
    if (restricted) {
      return scopes.includes(SCOPES['BD/X'])
    }

    // Only users with read rights, or with a login link token can view public documents.
    return scopes.includes(SCOPES['BD/R']) || !!token
  }, [restricted, scopes, token])

  function onDownloadFiles() {
    if (selectedFiles.length === 0) {
      setShowSelectFilesModal(true)
    } else {
      setShowRequestDownloadModal(true)
    }
  }

  return (
    <>
      {showSelectFilesModal && <SelectFilesModal onClose={() => setShowSelectFilesModal(false)} />}
      {showRequestDownloadModal && (
        <RequestDownloadModal
          files={selectedFiles}
          onClose={() => setShowRequestDownloadModal(false)}
        />
      )}
      <DocumentHeaderBlock>
        {document.subdossier_titel && (
          <>
            <DocumentHeading forwardedAs="h3">
              {`${document.subdossier_titel} (${document.bestanden.length})`}
            </DocumentHeading>
            {hasRights && !disableDownload && (
              <DownloadButton
                type="button"
                variant="primary"
                iconLeft={<Download />}
                onClick={onDownloadFiles}
              >
                Downloaden
              </DownloadButton>
            )}
          </>
        )}
      </DocumentHeaderBlock>
      {dossier.olo_liaan_nummer && (
        <DefinitionList data-testid="oloLiaanNumberDescription">
          {document.document_omschrijving && (
            <DefinitionListItem term="Beschrijving">
              {document.document_omschrijving}
            </DefinitionListItem>
          )}
          {document.oorspronkelijk_pad.length > 0 && (
            <DefinitionListItem term="Oorspronkelijk pad">
              {document.oorspronkelijk_pad.join(', ')}
            </DefinitionListItem>
          )}
          <DefinitionListItem term="Openbaarheid">{document.access}</DefinitionListItem>
        </DefinitionList>
      )}
      <GalleryContainer>
        {document.bestanden.length > 0 ? (
          <>
            {!hasRights &&
              (restricted ? (
                <StyledAlert level="info" dismissible data-testid="noExtendedRights">
                  <div>
                    Medewerkers/ketenpartners van Gemeente Amsterdam met extra bevoegdheden kunnen{' '}
                    <LoginLinkButton>inloggen</LoginLinkButton> om alle bouw- en omgevingsdossiers
                    te bekijken.
                  </div>
                </StyledAlert>
              ) : (
                <StyledAlert level="info" dismissible data-testid="noRights">
                  <div>
                    U kunt hier{' '}
                    <LinkButton type="button" onClick={onRequestLoginLink}>
                      toegang aanvragen
                    </LinkButton>{' '}
                    om de om bouw- en omgevingsdossiers in te zien. Medewerkers/ketenpartners van
                    Gemeente Amsterdam kunnen <LoginLinkButton>inloggen</LoginLinkButton> om deze te
                    bekijken.
                  </div>
                </StyledAlert>
              ))}
            <FilesGallery
              data-testid="filesGallery"
              dossierId={dossierId}
              document={document}
              selectedFiles={selectedFiles}
              onFileSelectionChange={(files) => setSelectedFiles(files)}
              disabled={!hasRights}
            />
          </>
        ) : (
          <Heading as="em" data-testid="noResults">
            Geen bouwtekening(en) beschikbaar.
          </Heading>
        )}
      </GalleryContainer>
    </>
  )
}

export default DocumentDetails
