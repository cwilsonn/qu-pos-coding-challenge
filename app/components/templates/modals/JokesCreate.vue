<template>
  <UModal :ui="{ footer: 'justify-end' }">
    <template #title>
      <span class="inline-flex items-center gap-x-2">
        <UIcon name="tabler:plus" />
        Create Joke
      </span>
    </template>
    <template #body>
      <TemplatesFormsJokesCreate
        ref="modalForm"
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
import type { JokeCreatePayload } from '~~/schemas/jokes.schema'
import type JokesCreateForm from '~/components/templates/forms/JokesCreate.vue'

const emit = defineEmits<{
  (e: 'close'): void
}>()

const { createJoke } = useJokes()

const modalForm = ref<InstanceType<typeof JokesCreateForm> | null>(null)
const modalFormId = computed(() => modalForm.value?.formId)

const loading = ref(false)

const onSubmit = async ({ payload }: { payload: JokeCreatePayload }) => {
  loading.value = true
  await createJoke({ payload })
  loading.value = false
  emit('close')
}
</script>
