import { ThemeProvider } from '@amsterdam/asc-ui'
import { screen, render } from '@testing-library/react'
import type { FunctionComponent } from 'react'
import { mocked } from 'ts-jest/utils'
import requestDownloadLink from '../../../../../api/iiif/requestDownloadLink'
import withAppContext from '../../../../utils/withAppContext'
import AuthTokenContext from '../../AuthTokenContext'
import DossierDetailsModal from './DossierDetailsModal'

jest.mock('../../../../../api/iiif/requestDownloadLink')

const requestDownloadLinkMock = mocked(requestDownloadLink)

// Download modal requires the AuthToken context
const wrapper: FunctionComponent = ({ children }) =>
  withAppContext(
    <AuthTokenContext.Provider value={{ token: null, decodedToken: null, isTokenExpired: false }}>
      {children}
    </AuthTokenContext.Provider>,
  )

describe('DossierDetailsModal', () => {
  it('renders the modal', () => {
    render(
      <ThemeProvider>
        <DossierDetailsModal
          currentModal={null}
          setModal={() => {}}
          selectedFiles={[]}
          restrictedFiles={[]}
        />
      </ThemeProvider>,
    )
  })

  it('renders the request login link modal if current modal is login', () => {
    render(
      <ThemeProvider>
        <DossierDetailsModal
          currentModal="login"
          setModal={() => {}}
          selectedFiles={[]}
          restrictedFiles={[]}
        />
      </ThemeProvider>,
    )

    expect(screen.getByText('Toegang aanvragen bouw- en omgevingdossiers')).toBeInTheDocument()
  })

  it('renders the select files prompt modal if current modal is select', () => {
    render(
      <ThemeProvider>
        <DossierDetailsModal
          currentModal="select"
          setModal={() => {}}
          selectedFiles={[]}
          restrictedFiles={[]}
        />
      </ThemeProvider>,
    )

    expect(screen.getByText('Selecteer eerst documenten')).toBeInTheDocument()
  })

  it('renders the downloading modal if current modal is download', () => {
    requestDownloadLinkMock.mockReturnValue(new Promise(() => {}))

    render(
      <ThemeProvider>
        <DossierDetailsModal
          currentModal="download"
          setModal={() => {}}
          selectedFiles={[]}
          restrictedFiles={[]}
        />
      </ThemeProvider>,
      { wrapper },
    )

    expect(screen.getByText('Downloaden bouw- en omgevingsdossiers')).toBeInTheDocument()

    requestDownloadLinkMock.mockClear()
  })

  it('renders the excluded files list modal if current modal is restricted', () => {
    render(
      <ThemeProvider>
        <DossierDetailsModal
          currentModal="restricted"
          setModal={() => {}}
          selectedFiles={[]}
          restrictedFiles={[]}
        />
      </ThemeProvider>,
    )

    expect(
      screen.getByText('De volgende documenten zijn uitgesloten van uw download'),
    ).toBeInTheDocument()
  })
})
