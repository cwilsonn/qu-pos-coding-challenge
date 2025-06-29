import type { Joke } from '~~/schemas/jokes.schema'

export const useJokesStore = defineStore('jokes', () => {
  const jokes = ref<Joke[]>([])
  const jokeTypes = ref<Joke['type'][]>([])

  const hydrated = ref(false)
  const isLoading = ref(false)
  const errors = ref<string[]>([])

  return { jokes, jokeTypes, isLoading, errors, hydrated }
}, {
  persist: {
    storage: import.meta.client ? localStorage : undefined,
    pick: ['jokes', 'jokeTypes'],
  },
})
