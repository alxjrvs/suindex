import { render as rtlRender } from '@testing-library/react'
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter } from 'react-router-dom'
import { system } from '../theme'
import type { ReactNode } from 'react'

export function render(ui: ReactNode) {
  return rtlRender(<>{ui}</>, {
    wrapper: (props: { children: ReactNode }) => (
      <ChakraProvider value={system}>{props.children}</ChakraProvider>
    ),
  })
}

/**
 * Render a component with BrowserRouter wrapper for testing components that use routing
 * @param ui - The component to render
 * @returns The render result
 */
export function renderWithRouter(ui: ReactNode) {
  return rtlRender(<BrowserRouter>{ui}</BrowserRouter>, {
    wrapper: (props: { children: ReactNode }) => (
      <ChakraProvider value={system}>{props.children}</ChakraProvider>
    ),
  })
}

// eslint-disable-next-line react-refresh/only-export-components
export * from '@testing-library/react'
