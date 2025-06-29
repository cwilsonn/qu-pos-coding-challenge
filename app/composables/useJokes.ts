import {
  fetchJokes as _fetchJokes,
  fetchJokeTypes as _fetchJokeTypes,
  fetchJoke as _fetchJoke,
  createJoke as _createJoke,
  updateJoke as _updateJoke,
  deleteJoke as _deleteJoke,
} from '@/services/jokes.service'

import type { JokeByIdParams, JokeCreatePayload, JokeUpdatePayload } from '~~/schemas/jokes.schema'

export const useJokes = () => {
  const toast = useToast()
  const store = useJokesStore()
  const { jokes, jokeTypes, hydrated, isLoading, errors } = storeToRefs(store)

  const jokeTypeOptions = computed(() => {
    if (!jokeTypes.value.length) return []

    return jokeTypes.value
      .map((type: string) => ({
        label: type.charAt(0).toUpperCase() + type.slice(1),
        value: type,
      }))
      .sort((a, b) => a.label.localeCompare(b.label))
  })

  const fetchJokes = async () => {
    try {
      const res = await _fetchJokes()

      if (!res?.data) {
        throw new Error('Failed to fetch jokes')
      }

      store.jokes = res.data
      return res
    }
    catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
      store.errors = [...errors.value, errorMessage]
      throw error
    }
  }

  const fetchJokeTypes = async () => {
    try {
      const res = await _fetchJokeTypes()

      if (!res?.data) {
        throw new Error('Failed to fetch joke types')
      }

      store.jokeTypes = res.data
      return res
    }
    catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
      store.errors = [...errors.value, errorMessage]
      throw error
    }
  }

  const fetchJoke = async ({ id }: JokeByIdParams) => {
    if (!id) return

    try {
      const res = await _fetchJoke({ id })

      if (!res?.data) {
        throw new Error('Failed to fetch joke')
      }

      return res.data
    }
    catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
      store.errors = [...errors.value, errorMessage]
      throw error
    }
  }

  const createJoke = async ({ payload }: { payload: JokeCreatePayload }) => {
    if (!payload) return

    try {
      const res = await _createJoke({ payload })

      if (!res?.data) {
        throw new Error('Failed to create joke')
      }

      store.jokes.push(res.data)

      toast.add({
        title: 'Joke created successfully',
        color: 'success',
      })
    }
    catch (error) {
      toast.add({
        title: 'Failed to create joke',
        description: 'Please try again later.',
        color: 'error',
      })
    }
  }

  const updateJoke = async ({ id, payload }: { id: string, payload: JokeUpdatePayload }) => {
    if (!id) return

    const currentJoke = store.jokes.find(joke => joke.id === id)

    try {
      const res = await _updateJoke({ id, payload })

      if (!res?.data) {
        throw new Error('Failed to update joke')
      }

      const index = store.jokes.findIndex(joke => joke.id === id)
      if (index !== -1) {
        store.jokes[index] = { ...currentJoke, ...res.data }
      }

      toast.add({
        title: 'Joke updated successfully',
        color: 'success',
      })
    }
    catch (error) {
      toast.add({
        title: 'Failed to update joke',
        description: 'Please try again later.',
        color: 'error',
      })

      if (currentJoke) {
        // Revert to the original joke if update fails
        const index = store.jokes.findIndex(joke => joke.id === id)
        if (index !== -1) {
          store.jokes[index] = { ...currentJoke }
        }
      }
    }
  }

  const deleteJoke = async ({ id }: JokeByIdParams) => {
    if (!id) return

    try {
      const res = await _deleteJoke({ id })

      if (!res?.data) {
        throw new Error('Failed to delete joke')
      }

      store.jokes = [...store.jokes.filter(joke => joke.id !== id)]

      toast.add({
        title: 'Joke deleted successfully',
        color: 'success',
      })
    }
    catch (error) {
      toast.add({
        title: 'Failed to delete joke',
        description: 'Please try again later.',
        color: 'error',
      })
    }
  }

  onMounted(async () => {
    hydrated.value = true

    if (!store.jokes.length) {
      store.isLoading = true

      try {
        const jokesRes = await fetchJokes()
        store.jokes = jokesRes.data
      }
      catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
        store.errors = [...errors.value, errorMessage]
      }

      store.isLoading = false
    }

    if (!jokeTypes.value.length) {
      store.isLoading = true

      try {
        const jokeTypesRes = await fetchJokeTypes()
        store.jokeTypes = jokeTypesRes.data
      }
      catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
        store.errors = [...errors.value, errorMessage]
      }

      store.isLoading = false
    }
  })

  return {
    jokes,
    jokeTypes,
    jokeTypeOptions,
    hydrated,
    isLoading,
    errors,
    fetchJokes,
    createJoke,
    fetchJoke,
    updateJoke,
    deleteJoke,
  }
}
