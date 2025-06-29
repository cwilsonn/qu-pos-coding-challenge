<template>
  <UModal
    description="Are you sure you want to delete this joke? This action cannot be undone."
    :ui="{ footer: 'justify-end' }"
    class="max-w-4xl!"
  >
    <template #title>
      <span class="inline-flex items-center gap-x-2">
        <UIcon name="tabler:trash" />
        Delete Joke
      </span>
    </template>
    <template #body>
      <MoleculesJokesCard
        :joke="joke"
        :include-actions="false"
      />
    </template>
    <template #footer="{ close }">
      <UButton
        type="reset"
        color="neutral"
        variant="soft"
        @click="close"
      >
        <slot name="cancel-label">
          Cancel
        </slot>
      </UButton>
      <UButton
        type="button"
        color="error"
        variant="soft"
        :loading="loading"
        @click="onDelete"
      >
        <slot name="submit-label">
          I'm sure, delete it
        </slot>
      </UButton>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { Joke } from '~~/schemas/jokes.schema'

const { joke } = defineProps<{
  joke: Joke
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const { deleteJoke } = useJokes()

const loading = ref(false)

const onDelete = async () => {
  loading.value = true
  await deleteJoke({ id: joke.id })
  loading.value = false
  emit('close')
}
</script>
