import { render as rtlRender } from '@testing-library/react'
import { ChakraProvider } from '@chakra-ui/react'
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { system } from '../theme'
import type { ReactNode } from 'react'

// eslint-disable-next-line react-refresh/only-export-components
export * from '@testing-library/react'

/**
 * Create a new QueryClient for each test with retries disabled
 * Following TanStack Query testing best practices:
 * https://tkdodo.eu/blog/testing-react-query
 */
function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  })
}

export function render(ui: ReactNode) {
  const queryClient = createTestQueryClient()

  const rootRoute = createRootRoute({
    component: () => <>{ui}</>,
  })

  const router = createRouter({
    routeTree: rootRoute,
    history: createMemoryHistory({
      initialEntries: ['/'],
    }),
  })

  return rtlRender(
    <QueryClientProvider client={queryClient}>
      <ChakraProvider value={system}>
        <div style={{ width: '1920px', minWidth: '1920px' }}>
          <RouterProvider router={router} />
        </div>
      </ChakraProvider>
    </QueryClientProvider>
  )
}
