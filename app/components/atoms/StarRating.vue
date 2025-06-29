<template>
  <div
    role="radiogroup"
    aria-label="Rate this item from 1 to 5 stars"
    @mouseleave="disabled ? null : hoveredIndex = null"
  >
    <UButton
      v-for="i in 5"
      :key="i"
      role="radio"
      variant="link"
      color="neutral"
      :disabled="disabled"
      :aria-checked="isActive(i)"
      :class="isActive(i) ? 'text-yellow-500' : 'text-neutral'"
      :ui="{ base: 'p-1 group' }"
      @mouseenter="disabled ? null : hoveredIndex = i"
      @click="updateRating(i)"
      @keydown.space.prevent="updateRating(i)"
      @keydown.enter.prevent="updateRating(i)"
    >
      <UIcon
        :name="isActive(i) ? 'tabler:star-filled' : 'tabler:star'"
        :class="isActive(i) ? 'text-yellow-500' : 'text-neutral'"
      />
      <span class="sr-only">Rate {{ i }} out of 5</span>
    </UButton>
  </div>
</template>

<script setup lang="ts">
const { disabled = false } = defineProps<{
  disabled?: boolean
}>()

const rating = defineModel<number>({ default: 0 })

const hoveredIndex = ref<number | null>(null)

const isActive = (i: number) => {
  return hoveredIndex.value !== null
    ? i <= hoveredIndex.value
    : i <= rating.value
}

const updateRating = (newRating: number) => {
  rating.value = rating.value === newRating ? 0 : newRating
}
</script>
