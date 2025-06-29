<template>
  <section>
    <ul
      v-if="isLoading"
      class="grid gap-4 animate-pulse"
    >
      <USkeleton
        v-for="i in paginationConfig.perPage"
        :key="i"
        class="h-28"
      />
    </ul>
    <template v-else>
      <!-- Search/Sort/Filter -->
      <UCard
        variant="soft"
        :ui="{ root: 'mb-4', body: 'flex items-center gap-4 flex-wrap' }"
      >
        <UFormField
          label="Search"
          name="search"
          :ui="{ root: 'flex-grow' }"
        >
          <template #label="{ label }">
            <span class="inline-flex items-center gap-x-1">
              <UIcon
                name="tabler:search"
                class="opacity-50"
              />
              {{ label }}
            </span>
          </template>
          <UInput
            v-model="searchConfig.query"
            placeholder="Search jokes"
            :ui="{ root: 'w-full!' }"
          />
        </UFormField>
        <UFormField
          label="Sort By"
          name="sort_by"
          :ui="{ root: 'flex-grow' }"
        >
          <template #label="{ label }">
            <span class="inline-flex items-center gap-x-1">
              <UIcon
                name="tabler:caret-up-down-filled"
                class="opacity-50"
              />
              {{ label }}
            </span>
          </template>
          <USelect
            v-model="(sortConfig.key as keyof Joke)"
            :items="sortByOptions"
            :ui="{ base: 'w-full' }"
            @update:model-value="handleUpdateSortKey"
          />
        </UFormField>
        <UFormField
          label="Sort Order"
          name="sort_order"
          :ui="{ root: 'flex-grow' }"
        >
          <template #label="{ label }">
            <span class="inline-flex items-center gap-x-1">
              <UIcon
                name="tabler:caret-up-down-filled"
                class="opacity-50"
              />
              {{ label }}
            </span>
          </template>
          <USelect
            v-model="(sortConfig.order as 'asc' | 'desc')"
            :disabled="!sortConfig.key"
            :items="sortOrderOptions"
            :ui="{ base: 'w-full' }"
          />
        </UFormField>
        <UFormField
          v-if="filterConfig.type"
          label="Type"
          name="type"
          :ui="{ root: 'flex-grow' }"
        >
          <template #label="{ label }">
            <span class="inline-flex items-center gap-x-1">
              <UIcon
                name="tabler:filter-filled"
                class="opacity-50"
              />
              {{ label }}
            </span>
          </template>
          <USelect
            v-model="filterConfig.type.value"
            :items="jokeTypeOptions"
            :ui="{ base: 'w-full' }"
          />
        </UFormField>
        <UFormField
          v-if="filterConfig.rating"
          label="Rating"
          name="rating"
          :ui="{ root: 'flex-grow' }"
        >
          <template #label="{ label }">
            <span class="inline-flex items-center gap-x-1">
              <UIcon
                name="tabler:filter-filled"
                class="opacity-50"
              />
              {{ label }}
            </span>
          </template>
          <USelect
            v-model="filterConfig.rating.value"
            :items="ratingFilterOptions"
            :ui="{ base: 'w-full' }"
          />
        </UFormField>
      </UCard>
      <USwitch
        v-model="includePunchlineToggle"
        aria-label="Provides a toggle button to show or hide punchlines in the jokes list when enabled."
        label="Include Punchline Toggle"
        :ui="{ root: 'mb-4' }"
      />
      <!-- Pagination -->
      <div class="flex gap-x-4 items-center">
        <span class="text-sm text-muted">
          {{ resultsCountText }}
        </span>
        <UFormField
          label="Per Page"
          name="items_per_page"
          size="sm"
          :ui="{ root: 'flex items-center gap-x-2 ml-auto' }"
        >
          <USelect
            v-model="paginationConfig.perPage"
            :items="[
              { label: '5', value: 5 },
              { label: '10', value: 10 },
              { label: '20', value: 20 },
              { label: '50', value: 50 },
            ]"
          />
        </UFormField>
        <UPagination
          v-model:page="paginationConfig.page"
          :items-per-page="paginationConfig.perPage"
          :total="sortedData.length"
          active-variant="soft"
          variant="soft"
        />
      </div>
      <!-- Card list -->
      <ul class="grid gap-4 my-8">
        <template v-if="paginatedData.length">
          <li
            v-for="(joke, index) in paginatedData"
            :key="joke.id"
          >
            <Motion
              tag="div"
              class="motion-fade-stagger opacity-0 translate-y-2"
              :initial="{ opacity: 0, y: 8 }"
              :enter="{ opacity: 1, y: 0 }"
              :leave="{ opacity: 0, y: -8 }"
              :style="{ '--motion-index': index }"
            >
              <MoleculesJokesCard
                :joke="joke"
                :punchline-toggle="includePunchlineToggle"
                @update:joke="({ id, ...payload }) => updateJoke({ id, payload })"
              />
            </Motion>
          </li>
        </template>
        <!-- No results -->
        <li v-else>
          <UCard variant="soft">
            <div class="p-4 text-center">
              <UIcon
                name="teenyicons:mood-frown-outline"
                class="text-neutral-500 mb-4 text-4xl"
              />
              <p class="text-neutral-500">
                No jokes found
              </p>
            </div>
          </UCard>
        </li>
      </ul>
      <!-- Pagination -->
      <div class="flex gap-x-4 items-center">
        <span class="text-sm text-muted">
          {{ resultsCountText }}
        </span>
        <UFormField
          label="Per Page"
          name="items_per_page"
          size="sm"
          :ui="{ root: 'flex items-center gap-x-2 ml-auto' }"
        >
          <USelect
            v-model="paginationConfig.perPage"
            :items="[
              { label: '5', value: 5 },
              { label: '10', value: 10 },
              { label: '20', value: 20 },
              { label: '50', value: 50 },
            ]"
          />
        </UFormField>
        <UPagination
          v-model:page="paginationConfig.page"
          :items-per-page="paginationConfig.perPage"
          :total="sortedData.length"
          active-variant="soft"
          variant="soft"
        />
      </div>
    </template>
  </section>
</template>

<script setup lang="ts">
import type { Joke } from '~~/schemas/jokes.schema'

const {
  isLoading = false,
} = defineProps<{
  isLoading?: boolean
}>()

const jokes = defineModel<Joke[]>('jokes', {
  type: Array as () => Joke[],
  default: () => [],
})

const { updateJoke } = useJokes()

const includePunchlineToggle = ref(true)

// #region Search
const searchConfig = ref<SearchConfig<Joke>>({
  query: '',
  keys: ['setup', 'punchline', 'type'],
})

const { searchedData } = useSearch<Joke>({
  data: jokes,
  config: searchConfig,
})
// #endregion

// #region Filter
const { jokeTypeOptions: rawJokeTypeOptions } = useJokes()
const jokeTypeOptions = computed(() => {
  if (!rawJokeTypeOptions.value) return []

  return [{ label: 'All', value: null }, ...rawJokeTypeOptions.value]
})

const ratingFilterOptions = [
  { label: 'All', value: null },
  { label: '1 Star', value: 1 },
  { label: '2 Stars', value: 2 },
  { label: '3 Stars', value: 3 },
  { label: '4 Stars', value: 4 },
  { label: '5 Stars', value: 5 },
]

const filterConfig = ref<FilterConfig<Joke>>({
  type: {
    condition: 'eq',
    value: null,
  },
  rating: {
    condition: 'eq',
    value: null,
  },
})

const { filteredData } = useFilter<Joke>({
  data: searchedData,
  config: filterConfig,
})
// #endregion

// #region Sort
const sortByOptions = computed(() => {
  if (!jokes.value.length) return []
  const excludedKeys = ['id', 'punchline']
  const options = Object.keys(jokes.value[0] as Joke)
    .filter((key: string) => !excludedKeys.includes(key))
    .map((key: string) => ({
      label: key.charAt(0).toUpperCase() + key.slice(1),
      value: key,
    }))

  return [{ label: 'None', value: null }, ...options]
})

const sortOrderOptions = computed(() => {
  const options = Object.entries(sortLabels).map(([key, value]) => ({
    label: value,
    value: key as 'asc' | 'desc',
  }))

  return [{ label: 'None', value: null }, ...options]
})

const handleUpdateSortKey = (newKey: string | null) => {
  if (newKey === null) {
    sortConfig.value.order = null
  }
}

const sortConfig = ref<SortConfig<Joke>>({
  key: null,
  order: null,
})

const { sortedData } = useSort<Joke>({
  data: filteredData,
  config: sortConfig.value,
})

// #region Pagination
const paginationConfig = ref({
  page: 1,
  perPage: 10,
})

const { paginatedData, resultsCountText } = usePagination<Joke>({
  data: sortedData,
  config: paginationConfig,
})

watch([searchConfig, sortConfig, filterConfig], () => {
  // Reset to first page on search, sort, or filter config change
  paginationConfig.value.page = 1
}, { deep: true })
// #endregion
</script>

<style scoped>
.motion-fade-stagger {
  @apply transition-[opacity,_transform] duration-300 ease-[cubic-bezier(0.25,_0.8,_0.5,_1)] delay-[calc(var(--motion-index,_0)*50ms)];
}
</style>
