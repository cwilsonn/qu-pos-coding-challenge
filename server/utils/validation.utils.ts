import type { ZodSchema } from 'zod'

import type { H3Event } from 'h3'

/**
 * Flattens and joins error messages from a Zod validation error object.
 * @param errors - An object containing error messages.
 * @returns A string representation of the errors, with each error message joined by a comma.
 * @example
 * ```ts
 * const errors = { name: ['Name is required'], age: ['Age must be a number'] }
 * const errorString = flattenAndJoinErrors(errors)
 * console.log(errorString) // "Name is required, Age must be a number"
 * ```
 */
function flattenAndJoinErrors(errors: Record<string, unknown>): string {
  return Object.values(errors)
    .flat()
    .map(error => (typeof error === 'string' ? error : JSON.stringify(error)))
    .join(', ')
}

/**
 * Converts an object of errors into a string representation.
 * @param errors - An object containing error messages.
 * @returns A string representation of the errors, formatted as "key: value".
 * @example
 * ```ts
 * const errors = { name: 'Name is required', age: 'Age must be a number' }
 * const errorString = stringifyErrors(errors)
 * console.log(errorString) // "name: "Name is required", age: "Age must be a number""
 * ```
 */
function stringifyErrors(errors: Record<string, unknown>): string {
  return Object.entries(errors)
    .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
    .join(', ')
}

/**
 * Maps the type of data to the corresponding function to retrieve it from the H3 event.
 */
const sourceMap = {
  body: (event: H3Event) => readBody(event),
  query: (event: H3Event) => getQuery(event),
  params: (event: H3Event) => event.context.params,
}

/**
 * Validates the request data against a Zod schema.
 * @param event - The H3 event containing the request data.
 * @param schema - The Zod schema to validate against.
 * @param type - The type of data to validate (body, query, or params).
 * @returns The validated data if successful.
 * @throws An error if validation fails, with a 400 status code and a message detailing
 *
 * @example
 * ```ts
 * const validatedData = await validate(event, mySchema, 'body');
 * ```
 */
export async function validate<T>(
  event: H3Event,
  schema: ZodSchema<T>,
  type: keyof typeof sourceMap,
): Promise<T> {
  const getSource = sourceMap[type]
  if (!getSource) {
    throw createError({
      statusCode: 500,
      statusMessage: `Invalid validation type: ${type}`,
    })
  }

  const source = await getSource(event)
  const result = schema.safeParse(source)

  if (result.success) return result.data

  const errors = result.error.flatten()

  const errorMessage = flattenAndJoinErrors(errors)
  const errorDetails = stringifyErrors(errors)

  throw createError({
    statusCode: 400,
    statusMessage: `Invalid ${type}: ${errorDetails}`,
    message: errorMessage,
  })
}

/**
 * An alias for `validate` that validates the request body against a Zod schema.
 * @param e - The H3 event containing the request body.
 * @param s - The Zod schema to validate against.
 * @returns The validated body data if successful.
 * @throws An error if validation fails, with a 400 status code and a message detailing
 * the validation errors.
 * @example
 * ```ts
 * const validatedBody = await validateBody(event, myBodySchema);
 * ```
 */
export const validateBody = <T>(e: H3Event, s: ZodSchema<T>) => validate(e, s, 'body')

/**
 * An alias for `validate` that validates the request query parameters against a Zod schema.
 * @param e - The H3 event containing the request query parameters.
 * @param s - The Zod schema to validate against.
 * @returns The validated query data if successful.
 * @throws An error if validation fails, with a 400 status code and a message detailing
 * the validation errors.
 * @example
 * ```ts
 * const validatedQuery = await validateQuery(event, myQuerySchema);
 * ```
 */
export const validateQuery = <T>(e: H3Event, s: ZodSchema<T>) => validate(e, s, 'query')

/**
 * An alias for `validate` that validates the request parameters against a Zod schema.
 * @param e - The H3 event containing the request parameters.
 * @param s - The Zod schema to validate against.
 * @returns The validated params data if successful.
 * @throws An error if validation fails, with a 400 status code and a message detailing
 * the validation errors.
 * @example
 * ```ts
 * const validatedParams = await validateParams(event, myParamsSchema);
 * ```
 */
export const validateParams = <T>(e: H3Event, s: ZodSchema<T>) => validate(e, s, 'params')
