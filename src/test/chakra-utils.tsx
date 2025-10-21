import { render as rtlRender } from '@testing-library/react'
import { ChakraProvider } from '@chakra-ui/react'
import { system } from '../theme'
import type { ReactNode } from 'react'

export function render(ui: ReactNode) {
  return rtlRender(<>{ui}</>, {
    wrapper: (props: { children: ReactNode }) => (
      <ChakraProvider value={system}>{props.children}</ChakraProvider>
    ),
  })
}

// eslint-disable-next-line react-refresh/only-export-components
export * from '@testing-library/react'
