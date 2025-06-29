import { fetchJokeTypes } from '#/repos/jokes.repo'

export default defineEventHandler(async (event) => {
  const collectionResponse = await fetchJokeTypes()
  return collectionResponse
})
