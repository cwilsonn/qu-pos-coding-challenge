export const useUIStore = defineStore('ui', () => {
  const colorMode = useColorMode()
  return { colorMode }
}, {
  persist: {
    storage: import.meta.client ? localStorage : undefined,
  },
})
