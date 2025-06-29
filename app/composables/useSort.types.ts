/**
 * A constant object defining all available sort orders.
 * These keys are used to identify the sort direction.
 */
export const sortOrders = {
  asc: 'asc',
  desc: 'desc',
} as const

/**
 * A mapping of sort orders to their human-readable labels.
 * These labels are typically used in UI components.
 */
export const sortLabels = {
  asc: 'Ascending',
  desc: 'Descending',
}

/**
 * A mapping of sort orders to their short labels.
 * These are useful for compact UI displays.
 */
export const sortLabelsShort = {
  asc: 'asc',
  desc: 'desc',
}

/**
 * A mapping of sort orders to their symbolic representations.
 * These symbols are useful for visual indicators in UI components.
 */
export const sortLabelSymbols = {
  asc: '↑',
  desc: '↓',
}

/**
 * A mapping of sort orders to their corresponding icon names.
 * These icons can be used in UI components to represent the sort direction.
 */
export const sortIcons = {
  asc: 'tabler:caret-up-filled',
  desc: 'tabler:caret-down-filled',
}

/**
 * Represents the possible sort orders for a column.
 *
 * This type includes all keys from the `sortOrders` utility and allows `null`
 * to represent an unsorted state.
 *
 * @example
 * type ExampleSortOrder = SortOrder // 'asc' | 'desc' | null
 */
export type SortOrder = keyof typeof sortOrders | null

/**
 * Represents the configuration for sorting a single column.
 *
 * @template T - The type of the data being sorted.
 */
export type SortGroup<T extends Record<string, any>> = {
  /**
   * The key of the column to sort by.
   * If `null`, no sorting will be applied.
   */
  key: Extract<keyof T, string> | null

  /**
   * The order in which to sort the column (`asc`, `desc`, or `null` for no sorting).
   */
  order: SortOrder | null

  /**
   * An optional custom sort function for the column.
   * If defined, it takes precedence over the default sorting behavior.
   *
   * @param {T} a - The first item to compare.
   * @param {T} b - The second item to compare.
   * @returns {number} - A negative number if `a` should come before `b`,
   *                     a positive number if `a` should come after `b`,
   *                     or `0` if they are equal.
   */
  sortFn?: (a: T, b: T) => number
}

/**
 * Represents the configuration for sorting a dataset.
 *
 * This type is an alias for `SortGroup<T>` to allow for future extensibility.
 *
 * @template T - The type of the data being sorted.
 *
 * @example
 * type Example = {
 *   id: number
 *   name: string
 * }
 *
 * const sortConfig: SortConfig<Example> = {
 *   key: 'name',
 *   order: 'asc',
 * }
 */
export type SortConfig<T extends Record<string, any>> = SortGroup<T>
