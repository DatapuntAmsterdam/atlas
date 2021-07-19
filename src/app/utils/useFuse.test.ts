import { act, renderHook } from '@testing-library/react-hooks'
import useFuse from './useFuse'

jest.mock('lodash.debounce', () => jest.fn((fn) => fn))

const mockList = [
  {
    title: 'foo',
  },
  {
    title: 'bar',
  },
]

describe('useFuse hook', () => {
  it('should return the query value when calling updateQuery', () => {
    const { result } = renderHook(() => useFuse([]))
    expect(result.current.query).toBe('')
    act(() => {
      result.current.updateQuery('new query')
    })
    expect(result.current.query).toBe('new query')
  })

  it('should filter the list', () => {
    const { result } = renderHook(() => useFuse(mockList, { keys: ['title'] }))
    act(() => {
      result.current.updateQuery('bar')
    })

    expect(result.current.results).toEqual([{ item: mockList[1], refIndex: 1 }])
  })

  it('should show all results if query is < 3 characters', () => {
    const { result } = renderHook(() =>
      useFuse(mockList, { keys: ['title'], minMatchCharLength: 3 }),
    )

    const expectation = [
      { item: { title: 'foo' }, matches: [], refIndex: 1, score: 1 },
      { item: { title: 'bar' }, matches: [], refIndex: 1, score: 1 },
    ]

    act(() => {
      result.current.updateQuery('ar')
    })
    expect(result.current.results).toEqual(expectation)
    act(() => {
      result.current.updateQuery('')
    })
    expect(result.current.results).toEqual(expectation)
  })
})
