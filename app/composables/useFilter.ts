// Third-party
import { filter as _filter } from 'lodash-es'
import { computed, unref, type MaybeRefOrGetter } from 'vue'

// Types
import {
  type FilterConfig,
  type FilterGroup,
  conditionFns,
} from './useFilter.types'

/**
 * A composable that provides filtering logic for an array of objects.
 *
 * @template T - The data item type.
 * @param {MaybeRefOrGetter<T[]>} data - The array of data to filter.
 * @param {MaybeRefOrGetter<FilterConfig<T>>} config - The filter configuration.
 * @returns {object} The filtered array of objects and filter-related utilities.
 *
 * @example
 * const data = ref([{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }])
 * const config = ref({
 *   name: { condition: 'eq', value: 'Alice' },
 * })
 * const { filteredData, clearFilters } = useFilter(data, config)
 * console.log(filteredData.value) // [{ id: 1, name: 'Alice' }]
 */
export function useFilter<T extends Record<string, any>>({
  data,
  config,
}: {
  data: MaybeRefOrGetter<T[]>
  config: MaybeRefOrGetter<FilterConfig<T>>
}) {
  const unwrappedData = computed(() => unref(data) as T[])
  const unwrappedConfig = computed(() => unref(config) as FilterConfig<T>)

  const filteredData = computed<T[]>(() => {
    return _filter(unwrappedData.value, (item) => {
      return Object.entries(unwrappedConfig.value).every(([key, group]) => {
        if (!group) return true

        const {
          condition,
          value: filterValue,
          filterFn,
        } = group as FilterGroup<T>

        // Skip if no condition or filter value is set
        if (
          !condition
          || filterValue === null
          || filterValue === ''
          || (Array.isArray(filterValue) && filterValue.length === 0)
        ) {
          return true
        }

        // Custom filter function takes precedence
        if (typeof filterFn === 'function') return filterFn(item)

        const value = item[key]

        const fn = conditionFns[condition]
        if (!fn) {
          throw new Error(`[useFilter]: Unknown condition: ${condition}`)
        }

        return fn(value, filterValue)
      })
    })
  })

  const clearFilter = (key: Extract<keyof T, string>) => {
    const group = unwrappedConfig.value[key]
    if (group) group.value = null
  }

  // Small utility to clear all filter values
  const clearFilters = () => {
    for (const [_key, group] of Object.entries(unwrappedConfig.value) as [
      keyof T,
      FilterGroup<T>,
    ][]) {
      if (group) group.value = null
    }
  }

  return {
    filteredData,
    clearFilter,
    clearFilters,
  }
}
