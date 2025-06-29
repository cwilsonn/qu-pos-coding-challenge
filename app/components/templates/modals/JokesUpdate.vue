<template>
  <UModal :ui="{ footer: 'justify-end' }">
    <template #title>
      <span class="inline-flex items-center gap-x-2">
        <UIcon name="tabler:pencil" />
        Edit Joke
      </span>
    </template>
    <template #body>
      <TemplatesFormsJokesUpdate
        ref="modalForm"
        :joke="joke"
        :include-actions="false"
        @submit="onSubmit"
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
        :form="modalFormId"
        type="submit"
        color="primary"
        variant="soft"
        :loading="loading"
      >
        <slot name="submit-label">
          Submit
        </slot>
      </UButton>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { Joke, JokeUpdatePayload } from '~~/schemas/jokes.schema'
import type JokesUpdateForm from '~/components/templates/forms/JokesUpdate.vue'

const { joke } = defineProps<{
  joke: Joke
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const { updateJoke } = useJokes()

const modalForm = ref<InstanceType<typeof JokesUpdateForm> | null>(null)
const modalFormId = computed(() => modalForm.value?.formId)

const loading = ref(false)

const onSubmit = async ({ payload }: { payload: JokeUpdatePayload }) => {
  loading.value = true
  await updateJoke({ id: joke.id, payload })
  loading.value = false
  emit('close')
}
</script>
