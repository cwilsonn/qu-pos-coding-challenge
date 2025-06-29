import { fetchJokes } from '#/repos/jokes.repo'

export default defineEventHandler(async (_event) => {
  const collectionResponse = await fetchJokes()
  return collectionResponse
})
