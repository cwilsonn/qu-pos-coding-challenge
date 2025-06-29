import { nanoid } from 'nanoid'
import type { CollectionResponse, SingleResponse, SuccessResponse } from '~~/types/response.types'
import type { Joke, JokeCreatePayload, JokeUpdatePayload, JokeByIdParams } from '~~/schemas/jokes.schema'
import jokesSeed from '~~/data/db/jokes.json'

const LOG_NAMESPACE = 'repos.jokes'
const JOKES_STORAGE_KEY = 'jokes.json'
const storage = useStorage('db')

async function ensureSeedData() {
  const exists = await storage.hasItem(JOKES_STORAGE_KEY)
  if (!exists) {
    await storage.setItem(JOKES_STORAGE_KEY, jokesSeed)
    console.info(`[${LOG_NAMESPACE}] - Seed data initialized`)
  }
}

async function readJokesFile(): Promise<Joke[]> {
  await ensureSeedData()

  const jokes = await storage.getItem(JOKES_STORAGE_KEY)

  if (!jokes) throw createError({
    statusCode: 404,
    statusMessage: `[${LOG_NAMESPACE}] - Jokes data not found`,
  })

  if (!Array.isArray(jokes)) throw createError({
    statusCode: 500,
    statusMessage: `[${LOG_NAMESPACE}] - Jokes data is in an invalid format`,
  })

  return jokes as Joke[]
}

async function writeJokesFile(jokes: Joke[]) {
  await storage.setItem(JOKES_STORAGE_KEY, jokes)
}

/**
 * Fetches all jokes from the JSON file.
 * @returns A promise that resolves to a collection response containing all jokes.
 * @throws An error if the jokes data is not found or is in an invalid format.
 */
async function fetchJokes(): Promise<CollectionResponse<Joke>> {
  const jokes = await readJokesFile()
  return { data: jokes }
}

/**
 * Fetches all unique joke types from the JSON file.
 * @returns A promise that resolves to a collection response containing unique joke types.
 * @throws An error if the jokes data is not found or is in an invalid format.
 */
async function fetchJokeTypes(): Promise<CollectionResponse<Joke['type']>> {
  const jokes = await readJokesFile()
  const jokeTypes = Array.from(new Set(jokes.map(j => j.type)))
  return { data: jokeTypes }
}

/**
 * Fetches a single joke by its ID.
 * @param id - The ID of the joke to fetch.
 * @returns A promise that resolves to a single response containing the joke.
 * @throws An error if the joke with the specified ID is not found or if the jokes data is not found.
 */
async function fetchJoke({ id }: JokeByIdParams): Promise<SingleResponse<Joke>> {
  const jokes = await readJokesFile()
  const joke = jokes.find(j => j.id === id)

  if (!joke) throw createError({
    statusCode: 404,
    statusMessage: `[${LOG_NAMESPACE}] - Joke with ID ${id} not found`,
  })

  return { data: joke }
}

/**
 * Creates a new joke with the provided payload.
 * @param payload - The payload containing the joke data.
 * @returns A promise that resolves to a single response containing the created joke.
 * @throws An error if the jokes data is not found or if there is an issue writing
 */
async function createJoke({ payload }: { payload: JokeCreatePayload }): Promise<SingleResponse<Joke>> {
  const jokes = await readJokesFile()
  const newJoke = {
    id: nanoid(),
    ...payload,
  }

  jokes.push(newJoke)
  await writeJokesFile(jokes)

  return { data: newJoke }
}

/**
 * Updates a joke by its ID with the provided payload.
 * @param id - The ID of the joke to update.
 * @param payload - The payload containing the updated joke data.
 * @returns A promise that resolves to a single response containing the updated joke.
 * @throws An error if the joke with the specified ID is not found or if the jokes
 */
async function updateJoke({ id, payload }: {
  id: string
  payload: JokeUpdatePayload
}): Promise<SingleResponse<Joke>> {
  const jokes = await readJokesFile()
  const jokeIndex = jokes.findIndex(j => j.id === id)

  if (jokeIndex === -1) throw createError({
    statusCode: 404,
    statusMessage: `[${LOG_NAMESPACE}] - Joke with ID ${id} not found`,
  })

  const updatedJoke = {
    ...jokes[jokeIndex],
    ...payload,
  }

  jokes[jokeIndex] = { ...jokes[jokeIndex], ...updatedJoke }

  await writeJokesFile(jokes)

  return { data: jokes[jokeIndex] }
}

/**
 * Deletes a joke by its ID.
 * @param id - The ID of the joke to delete.
 * @returns A promise that resolves to a success response containing the deleted joke.
 * @throws An error if the joke with the specified ID is not found.
 */
async function deleteJoke({ id }: JokeByIdParams): Promise<SuccessResponse<Joke>> {
  const jokes = await readJokesFile()
  const jokeIndex = jokes.findIndex(j => j.id === id)

  if (jokeIndex === -1) throw createError({
    statusCode: 404,
    statusMessage: `[${LOG_NAMESPACE}] - Joke with ID ${id} not found`,
  })

  const deletedJoke = jokes[jokeIndex]
  jokes.splice(jokeIndex, 1)

  await writeJokesFile(jokes)

  return { success: true, data: deletedJoke }
}

export {
  fetchJokes,
  fetchJokeTypes,
  fetchJoke,
  createJoke,
  updateJoke,
  deleteJoke,
}
