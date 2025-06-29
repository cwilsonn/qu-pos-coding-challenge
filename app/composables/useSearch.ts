import { filter as _filter, debounce as _debounce } from 'lodash-es'
import { type MaybeRefOrGetter, computed, ref, unref, watch } from 'vue'
import type { SearchConfig } from './useSearch.types'

/**
 * A composable that provides a basic keyword search functionality
 * across specified object keys in an array of objects.
 *
 * @template T - The type of the object entries in the array.
 * @param {MaybeRefOrGetter<T[]>} data - The array of data to be searched.
 * @param {MaybeRefOrGetter<SearchConfig<T>>} config - The search config object including keys, the query string, and case-sensitivity.
 * @returns {object} An object containing the filtered data as a computed ref.
 *
 * @example
 * const data = ref([{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }])
 * const config = ref({ query: 'alice', keys: ['name'], caseSensitive: false })
 * const { searchedData } = useSearch(data, config)
 *
 * console.log(searchedData.value) // [{ id: 1, name: 'Alice' }]
 */
export function useSearch<T extends Record<string, any>>({
  data,
  config,
}: {
  data: MaybeRefOrGetter<T[]>
  config: MaybeRefOrGetter<SearchConfig<T>>
},
) {
  const unwrappedData = computed(() => unref(data) as T[])
  const unwrappedConfig = computed(() => unref(config) as SearchConfig<T>)

  const debouncedQuery = ref<string>('')

  watch(
    () => unwrappedConfig.value.query,
    _debounce((newQuery) => {
      debouncedQuery.value = newQuery
    }, 150),
  )

  /**
   * Utility function to normalize a string for searching.
   * @param value - The value to be normalized.
   * @param caseSensitive - A flag indicating whether the search should be case-sensitive.
   * @returns {string} - The normalized string.
   */
  const normalizeString = (value: any, caseSensitive: boolean): string => {
    if (typeof value !== 'string') {
      try {
        value = JSON.stringify(value)
      }
      catch {
        return '' // Return an empty string if value cannot be stringified
      }
    }
    return caseSensitive ? value : value.toLowerCase()
  }

  const searchedData = computed(() => {
    const { keys, caseSensitive = false } = unwrappedConfig.value ?? {}
    const query = debouncedQuery.value
    if (!query || !keys || keys.length === 0) return unwrappedData.value

    const normalizedQuery = normalizeString(query, caseSensitive)

    return _filter(unwrappedData.value, item =>
      keys.some((key) => {
        const value = item[key]
        const normalizedValue = normalizeString(value, caseSensitive)
        return normalizedValue.includes(normalizedQuery)
      }),
    )
  })

  return { searchedData }
}
