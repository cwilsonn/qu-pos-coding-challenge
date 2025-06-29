# Qu POS Coding Challenge

## Overview and Objective

This project is a frontend coding challenge for Qu POS built using Nuxt 3, along with `@nuxt/ui` and associated libraries.

The primary goal was to build a UI that requests and displays a list of jokes, including sorting and pagination functionality. I've gone beyond the base requirement to showcase frontend architecture and thoughtful UX with the following enhancements:

- 🔍 **Keyword search** across joke properties
- 🗂️ **Sorting controls** by property and order (ascending/descending)
- ⭐ **Joke rating** functionality via a custom star rating component
- 🎚️ **Filter controls** for joke type and rating
- 📄 **Page size selection** for pagination
- 🌘 **Dark/light theme toggle** — because we all know developers love a good dark mode
- 🌀 **Staggered list animations** via `@vueuse/motion`
- 🙊 **Optional punchline hiding** to avoid spoilers while browsing
- 📝 **Full CRUD support** including create, update, and delete — all with schema-based validation, reactive updates, and modal dialogs powered by `@nuxt/ui`

These additions were implemented with performance and reusability in mind, using pre-existing composables I've authored and generalized for cross-project use.

## Architecture notes

### Why `@nuxt/ui`?

I deliberately chose `@nuxt/ui` to reduce boilerplate around styling and layout, allowing me to focus on what I believe matters most in this challenge: **frontend composition, reactivity patterns, accessibility, and clean UX flows** powered by composables, stores, and modular patterns.

### Backend-for-Frontend (BFF)

The backend layer leverages Nuxt's server API (Nitro) and uses the **repository pattern** to cleanly separate concerns between request handling and data logic. API routes are versioned (`/api/v1`) to mirror best practices in production-scale systems.

### Frontend Patterns

- ✅ **Pinia stores** manage pure state without side effects
- 🔄 **Composables** encapsulate reusable reactive logic and orchestration (e.g., `useSort`, `useSearch`, `usePagination`, `useJokes`)
- 🧠 **Services** handles request and business logic
- 🎨 **Components** are structured by atomic design principles for clarity and reuse
- 🧱 **CRUD modals** leverage `@nuxt/ui`'s built-in `useOverlay()` for clean UX and separation of concerns

These patterns are modular, testable, and easily extendable in a real-world application.

## Setup

Install dependencies:

```bash
# npm
npm install
```

## Linting

Linting on save is pre-configured for VSCode, but you can also run it manually:

```bash
# Check fo linting issues
npm run lint

# Auto-fix linting issues
npm run lint:fix
```

## Development Server

Start the local development server on `http://localhost:3000`:

```bash
# npm
npm run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build
```

Locally preview production build:

```bash
# npm
npm run preview
```

Thanks again for reviewing this submission—I've had a lot of fun putting it together!
