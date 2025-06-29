<template>
  <header
    id="app-header"
    class="py-4 border-b dark:border-neutral-800 light:border-neutral-200 light:bg-neutral-50"
  >
    <div class="flex items-center mx-auto px-4 lg:container">
      <ULink
        variant="link"
        to="/"
        class="flex items-center gap-x-3 text-3xl"
      >
        <UIcon
          name="teenyicons:mood-laugh-solid"
          class="text-primary"
        />
        <span class="font-mono font-bold text-[var(--ui-text)]!">JokeDB</span>
      </ULink>
      <ClientOnly>
        <USwitch
          aria-label="Toggle color theme preference"
          :model-value="colorMode.value === 'dark'"
          size="xl"
          checked-icon="teenyicons:moon-outline"
          unchecked-icon="teenyicons:sun-outline"
          :ui="{ root: 'ml-auto' }"
          @update:model-value="colorMode.preference = $event ? 'dark' : 'light'"
        />
      </ClientOnly>
    </div>
  </header>
</template>

<script setup lang="ts">
const { colorMode } = storeToRefs(useUIStore())
</script>
