import { jokeCreateSchema } from '~~/schemas/jokes.schema'
import { createJoke } from '~~/server/repos/jokes.repo'

export default defineEventHandler(async (event) => {
  const payload = await validateBody(event, jokeCreateSchema)
  const singleResponse = await createJoke({ payload })

  return singleResponse
})
