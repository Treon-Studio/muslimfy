import { createTRPCReact } from '@trpc/react-query'
import { httpBatchLink } from '@trpc/client'
import { QueryClient } from '@tanstack/react-query'
import superjson from 'superjson'
import type { AppRouter } from '@muslimfy/api'

export const trpc = createTRPCReact<AppRouter>()

export function createTRPCClient() {
  return trpc.createClient({
    links: [
      httpBatchLink({
        url: import.meta.env.PUBLIC_API_URL
          ? `${import.meta.env.PUBLIC_API_URL}/trpc`
          : 'http://localhost:3000/trpc',
        headers() {
          const token = localStorage.getItem('accessToken')
          return token ? { Authorization: `Bearer ${token}` } : {}
        },
        transformer: superjson,
      }),
    ],
  })
}

// Singletons so all Astro islands share the same cache
let _queryClient: QueryClient | null = null
let _trpcClient: ReturnType<typeof trpc.createClient> | null = null

export function getQueryClient() {
  if (!_queryClient) _queryClient = new QueryClient()
  return _queryClient
}

export function getTRPCClient() {
  if (!_trpcClient) _trpcClient = createTRPCClient()
  return _trpcClient
}
