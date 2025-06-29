import { jokeByIdParamsSchema } from '~~/schemas/jokes.schema'
import { deleteJoke } from '~~/server/repos/jokes.repo'

export default defineEventHandler(async (event) => {
  const { id } = await validateParams(event, jokeByIdParamsSchema)
  const successResponse = await deleteJoke({ id })

  return successResponse
})
