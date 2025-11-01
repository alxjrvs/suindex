import { render as rtlRender } from '@testing-library/react'
import { ChakraProvider } from '@chakra-ui/react'
import { MemoryRouter } from 'react-router-dom'
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
        // ✅ turns retries off for tests
        retry: false,
      },
      mutations: {
        // ✅ turns retries off for tests
        retry: false,
      },
    },
  })
}

export function render(ui: ReactNode) {
  // ✅ creates a new QueryClient for each test
  const queryClient = createTestQueryClient()

  return rtlRender(ui, {
    wrapper: ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ChakraProvider value={system}>
            <div style={{ width: '1920px', minWidth: '1920px' }}>{children}</div>
          </ChakraProvider>
        </MemoryRouter>
      </QueryClientProvider>
    ),
  })
}
