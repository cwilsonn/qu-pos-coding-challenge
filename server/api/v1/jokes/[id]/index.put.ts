import { jokeByIdParamsSchema, jokeUpdateSchema } from '~~/schemas/jokes.schema'
import { updateJoke } from '#/repos/jokes.repo'

export default defineEventHandler(async (event) => {
  const { id } = await validateParams(event, jokeByIdParamsSchema)
  const payload = await validateBody(event, jokeUpdateSchema)
  const singleResponse = await updateJoke({ id, payload })

  return singleResponse
})
