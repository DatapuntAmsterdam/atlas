import { useMatomo } from '@datapunt/matomo-tracker-react'
import { shallow } from 'enzyme'
import configureMockStore from 'redux-mock-store'
import { getMapOverlays } from '../../map/ducks/map/selectors'
import { setViewMode, ViewMode } from '../../shared/ducks/ui/ui'
import PARAMETERS from '../../store/parameters'
import { toDataDetail, toGeoSearch } from '../../store/redux-first-router/actions'
import { fetchPanoramaHotspotRequest } from '../ducks/actions'
import {
  getDetailReference,
  getLabelObjectByTags,
  getPanorama,
  getPanoramaLocation,
  getPanoramaTags,
} from '../ducks/selectors'
import { getOrientation, loadScene } from '../services/marzipano/marzipano'
import PanoramaContainer from './PanoramaContainer'

jest.mock('@datapunt/matomo-tracker-react')
jest.mock('../../map/ducks/map/selectors')
jest.mock('../services/marzipano/marzipano')
jest.mock('../ducks/selectors')
jest.mock('../../shared/ducks/ui/ui')

describe('PanoramaContainer', () => {
  const initialState = {}
  const store = configureMockStore()({ ...initialState })
  const props = {
    isFullscreen: false,
    detailReference: [],
  }

  getPanorama.mockImplementation(() => ({
    id: 'ABC',
    heading: 999,
    image: 'ABC_IMAGE.jpg',
    date: '2012-12-12T00:00:00.000Z',
    location: [1, 2],
  }))
  getLabelObjectByTags.mockImplementation(() => ({ label: 'Meest recent' }))
  getPanoramaTags.mockImplementation(() => ['mission-bi'])
  setViewMode.mockImplementation(() => ({ type: 'some type' }))
  getDetailReference.mockImplementation(() => [])
  getMapOverlays.mockImplementation(() => [])
  getPanoramaLocation.mockImplementation(() => [])
  useMatomo.mockReturnValue({ trackEvent: jest.fn() })

  beforeEach(() => {
    jest.spyOn(store, 'dispatch')
  })

  afterEach(() => {
    store.dispatch.mockClear()
  })

  it('should load new scene when panorama image information changes', () => {
    getOrientation.mockReturnValue({ heading: 999, pitch: 10, fov: 80 })
    const wrapper = shallow(<PanoramaContainer {...props} store={store} />)
      .dive()
      .dive()
      .dive()

    wrapper.instance().hotspotClickHandler('XYZ')
    expect(store.dispatch).toHaveBeenCalledWith(fetchPanoramaHotspotRequest({ id: 'XYZ' }))
  })

  it('should toggle size of panorama image', () => {
    jest.spyOn(store, 'dispatch')
    const wrapper = shallow(<PanoramaContainer {...props} store={store} />)
      .dive()
      .dive()
      .dive()

    expect(wrapper.instance().props.isFullscreen).toBe(false)

    wrapper.instance().toggleFullscreen()
    expect(store.dispatch).toHaveBeenCalledWith(setViewMode(ViewMode.Full))

    wrapper.setProps({ isFullscreen: true })

    wrapper.instance().toggleFullscreen()
    expect(store.dispatch).toHaveBeenCalledWith(setViewMode(ViewMode.Split))
  })

  it('should load new scene when panorama image information changes', () => {
    loadScene.mockImplementation()
    const wrapper = shallow(<PanoramaContainer {...props} store={store} />)
      .dive()
      .dive()
      .dive()

    wrapper.setProps({ panoramaState: { image: 'ABC_IMAGE_2.jpg' } })
    wrapper.instance().setState({ update: true })
    wrapper.update()

    expect(wrapper.instance().props.panoramaState.image).toBe('ABC_IMAGE_2.jpg')
    expect(loadScene).toHaveBeenCalled()
  })

  it('closes the panorama and navigates back to the data detail route', () => {
    const detailReference = [123, 'foo', 'bar']

    getDetailReference.mockReturnValueOnce(detailReference)
    getMapOverlays.mockReturnValueOnce([{ id: 'foo' }, { id: 'bar' }, { id: 'pano-baz' }])

    jest.spyOn(store, 'dispatch')

    const wrapper = shallow(<PanoramaContainer {...props} store={store} />)
      .dive()
      .dive()
      .dive()

    wrapper.find('[aria-label="Panoramabeeld sluiten"]').simulate('click')

    expect(store.dispatch).toHaveBeenCalledWith(
      toDataDetail(detailReference, {
        // Layers with the 'pano' prefix should be filtered out.
        [PARAMETERS.LAYERS]: [{ id: 'foo' }, { id: 'bar' }],
        [PARAMETERS.VIEW]: ViewMode.Split,
      }),
    )
  })

  it('closes the panorama and navigates back to the geosearch route', () => {
    const panoramaLocation = [52.123, 4.123]

    getPanoramaLocation.mockReturnValueOnce(panoramaLocation)
    getMapOverlays.mockReturnValueOnce([{ id: 'foo' }, { id: 'bar' }, { id: 'pano-baz' }])

    jest.spyOn(store, 'dispatch')

    const wrapper = shallow(<PanoramaContainer {...props} store={store} />)
      .dive()
      .dive()
      .dive()

    wrapper.find('[aria-label="Panoramabeeld sluiten"]').simulate('click')

    expect(store.dispatch).toHaveBeenCalledWith(
      toGeoSearch({
        [PARAMETERS.LOCATION]: panoramaLocation,
        [PARAMETERS.VIEW]: ViewMode.Split,
        // Layers with the 'pano' prefix should be filtered out.
        [PARAMETERS.LAYERS]: [{ id: 'foo' }, { id: 'bar' }],
      }),
    )
  })

  it('tracks when the panorama is closed', () => {
    const mockedTrackEvent = jest.fn()

    useMatomo.mockReturnValue({
      trackEvent: mockedTrackEvent,
    })

    const wrapper = shallow(<PanoramaContainer {...props} store={store} />)
      .dive()
      .dive()
      .dive()

    wrapper.find('[aria-label="Panoramabeeld sluiten"]').simulate('click')

    expect(mockedTrackEvent).toHaveBeenCalledWith({
      category: 'navigation',
      action: 'panorama-verlaten',
      name: null,
    })
  })
})
