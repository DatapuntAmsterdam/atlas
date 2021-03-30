import { fireEvent, render } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'
import { useMatomo } from '@datapunt/matomo-tracker-react'
import LoginLinkButton from './LoginLinkButton'
import useDocumentTitle from '../../../../utils/useDocumentTitle'
import { login } from '../../../../../shared/services/auth/auth'

jest.mock('@datapunt/matomo-tracker-react')
jest.mock('../../../../utils/useDocumentTitle')
jest.mock('../../../../../shared/services/auth/auth')

const useMatomoMock = mocked(useMatomo)
const useDocumentTitleMock = mocked(useDocumentTitle)
const loginMock = mocked(login)

describe('LoginLinkButton', () => {
  beforeEach(() => {
    useMatomoMock.mockReturnValue({ trackEvent: jest.fn() } as any)
    useDocumentTitleMock.mockReturnValue({ documentTitle: 'This is the title' } as any)
    loginMock.mockImplementation(() => {})
  })

  afterEach(() => {
    useMatomoMock.mockReset()
    useDocumentTitleMock.mockReset()
    loginMock.mockReset()
  })

  it('renders the button', () => {
    const { container } = render(<LoginLinkButton />)

    expect(container.firstChild).toBeDefined()
  })

  it('renders the children', () => {
    const { getByText } = render(<LoginLinkButton>Hello World!</LoginLinkButton>)

    expect(getByText('Hello World!')).toBeDefined()
  })

  it('passes the other props', () => {
    const { getByTestId } = render(<LoginLinkButton data-testid="loginButton" />)

    expect(getByTestId('loginButton')).toBeDefined()
  })

  it('triggers the login when pressed', () => {
    const { getByTestId } = render(<LoginLinkButton data-testid="loginButton" />)

    fireEvent.click(getByTestId('loginButton'))
    expect(loginMock).toBeCalled()
  })

  it('tracks the login when pressed', () => {
    const trackEventMock = jest.fn()
    useMatomoMock.mockReturnValue({ trackEvent: trackEventMock } as any)

    const { getByTestId } = render(<LoginLinkButton data-testid="loginButton" />)

    fireEvent.click(getByTestId('loginButton'))

    expect(trackEventMock).toBeCalledWith({
      action: 'inloggen',
      category: 'login',
      name: 'This is the title',
    })
  })
})
