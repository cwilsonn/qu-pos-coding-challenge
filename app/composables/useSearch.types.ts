/**
 * Configuration for the `useSearch` composable.
 *
 * This type defines the structure of the configuration object used to perform
 * keyword searches on a dataset. It includes the search query, the keys to search against,
 * and an optional flag for case sensitivity.
 *
 * @template T - The type of items being searched.
 *
 * @example
 * type Example = {
 *   id: number
 *   name: string
 *   email: string
 * }
 *
 * const searchConfig: SearchConfig<Example> = {
 *   query: 'Alice',
 *   keys: ['name', 'email'],
 *   caseSensitive: false,
 * }
 */
export type SearchConfig<T extends Record<string, any>> = {
  /**
   * The search string to query against.
   * This is the keyword or phrase used to filter the dataset.
   */
  query: string

  /**
   * The keys from `T` to search against.
   * For example: `['name', 'status', 'isActive']`.
   */
  keys: (Extract<keyof T, string>)[]

  /**
   * Whether or not the search is case-sensitive.
   * Defaults to `false` if not specified.
   */
  caseSensitive?: boolean
}
