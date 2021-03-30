import { Alert, Paragraph, Row, themeSpacing } from '@amsterdam/asc-ui'
import usePromise, { isPending, isRejected } from '@amsterdam/use-promise'
import { FunctionComponent, lazy, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { getBouwdossierById } from '../../../api/iiif-metadata/bouwdossier'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'
import { toConstructionFile } from '../../links'
import useDocumentTitle from '../../utils/useDocumentTitle'
import useParam from '../../utils/useParam'
import { AuthTokenProvider } from './AuthTokenContext'
import FileDetails from './components/FileDetails'
import { fileNameParam, fileUrlParam } from './query-params'

const ImageViewer = lazy(
  () => import(/* webpackChunkName: "ImageViewer" */ './components/ImageViewer'),
)

const StyledRow = styled(Row)`
  justify-content: center;
  margin: ${themeSpacing(5)};
`

interface ConstructionFilePageParams {
  id: string
}

const ConstructionFilePage: FunctionComponent = () => {
  const history = useHistory()
  const { setDocumentTitle } = useDocumentTitle()
  const { id } = useParams<ConstructionFilePageParams>()
  const [fileName] = useParam(fileNameParam)
  const [fileUrl] = useParam(fileUrlParam)
  const result = usePromise(() => getBouwdossierById(id), [id])

  useEffect(() => {
    setDocumentTitle(fileName ? 'Bouwtekening' : false)
  }, [fileName])

  if (isPending(result)) {
    return (
      <StyledRow>
        <LoadingSpinner data-testid="loadingSpinner" />
      </StyledRow>
    )
  }

  if (isRejected(result)) {
    return (
      <Alert level="error" data-testid="errorMessage">
        <Paragraph>
          Er kunnen door een technische storing helaas geen bouw- en omgevingsdossiers worden
          getoond. Probeer het later nog eens.
        </Paragraph>
      </Alert>
    )
  }

  const fileId = `${result.value.stadsdeel}${result.value.dossiernr}`

  return (
    <AuthTokenProvider>
      {fileName && fileUrl && (
        <ImageViewer
          title={result.value.titel}
          fileName={fileName}
          fileUrl={fileUrl}
          onClose={() => history.replace(toConstructionFile(fileId))}
        />
      )}
      {!fileName && <FileDetails fileId={fileId} file={result.value} data-testid="fileDetails" />}
    </AuthTokenProvider>
  )
}

export default ConstructionFilePage
