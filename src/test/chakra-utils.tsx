import { render as rtlRender } from '@testing-library/react'
import { ChakraProvider } from '@chakra-ui/react'
import { MemoryRouter } from 'react-router-dom'
import { system } from '../theme'
import type { ReactNode } from 'react'

// eslint-disable-next-line react-refresh/only-export-components
export * from '@testing-library/react'

export function render(ui: ReactNode) {
  return rtlRender(ui, {
    wrapper: ({ children }: { children: ReactNode }) => (
      <MemoryRouter>
        <ChakraProvider value={system}>
          <div style={{ width: '1920px', minWidth: '1920px' }}>{children}</div>
        </ChakraProvider>
      </MemoryRouter>
    ),
  })
}
