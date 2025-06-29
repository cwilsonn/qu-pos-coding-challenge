<template>
  <article class="page">
    <header class="flex items-center mb-12 text-2xl gap-x-4">
      <h1 class="font-bold font-mono flex items-center gap-x-4">
        <UIcon
          v-if="computedIcon"
          :name="computedIcon"
        />
        {{ computedTitle }}
      </h1>
      <div
        v-if="$slots.actions"
        class="ml-auto"
      >
        <ClientOnly>
          <slot name="actions" />
        </ClientOnly>
      </div>
    </header>
    <slot>
      <p
        v-if="isDev"
        class="text-muted"
      >
        No content provided for this page.
      </p>
    </slot>
  </article>
</template>

<script setup lang="ts">
const {
  title = null,
  icon = null,
} = defineProps<{
  title?: string | null
  icon?: string | null
}>()

const isDev = computed(() => import.meta.env.MODE === 'development')

const route = useRoute()

const computedIcon = computed(() => {
  const _icon = icon || route.meta.ui?.page?.icon
  return _icon || null
})

const computedTitle = computed(() => {
  const _title = title || route.meta.ui?.page?.title
  return _title || String(route.name) || 'Untitled Page'
})
</script>
