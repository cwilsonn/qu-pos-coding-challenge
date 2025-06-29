<template>
  <UForm
    :id="formId"
    :schema="jokeUpdateSchema"
    :state="formState"
    class="space-y-4"
    @submit="onSubmit"
  >
    <UFormField
      label="Type"
      required
    >
      <USelect
        v-model="formState.type"
        :items="jokeTypeOptions"
        :ui="{ base: 'w-full' }"
        required
      />
    </UFormField>
    <UFormField
      label="Setup"
      required
    >
      <UInput
        v-model="formState.setup"
        :placeholder="`What's the setup for this joke?`"
        :ui="{ root: 'w-full' }"
        required
      />
    </UFormField>
    <UFormField
      label="Punchline"
      required
    >
      <UInput
        v-model="formState.punchline"
        :placeholder="`What's the punchline for this joke?`"
        :ui="{ root: 'w-full' }"
        required
      />
      <UButton
        v-if="includeActions"
        type="submit"
        color="primary"
        variant="soft"
      >
        <slot name="submit-label">
          Submit
        </slot>
      </UButton>
    </uformfield>
  </UForm>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { type Joke, type JokeUpdatePayload, jokeUpdateSchema } from '~~/schemas/jokes.schema'

const { joke, includeActions = true } = defineProps<{
  joke: Joke
  includeActions?: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', { id, payload }: { id: string, payload: JokeUpdatePayload }): void
  (e: 'cancel'): void
}>()

const formId = computed(() => `form-joke-edit-${joke.id}`)
const formState = reactive({
  type: joke.type,
  setup: joke.setup,
  punchline: joke.punchline,
})

const { jokeTypeOptions } = useJokes()

const onSubmit = ({ data }: FormSubmitEvent<JokeUpdatePayload>) => {
  emit('submit', { id: joke.id, payload: data })
}

defineExpose({ formId, formState })
</script>
