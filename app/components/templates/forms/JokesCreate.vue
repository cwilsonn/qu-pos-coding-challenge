<template>
  <UForm
    :id="formId"
    :schema="jokeCreateSchema"
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
    </UFormField>
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
  </UForm>
</template>

<script setup lang="ts">
import type { Form, FormSubmitEvent } from '@nuxt/ui'
import { type JokeCreatePayload, jokeCreateSchema } from '~~/schemas/jokes.schema'

const { includeActions = true } = defineProps<{
  includeActions?: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', { payload }: { payload: JokeCreatePayload }): void
  (e: 'cancel'): void
}>()

const formId = 'form-jokes-create'
const formState = reactive<JokeCreatePayload>({
  type: 'general',
  setup: '',
  punchline: '',
})

const { jokeTypeOptions } = useJokes()

const onSubmit = ({ data: payload }: FormSubmitEvent<JokeCreatePayload>) => {
  emit('submit', { payload })
}

defineExpose({ formId, formState })
</script>
