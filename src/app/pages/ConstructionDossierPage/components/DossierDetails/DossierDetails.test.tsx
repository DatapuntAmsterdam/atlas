import { screen, render, within } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'
import { createUnsecuredToken, Json } from 'jsontokens'
import type { FunctionComponent } from 'react'
import { singleFixture as bouwdossierFixture } from '../../../../../api/iiif-metadata/bouwdossier'
import withAppContext from '../../../../utils/withAppContext'
import formatDossierAccessValue from '../../utils/formatDossierAccessValue'
import AuthTokenContext, { DecodedToken } from '../../AuthTokenContext'
import FilesGallery from '../FilesGallery'
import DossierDetails from './DossierDetails'

jest.mock('../FilesGallery')

const FilesGalleryMock = mocked(FilesGallery)

const VALID_DECODED_TOKEN: DecodedToken = {
  scopes: [],
  sub: 'jane.doe@example.com',
  exp: Date.now() / 1000 + 120,
}

const VALID_TOKEN = createUnsecuredToken(VALID_DECODED_TOKEN as unknown as Json)

// DossierDetails requires the AuthToken context
const wrapper: FunctionComponent = ({ children }) =>
  withAppContext(
    <AuthTokenContext.Provider value={{ token: null, decodedToken: null, isTokenExpired: false }}>
      {children}
    </AuthTokenContext.Provider>,
  )

const wrapperWithToken: FunctionComponent = ({ children }) =>
  withAppContext(
    <AuthTokenContext.Provider
      value={{ token: VALID_TOKEN, decodedToken: VALID_DECODED_TOKEN, isTokenExpired: false }}
    >
      {children}
    </AuthTokenContext.Provider>,
  )

describe('DossierDetails', () => {
  beforeEach(() => {
    FilesGalleryMock.mockImplementation(
      ({
        dossierId,
        document,
        selectedFiles,
        onFileSelectionChange,
        restricted,
        ...otherProps
      }) => {
        return <div {...otherProps} />
      },
    )
  })

  afterEach(() => {
    FilesGalleryMock.mockReset()
  })

  it('renders the title', () => {
    render(withAppContext(<DossierDetails dossierId="SDC9999" dossier={bouwdossierFixture} />), {
      wrapper,
    })

    expect(screen.getByText('Bouw- en omgevingsdossiers')).toBeInTheDocument()
    expect(screen.getAllByText(bouwdossierFixture.titel)[0]).toBeInTheDocument()
  })

  it('renders a definition list', () => {
    render(withAppContext(<DossierDetails dossierId="SDC9999" dossier={bouwdossierFixture} />), {
      wrapper,
    })

    const definitionList = screen.getByTestId('definitionList')
    const listElements = ['titel', 'datering', 'dossier_type', 'dossiernr', 'access']

    listElements.forEach((element) => {
      let value = bouwdossierFixture[element]

      // 'Access' property is translated in the component
      if (element === 'access') {
        value = formatDossierAccessValue(value)
      }

      const definitionDescription = within(definitionList).getByText(`${value as string}`)
      expect(definitionDescription).toBeInTheDocument()
    })
  })

  it('renders olo_liaan_nummer', () => {
    const { rerender } = render(
      withAppContext(
        <DossierDetails
          dossierId="SDC9999"
          dossier={{ ...bouwdossierFixture, olo_liaan_nummer: undefined }}
        />,
      ),
      { wrapper },
    )

    expect(screen.queryByTestId('oloLiaanNumber')).not.toBeInTheDocument()

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const olo_liaan_nummer = 1

    rerender(
      withAppContext(
        <DossierDetails
          dossierId="SDC9999"
          dossier={{ ...bouwdossierFixture, olo_liaan_nummer }}
        />,
      ),
    )

    expect(screen.getByTestId('oloLiaanNumber')).toBeInTheDocument()
  })

  it('renders the subfiles', () => {
    const { rerender } = render(
      withAppContext(
        <DossierDetails
          dossierId="SDC9999"
          dossier={{ ...bouwdossierFixture, olo_liaan_nummer: undefined }}
        />,
      ),
      { wrapper },
    )

    bouwdossierFixture.documenten.forEach((doc, index) => {
      expect(
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        screen.getByText(`${doc.subdossier_titel} (${doc.bestanden.length})`),
      ).toBeInTheDocument()

      expect(screen.getByTestId(`constructionDocuments-${index}`).parentElement).toBeInTheDocument()

      const filesGallery = within(
        screen.getByTestId(`constructionDocuments-${index}`).parentElement as HTMLElement,
      ).getByTestId('filesGallery')
      expect(filesGallery).toBeInTheDocument()
      expect(
        within(
          screen.getByTestId(`constructionDocuments-${index}`).parentElement as HTMLElement,
        ).queryByTestId('oloLiaanNumberDescription'),
      ).not.toBeInTheDocument()
    })

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const olo_liaan_nummer = 1

    rerender(
      withAppContext(
        <DossierDetails
          dossierId="SDC9999"
          dossier={{ ...bouwdossierFixture, olo_liaan_nummer }}
        />,
      ),
    )

    expect(screen.getAllByTestId('oloLiaanNumberDescription')).toHaveLength(
      bouwdossierFixture.documenten.length,
    )
  })

  it('renders the addresses', () => {
    const { rerender } = render(
      withAppContext(
        <DossierDetails dossierId="SDC9999" dossier={{ ...bouwdossierFixture, adressen: [] }} />,
      ),
      { wrapper },
    )

    expect(screen.queryByTestId('constructionDossierAddresses')).not.toBeInTheDocument()

    rerender(withAppContext(<DossierDetails dossierId="SDC9999" dossier={bouwdossierFixture} />))

    expect(screen.getByTestId('constructionDossierAddresses')).toBeInTheDocument()
  })

  it('renders the download all button if the document is public and the user has a valid session', () => {
    render(withAppContext(<DossierDetails dossierId="SDC9999" dossier={bouwdossierFixture} />), {
      wrapper: wrapperWithToken,
    })

    expect(screen.queryByTestId('downloadAllButton')).toBeInTheDocument()
  })

  it('renders no download all button if the document is public and the user has no session', () => {
    render(withAppContext(<DossierDetails dossierId="SDC9999" dossier={bouwdossierFixture} />), {
      wrapper,
    })

    expect(screen.queryByTestId('downloadAllButton')).not.toBeInTheDocument()
  })

  it('renders no download all button if the document is restricted and the user has no extended rights', () => {
    render(
      withAppContext(
        <DossierDetails
          dossierId="SDC9999"
          dossier={{ ...bouwdossierFixture, access: 'RESTRICTED' }}
        />,
      ),
      { wrapper: wrapperWithToken },
    )

    expect(screen.queryByTestId('downloadAllButton')).not.toBeInTheDocument()
  })
})
