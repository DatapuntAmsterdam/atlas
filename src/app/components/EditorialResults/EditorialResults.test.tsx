import { fireEvent, render } from '@testing-library/react'
import { CmsType } from '../../../shared/config/cms.config'
import EditorialResults from './EditorialResults'
import { CMSResultItem } from '../../utils/useFromCMS'
import { LOADING_SPINNER_TEST_ID } from '../LoadingSpinner/LoadingSpinner'
import withAppContext from '../../utils/withAppContext'
import {
  ERROR_MESSAGE_RELOAD_BUTTON_TEST_ID,
  ERROR_MESSAGE_TEST_ID,
} from '../ErrorMessage/ErrorMessage'

describe('EditorialResults', () => {
  Object.defineProperty(window, 'location', {
    value: {
      ...window.location,
      reload: jest.fn(),
    },
  })

  const result: CMSResultItem = {
    id: '1',
    specialType: null,
    slug: 'slug',
    coverImage: '123.jpg',
    teaserImage: '456.jpg',
    dateLocale: 'locale',
    label: 'label',
    teaser: 'long text',
    type: CmsType.Article,
    date: '',
    intro: '',
    link: null,
  }

  it('should display the loading indicator', () => {
    const props = {
      query: '',
      label: 'Label',
      isOverviewPage: false,
      type: CmsType.Article,
      errors: [],
      results: [],
    }
    const { queryByTestId, rerender } = render(<EditorialResults {...props} loading />)

    expect(queryByTestId(LOADING_SPINNER_TEST_ID)).toBeDefined()

    rerender(withAppContext(<EditorialResults {...props} loading={false} />))

    expect(queryByTestId(LOADING_SPINNER_TEST_ID)).toBeDefined()
  })

  it('should render the cards', () => {
    const props = {
      query: '',
      label: 'Label',
      loading: false,
      isOverviewPage: false,
      type: CmsType.Article,
      errors: [],
    }
    const { queryAllByTestId, rerender } = render(
      withAppContext(<EditorialResults {...props} results={[]} />),
    )

    expect(queryAllByTestId('editorialCard')).toHaveLength(0)

    // Should render two cards
    rerender(
      withAppContext(<EditorialResults {...props} results={[result, { ...result, id: '2' }]} />),
    )
    expect(queryAllByTestId('editorialCard')).toHaveLength(2)
  })

  // This test could probably be deleted if all files concerning the Editorial part of the app are fully typed.
  it('should render no cards if slug or type is missing from result', () => {
    const props = {
      query: '',
      label: 'Label',
      loading: false,
      isOverviewPage: false,
      type: CmsType.Article,
      errors: [],
    }
    const { queryAllByTestId, rerender } = render(
      withAppContext(<EditorialResults {...props} results={[{ ...result, slug: null }]} />),
    )

    expect(queryAllByTestId('editorialCard')).toEqual([])

    rerender(withAppContext(<EditorialResults {...props} results={[{ ...result, type: null }]} />))
    expect(queryAllByTestId('editorialCard')).toEqual([])
  })

  it('should render AuthAlert', () => {
    const props = {
      query: '',
      label: 'Label',
      loading: false,
      isOverviewPage: false,
      type: CmsType.Article,
      results: [],
      errors: [
        {
          message: 'Auth Error',
          path: ['articleSearch'],
          extensions: {
            label: 'No access',
            code: 'UNAUTHORIZED',
          },
        },
      ],
    }
    const { getByTestId } = render(withAppContext(<EditorialResults {...props} />))

    expect(getByTestId('auth-alert')).toBeDefined()
  })
  it('should render ErrorMessage', () => {
    const props = {
      query: '',
      label: 'Label',
      loading: false,
      isOverviewPage: false,
      type: CmsType.Article,
      results: [],
      errors: [
        {
          message: 'Just an error',
          path: ['articleSearch'],
        },
      ],
    }
    const { getByTestId } = render(withAppContext(<EditorialResults {...props} />))

    expect(getByTestId(ERROR_MESSAGE_TEST_ID)).toBeDefined()
    expect(window.location.reload).not.toHaveBeenCalled()
    fireEvent.click(getByTestId(ERROR_MESSAGE_RELOAD_BUTTON_TEST_ID))
    expect(window.location.reload).toHaveBeenCalled()
  })
})