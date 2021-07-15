import { Modal, ThemeProvider } from '@amsterdam/asc-ui'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { createUnsecuredToken, Json } from 'jsontokens'
import type { FunctionComponent } from 'react'
import { useEffect } from 'react'
import { mocked } from 'ts-jest/utils'
import type { Bestand } from '../../../../../api/iiif-metadata/bouwdossier'
import requestDownloadLink from '../../../../../api/iiif/requestDownloadLink'
import AuthTokenContext, { DecodedToken } from '../../AuthTokenContext'
import RequestDownloadModal from './RequestDownloadModal'

jest.mock('@amsterdam/asc-ui', () => {
  const originalModule = jest.requireActual('@amsterdam/asc-ui')

  return {
    __esModule: true,
    ...originalModule,
    Modal: jest.fn(),
  }
})

jest.mock('../../../../../api/iiif/requestDownloadLink')

const ModalMock = mocked(Modal)
const requestDownloadLinkMock = mocked(requestDownloadLink)

const VALID_DECODED_TOKEN: DecodedToken = {
  scopes: [],
  sub: 'jane.doe@example.com',
  exp: Date.now() / 1000 + 120,
}

const VALID_TOKEN = createUnsecuredToken(VALID_DECODED_TOKEN as unknown as Json)

const MOCK_FILES: Bestand[] = [
  { filename: 'foo.png', url: 'https://fake.com/some/path/foo.png' },
  { filename: 'bar.png', url: 'https://fake.com/some/path/bar.png' },
]

const MOCK_URLS = MOCK_FILES.map((file) => file.url)

const wrapper: FunctionComponent = ({ children }) => (
  <ThemeProvider>
    <AuthTokenContext.Provider
      value={{ token: VALID_TOKEN, decodedToken: VALID_DECODED_TOKEN, isTokenExpired: false }}
    >
      {children}
    </AuthTokenContext.Provider>
  </ThemeProvider>
)

describe('RequestDownloadModal', () => {
  beforeEach(() => {
    ModalMock.mockImplementation(({ children, ...otherProps }) => (
      <div {...otherProps}>{children}</div>
    ))

    requestDownloadLinkMock.mockReturnValue(new Promise(() => {}))
  })

  afterEach(() => {
    ModalMock.mockClear()
    requestDownloadLinkMock.mockClear()
  })

  it('requests a download link', () => {
    requestDownloadLinkMock.mockReturnValue(new Promise(() => {}))

    render(<RequestDownloadModal files={MOCK_FILES} onClose={() => {}} />, { wrapper })

    expect(requestDownloadLinkMock).toHaveBeenCalledWith(MOCK_URLS, VALID_TOKEN)
  })

  it('closes when requested by the modal', () => {
    ModalMock.mockImplementation(({ children, onClose, ...otherProps }) => {
      useEffect(() => {
        onClose?.()
      }, [])

      return <div {...otherProps}>{children}</div>
    })

    const onClose = jest.fn()

    render(<RequestDownloadModal files={MOCK_FILES} onClose={onClose} />, { wrapper })

    expect(onClose).toHaveBeenCalled()
  })

  it('closes when pressing the close button', () => {
    const onClose = jest.fn()

    render(<RequestDownloadModal files={MOCK_FILES} onClose={onClose} />, { wrapper })

    fireEvent.click(screen.getByTitle('Sluit'))

    expect(onClose).toHaveBeenCalled()
  })

  it('shows the loading message', () => {
    render(<RequestDownloadModal files={MOCK_FILES} onClose={() => {}} />, { wrapper })

    expect(screen.getByTestId('loadingMessage')).toBeInTheDocument()
  })

  it('shows the error message', async () => {
    requestDownloadLinkMock.mockReturnValue(Promise.reject(new Error('Whoopsie')))

    render(<RequestDownloadModal files={MOCK_FILES} onClose={() => {}} />, { wrapper })

    await waitFor(() => expect(screen.getByTestId('errorMessage')).toBeInTheDocument())
  })

  it('handles a retry the in the error state', async () => {
    requestDownloadLinkMock.mockReturnValue(Promise.reject(new Error('Whoopsie')))

    act(() => {
      render(<RequestDownloadModal files={MOCK_FILES} onClose={() => {}} />, { wrapper })
    })

    await act(async () => {
      const retryButton = await waitFor(() => screen.findByText('Probeer opnieuw'))
      fireEvent.click(retryButton)
    })

    expect(requestDownloadLinkMock).toHaveBeenCalledTimes(2)
  })

  it('handles closing the modal in the error state', async () => {
    requestDownloadLinkMock.mockReturnValue(Promise.reject(new Error('Whoopsie')))

    const onClose = jest.fn()

    render(<RequestDownloadModal files={MOCK_FILES} onClose={onClose} />, { wrapper })

    const closeButton = await waitFor(() => screen.findByText('Annuleren'))

    fireEvent.click(closeButton)
    expect(onClose).toHaveBeenCalled()
  })

  it('shows the success message', async () => {
    requestDownloadLinkMock.mockReturnValue(Promise.resolve())

    render(<RequestDownloadModal files={MOCK_FILES} onClose={() => {}} />, { wrapper })

    await waitFor(() => expect(screen.getByTestId('successMessage')).toBeInTheDocument())
  })

  it('handles closing the modal in the success state', async () => {
    requestDownloadLinkMock.mockReturnValue(Promise.resolve())

    const onClose = jest.fn()

    render(<RequestDownloadModal files={MOCK_FILES} onClose={onClose} />, { wrapper })

    const closeButton = await waitFor(() => screen.findByText('Sluiten'))

    fireEvent.click(closeButton)
    expect(onClose).toHaveBeenCalled()
  })
})
