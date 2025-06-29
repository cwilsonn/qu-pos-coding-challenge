import { computed, unref, type MaybeRefOrGetter } from 'vue'
import { orderBy as _orderBy } from 'lodash-es'
import type { SortConfig } from './useSort.types'

/**
 * A composable for sorting a reactive array of data.
 *
 * @template T The type of each item in the dataset.
 * @param {MaybeRefOrGetter<T[]>} data - An array of data to be sorted.
 * @param {MaybeRefOrGetter<SortConfig<T>>} config - The sort configuration object, including the key, order, and an optional custom sort function.
 * @returns {object} An object containing the sorted data as a computed ref and utility methods for managing sorting.
 *
 * @example
 * const data = ref([{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }])
 * const config = ref({ key: 'name', order: 'asc' })
 * const { sortedData } = useSort({ data, config })
 *
 * console.log(sortedData.value) // [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]
 *
 * cycleSort('name') // Toggles the sort order for the 'name' key
 */
export function useSort<T extends Record<string, any>>({
  data,
  config,
}: {
  data: MaybeRefOrGetter<T[]>
  config: MaybeRefOrGetter<SortConfig<T>>
}) {
  const unwrappedData = computed(() => unref(data) as T[])
  const unwrappedConfig = computed(() => unref(config) as SortConfig<T>)

  const sortedData = computed<T[]>(() => {
    const { key, order, sortFn } = unwrappedConfig.value
    if (!key || !order) return unwrappedData.value

    // If a custom sort function is provided, it takes precedence
    if (sortFn) {
      return [...unwrappedData.value].sort((a, b) => {
        const result = sortFn(a, b)
        return order === 'desc' ? -result : result
      })
    }

    return _orderBy(unwrappedData.value, [key], [order])
  })

  return {
    sortedData,
  }
}
