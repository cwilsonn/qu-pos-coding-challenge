<template>
  <TemplatesPageBase>
    <template #actions>
      <UButton
        color="primary"
        variant="soft"
        icon="tabler:plus"
        @click="jokesCreateModal.open()"
      >
        Create Joke
      </UButton>
    </template>
    <OrganismsJokesList
      :jokes="jokes"
      :is-loading="isLoading || !hydrated"
    />
  </TemplatesPageBase>
</template>

<script setup lang="ts">
import JokesCreateModal from '~/components/templates/modals/JokesCreate.vue'

definePageMeta({
  ui: {
    page: {
      title: 'All Jokes',
      icon: 'teenyicons:database-outline',
    },
  },
})
const { jokes, isLoading, hydrated } = useJokes()

const overlay = useOverlay()
const jokesCreateModal = overlay.create(JokesCreateModal)
</script>
