// server/api/chats/index.get.ts
import { z } from 'zod'

defineRouteMeta({
  openAPI: {
    description: 'Fetch user conversations ledger dynamically.',
    tags: ['ai']
  }
})

export default defineEventHandler(async (event) => {
  // 💡 DATABASE-FREE BYPASS: Return an empty list array string natively.
  // This satisfies the UI layout engine so it renders your sidebar container elements smoothly.
  return []
})
