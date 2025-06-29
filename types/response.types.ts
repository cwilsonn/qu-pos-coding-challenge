export type ResponseMeta = {
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export type CollectionResponse<T> = {
  data: T[]
  meta?: ResponseMeta
}

export type SingleResponse<T> = {
  data: T
}

export type SuccessResponse<T> = {
  data?: T
  success: boolean
}
