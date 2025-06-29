import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { nanoid } from 'nanoid'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const jokesPath = path.resolve(__dirname, './data/db/jokes.json')

async function addIdsToJokes() {
  try {
    const raw = await fs.readFile(jokesPath, 'utf-8')
    const jokes = JSON.parse(raw)

    const jokesWithIds = jokes.map(joke => ({
      id: nanoid(),
      rating: 0,
      ...joke,
    }))

    await fs.writeFile(jokesPath, JSON.stringify(jokesWithIds, null, 2))
    console.log('Jokes enhanced with additional data successfully.')
  }
  catch (err) {
    console.error('Failed to update jokes.json', err)
  }
}

addIdsToJokes()
