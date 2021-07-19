import Fuse from 'fuse.js'
import { useCallback, useMemo, useState } from 'react'
import debounce from 'lodash.debounce'

interface HookSettings {
  debounceWait: number
  // This only works if the fuse.js minMatchCharLength option is set!
  showAllResultsByDefault?: boolean
}

const useFuse = <T>(
  list: T[],
  options: Fuse.IFuseOptions<T> = {},
  hookSettings: HookSettings = { debounceWait: 100, showAllResultsByDefault: true },
) => {
  // This is not really an elegant solution, but as Fuse.js doesn't offer a solution for this, as it's only responsibility is filtering, we are stuck with this.
  // https://github.com/krisk/Fuse/issues/229
  const allResults: Fuse.FuseResult<T>[] = useMemo(
    () =>
      list.map((item) => ({
        item,
        matches: [],
        score: 1,
        refIndex: 1,
      })),
    [list],
  )
  const [query, setQuery] = useState('')
  const [fuseQuery, setFuseQuery] = useState('')

  const fuse = useMemo(() => new Fuse<T>(list, options), [list, options])
  // Keeping results memoized instead of putting the value in a state has a benefit of always having
  // the value up to date if the list changes, and thus not having to introduce an effect
  const results = useMemo(
    () =>
      hookSettings.showAllResultsByDefault && fuseQuery.length < (options.minMatchCharLength ?? 0)
        ? allResults
        : fuse.search(fuseQuery),
    [fuse, fuseQuery, hookSettings, allResults],
  )

  const setDebouncedFuseQuery = useMemo(
    () => debounce(setFuseQuery, hookSettings.debounceWait),
    [setFuseQuery, hookSettings.debounceWait],
  )

  // We need to update the 2 states
  // 1. query: the input value that can be used for controlled components
  // 2. a debounced query: this value is used to update the results with a debounce.
  const updateQuery = useCallback(
    (value: string) => {
      setQuery(value)
      // In case the value is empty (for example user clears the value), we should immediately update the results
      if (!value.length) {
        setFuseQuery(value)
      } else {
        setDebouncedFuseQuery(value)
      }
    },
    [setDebouncedFuseQuery],
  )

  return {
    results,
    query,
    updateQuery,
  }
}

export default useFuse
