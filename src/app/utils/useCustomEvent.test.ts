import { renderHook } from '@testing-library/react-hooks'
import useCustomEvent from './useCustomEvent'

describe('useCustomEvent', () => {
  it('should call the event handler when event is triggered', () => {
    const mockFn = jest.fn()
    renderHook(() => useCustomEvent(window, 'resize', mockFn))

    expect(mockFn).not.toHaveBeenCalled()
    window.dispatchEvent(new Event('resize'))
    expect(mockFn).toHaveBeenCalledTimes(1)
  })

  it('should remove the eventlistener when component is unmounted', () => {
    const mockFn = jest.fn()
    const { unmount } = renderHook(() => useCustomEvent(window, 'resize', mockFn))

    unmount()
    window.dispatchEvent(new Event('resize'))
    expect(mockFn).not.toHaveBeenCalled()
  })
})
