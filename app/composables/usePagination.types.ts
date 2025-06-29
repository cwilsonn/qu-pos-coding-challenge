/**
 * Represents the configuration for pagination.
 *
 * This type is used to define the current page and the number of items per page
 * for paginating a dataset.
 *
 * @example
 * const paginationConfig: PaginationConfig = {
 *   page: 1,
 *   perPage: 10,
 * }
 */
export type PaginationConfig = {
  // The current page number (1-based index).
  page: number

  // The number of items to display per page.
  perPage: number
}
