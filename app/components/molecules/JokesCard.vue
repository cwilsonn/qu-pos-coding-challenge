<template>
  <UCard
    variant="soft"
    :ui="{ header: 'font-mono' }"
  >
    <template #header>
      <div class="flex items-center gap-4 justify-between flex-wrap">
        <h3 class="font-bold">
          {{ joke.setup }}
        </h3>
        <ul
          aria-label="Joke metadata"
          class="flex items-center gap-2"
        >
          <li>
            <AtomsStarRating
              :disabled="!includeActions"
              :model-value="joke.rating"
              @update:model-value="onUpdateRating"
            />
          </li>
          <li>
            <UBadge
              aria-label="Joke type"
              :color="(jokeTypeBadgeColors[joke.type] as BadgeProps['color'])"
              variant="outline"
              :ui="{ base: 'ml-auto' }"
            >
              {{ joke.type.charAt(0).toUpperCase() + joke.type.slice(1) }}
            </UBadge>
          </li>
          <li v-if="includeActions">
            <UDropdownMenu
              :items="jokeActionsItems"
              :content="{
                align: 'end',
              }"
              placement="bottom-end"
            >
              <UButton
                title="Joke actions"
                icon="tabler:dots-vertical"
                variant="outline"
                color="neutral"
                size="sm"
              />
            </UDropdownMenu>
          </li>
        </ul>
      </div>
    </template>
    <UButton
      v-if="punchlineToggle"
      variant="soft"
      color="primary"
      :icon="punchlineRevealed ? 'tabler:eye-off' : 'tabler:eye'"
      @click="punchlineRevealed = !punchlineRevealed"
    >
      {{ punchlineRevealed ? 'Hide': 'Show' }} Punchline
    </UButton>
    <Transition
      name="fade"
      mode="out-in"
    >
      <p
        v-if="punchlineRevealed || !punchlineToggle"
        :class="punchlineToggle ? 'mt-4' : ''"
      >
        {{ joke.punchline }}
      </p>
    </Transition>
  </UCard>
</template>

<script setup lang="ts">
import type { BadgeProps, DropdownMenuItem } from '@nuxt/ui'
import type { Joke } from '~~/schemas/jokes.schema'
import JokesUpdateModal from '~/components/templates/modals/JokesUpdate.vue'
import JokesDeleteModal from '~/components/templates/modals/JokesDelete.vue'

const {
  punchlineToggle = false,
  includeActions = true,
} = defineProps<{
  punchlineToggle?: boolean
  includeActions?: boolean
}>()

const joke = defineModel<Joke>('joke', {
  type: Object as () => Joke,
  default: () => {},
})

const emit = defineEmits<{
  (e: 'update:joke', updatedJoke: Joke): void
}>()

const overlay = useOverlay()

// Whether or not to show the joke's punchline. Only applicable if `punchlineToggle` is true.
const punchlineRevealed = ref(false)

// A mapping of joke types to their corresponding badge colors.
const jokeTypeBadgeColors: Record<string, string> = {
  'programming': 'primary',
  'general': 'secondary',
  'knock-knock': 'warning',
  'dad': 'error',
}

// Joke actions items for the dropdown menu.
const jokeActionsItems = [
  {
    label: 'Edit',
    icon: 'tabler:pencil',
    onSelect: () => {
      // Instantiate the update modal overlay instance
      // with the current joke within the handler in order to pass up-to-date data.
      const jokesUpdateModal = overlay.create(JokesUpdateModal, {
        props: {
          joke: joke.value,
        },
      })

      jokesUpdateModal.open()
    },
  },
  {
    label: 'Delete',
    icon: 'tabler:trash',
    color: 'error',
    onSelect: () => {
      // Instantiate the delete modal overlay instance
      // with the current joke within the handler in order to pass up-to-date data.
      const jokesDeleteModal = overlay.create(JokesDeleteModal, {
        props: {
          joke: joke.value,
        },
      })

      jokesDeleteModal.open()
    },
  },
] satisfies DropdownMenuItem[]

const onUpdateRating = (rating: number) => {
  joke.value.rating = rating
  emit('update:joke', { ...joke.value, rating })
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
