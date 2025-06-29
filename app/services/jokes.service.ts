import type { CollectionResponse, SingleResponse, SuccessResponse } from '~~/types/response.types'
import type { Joke, JokeByIdParams, JokeCreatePayload, JokeUpdatePayload } from '~~/schemas/jokes.schema'

const LOG_NAMESPACE = 'services.jokes'

async function emulateDelay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function fetchJokes(): Promise<CollectionResponse<Joke>> {
  try {
    const response = await $fetch('/api/v1/jokes')
    await emulateDelay(1000)
    return response
  }
  catch (error) {
    if (error instanceof Error) {
      console.error(`[${LOG_NAMESPACE}.fetchJokes]:`, error.message)
    }
    else {
      console.error(`[${LOG_NAMESPACE}.fetchJokes]:`, error)
    }

    throw error
  }
}

export async function fetchJokeTypes(): Promise<CollectionResponse<Joke['type']>> {
  try {
    const response = await $fetch('/api/v1/jokes/types')
    await emulateDelay(1000)
    return response
  }
  catch (error) {
    if (error instanceof Error) {
      console.error(`[${LOG_NAMESPACE}.fetchJokeTypes]:`, error.message)
    }
    else {
      console.error(`[${LOG_NAMESPACE}.fetchJokeTypes]:`, error)
    }

    throw error
  }
}

export async function createJoke({ payload }: { payload: JokeCreatePayload }): Promise<SingleResponse<Joke>> {
  try {
    const response = await $fetch('/api/v1/jokes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: payload,
    })

    await emulateDelay(1000)

    return response
  }
  catch (error) {
    if (error instanceof Error) {
      console.error(`[${LOG_NAMESPACE}.createJoke]:`, error.message)
    }
    else {
      console.error(`[${LOG_NAMESPACE}.createJoke]:`, error)
    }

    throw error
  }
}

export async function fetchJoke({ id }: JokeByIdParams): Promise<SingleResponse<Joke>> {
  try {
    const response = await $fetch(`/api/v1/jokes/${id}`)

    await emulateDelay(1000)

    return response
  }
  catch (error) {
    if (error instanceof Error) {
      console.error(`[${LOG_NAMESPACE}.fetchJoke]:`, error.message)
    }
    else {
      console.error(`[${LOG_NAMESPACE}.fetchJoke]:`, error)
    }

    throw error
  }
}

export async function updateJoke({ id, payload }: { id: string, payload: JokeUpdatePayload }): Promise<SingleResponse<Joke>> {
  try {
    const response = await $fetch(`/api/v1/jokes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: payload,
    })

    await emulateDelay(1000)

    return response
  }
  catch (error) {
    if (error instanceof Error) {
      console.error(`[${LOG_NAMESPACE}.updateJoke]:`, error.message)
    }
    else {
      console.error(`[${LOG_NAMESPACE}.updateJoke]:`, error)
    }

    throw error
  }
}

export async function deleteJoke({ id }: { id: string }): Promise<SuccessResponse<Joke>> {
  try {
    const response = await $fetch(`/api/v1/jokes/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    await emulateDelay(1000)

    return response
  }
  catch (error) {
    if (error instanceof Error) {
      console.error(`[${LOG_NAMESPACE}.deleteJoke]:`, error.message)
    }
    else {
      console.error(`[${LOG_NAMESPACE}.deleteJoke]:`, error)
    }

    throw error
  }
}
