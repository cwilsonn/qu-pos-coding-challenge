import {
  filter as _filter,
  isEqual as _isEqual,
  negate as _negate,
  lt as _lt,
  lte as _lte,
  gt as _gt,
  gte as _gte,
} from 'lodash-es'

/**
 * A constant object defining all available filter condition keys.
 * These keys are used to identify the condition functions.
 */
export const filterConditions = {
  eq: 'eq',
  ne: 'ne',
  lt: 'lt',
  lte: 'lte',
  gt: 'gt',
  gte: 'gte',
  in: 'in',
  nin: 'nin',
  between: 'between',
  regex: 'regex',
  empty: 'empty',
  notEmpty: 'notEmpty',
} as const

/**
 * A mapping of filter condition keys to their human-readable labels.
 * These labels are typically used in UI components.
 */
export const filterConditionLabels = {
  eq: 'Equals',
  ne: 'Not equals',
  lt: 'Less than',
  lte: 'Less than or equal',
  gt: 'Greater than',
  gte: 'Greater than or equal',
  in: 'Includes',
  nin: 'Does not include',
  between: 'Between',
  regex: 'Regex',
  empty: 'Empty',
  notEmpty: 'Not empty',
}

/**
 * A mapping of filter condition keys to their descriptive phrases.
 * These descriptions are useful for tooltips or detailed UI explanations.
 */
export const filterConditionDescriptions = {
  eq: 'is equal to',
  ne: 'is not equal to',
  lt: 'is less than',
  lte: 'is less than or equal to',
  gt: 'is greater than',
  gte: 'is greater than or equal to',
  in: 'is one of',
  nin: 'is not one of',
  between: 'is between',
  regex: 'matches regex',
  empty: 'is empty',
  notEmpty: 'is not empty',
}

/**
 * A mapping of filter condition keys to their symbolic representations.
 * These symbols are useful for compact UI displays.
 */
export const filterConditionSymbols = {
  eq: '=',
  ne: '≠',
  lt: '<',
  lte: '≤',
  gt: '>',
  gte: '≥',
  in: 'includes',
  nin: '!includes',
  between: '-',
  regex: '∼',
  empty: '∅',
  notEmpty: '≠ ∅',
}

/**
 * A mapping of filter condition keys to their corresponding functions.
 * These functions implement the actual filtering logic.
 */
export const conditionFns: Record<
  Extract<FilterCondition, string>,
  (a: any, b: any) => boolean
> = {
  eq: _isEqual,
  ne: _negate(_isEqual),
  lt: _lt,
  lte: _lte,
  gt: _gt,
  gte: _gte,
  in: (a, b) => (Array.isArray(a) || typeof a === 'string') && a.includes(b),
  nin: (a, b) => (Array.isArray(a) || typeof a === 'string') && !a.includes(b),
  between: (value, range) =>
    Array.isArray(range) &&
    range.length === 2 &&
    value >= range[0] &&
    value <= range[1],
  regex: (value, pattern) => {
    if (typeof value !== 'string' || typeof pattern !== 'string') return false
    try {
      const re = new RegExp(pattern)
      return re.test(value)
    } catch {
      return false // Invalid regex
    }
  },
  empty: (value) => value == null || value === '',
  notEmpty: (value) => value != null && value !== '',
}


/**
 * A type representing all available filter condition keys.
 * These keys correspond to the condition functions defined in `filterConditions`.
 */
export type FilterCondition = keyof typeof filterConditions | null

/**
 * Represents a single filter group for a specific key in the data.
 *
 * @template T - The type of the data being filtered.
 */
export type FilterGroup<T = unknown> = {
  /**
   * The condition to use for filtering (e.g., 'eq', 'lt', 'regex').
   * If omitted, no filtering will be applied for this key.
   */
  condition?: FilterCondition | undefined

  /**
   * The value to compare against.
   * This can be a primitive value, an array, or any other type depending on the condition.
   */
  value?: any

  /**
   * An optional custom filter function for this key.
   * If defined, it takes precedence over the condition behavior.
   *
   * @param {T} item - The current item being filtered.
   * @returns {boolean} - Whether the item passes the filter.
   */
  filterFn?: (item: T) => boolean
}

/**
 * Represents the filter configuration for a dataset.
 * Each key corresponds to a property in the dataset, and its value is a `FilterGroup`.
 *
 * @template T - The type of the data being filtered.
 *
 * @example
 * type Example = {
 *   id: number
 *   name: string
 *   age: number
 * }
 *
 * const filterConfig: FilterConfig<Example> = {
 *   name: { condition: 'eq', value: 'Alice' },
 *   age: { condition: 'gte', value: 18 },
 * }
 */
export type FilterConfig<T extends Record<string, any>> = Partial<
  Record<Extract<keyof T, string>, FilterGroup<T>>
>
