import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    ui: {
      page: {
        title?: string
        icon?: string
      }
    }
  }
}
