import { slice as _slice } from 'lodash-es'
import { computed, unref, type MaybeRefOrGetter } from 'vue'
import type { PaginationConfig } from './usePagination.types'

/**
 * A composable for paginating a reactive array of data.
 *
 * @template T The type of each item in the dataset.
 * @param {MaybeRefOrGetter<T[]>} data - The full array of items to be paginated.
 * @param {MaybeRefOrGetter<PaginationConfig>} config - The pagination config, including the current page (`page`) and items per page (`perPage`).
 * @returns {object} An object with `paginatedData`, `totalPages`, and utility methods for pagination.
 *
 * @example
 * const data = ref([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }])
 * const config = ref({ page: 1, perPage: 2 })
 * const { paginatedData, totalPages, nextPage, prevPage } = usePagination({ data, config })
 *
 * console.log(paginatedData.value) // [{ id: 1 }, { id: 2 }]
 * console.log(totalPages.value) // 2
 *
 * nextPage()
 * console.log(paginatedData.value) // [{ id: 3 }, { id: 4 }]
 */
export function usePagination<T extends Record<string, any>>({
  data,
  config,
}: {
  data: MaybeRefOrGetter<T[]>
  config: MaybeRefOrGetter<PaginationConfig>
}) {
  const unwrappedData = computed(() => unref(data))
  const unwrappedConfig = computed<PaginationConfig>(() => unref(config) as PaginationConfig)

  const totalPages = computed(() =>
    Math.ceil(unwrappedData.value.length / unwrappedConfig.value.perPage),
  )

  /**
   * The slice of data for the current page.
   * @returns {T[]} The sliced array of items for the current page.
   */
  const paginatedData = computed<T[]>(() => {
    // Ensure page boundaries are respecteed
    if (unwrappedConfig.value.page < 1 || unwrappedConfig.value.page > totalPages.value) {
      return []
    }

    const start = (unwrappedConfig.value.page - 1) * unwrappedConfig.value.perPage
    const end = unwrappedConfig.value.page * unwrappedConfig.value.perPage
    return _slice(unwrappedData.value, start, end)
  })

  /**
   * Utility to get the text for the results count.
   * @returns {string} The text indicating the number of results.
   */
  const resultsCountText = computed(() => {
    const { page, perPage } = unwrappedConfig.value
    const total = unwrappedData.value.length

    if (total === 0) return 'No results'
    if (total === 1) return 'Showing 1 result'

    const start = (page - 1) * perPage + 1
    const end = Math.min(page * perPage, total)

    return total > perPage
      ? `Showing ${start} - ${end} of ${total} results`
      : `Showing all ${total} results`
  })

  /**
   * Utility method to go to the next page.
   * @returns {void}
   */
  const nextPage = () => {
    if (unwrappedConfig.value.page < totalPages.value) {
      unwrappedConfig.value.page++
    }
  }

  /**
   * Utility method to go to the previous page.
   * @returns {void}
   */
  const prevPage = () => {
    if (unwrappedConfig.value.page > 1) {
      unwrappedConfig.value.page--
    }
  }

  /**
   * Utility to set the current page.
   * @param {number} page
   * @reutrns {void}
   */
  const setPage = (page: number) => {
    if (page < 1 || page > totalPages.value) {
      throw new Error(
        `[usePagination]: Page number ${page} is out of bounds. Must be between 1 and ${totalPages.value}.`,
      )
    }

    unwrappedConfig.value.page = page
  }

  return {
    totalPages,
    paginatedData,
    resultsCountText,
    nextPage,
    prevPage,
    setPage,
  }
}
