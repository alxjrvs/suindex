import { render, type RenderOptions } from '@testing-library/react'
import { ChakraProvider } from '@chakra-ui/react'
import { system } from '../theme'
import type { ReactElement, ReactNode } from 'react'

interface ChakraProviderProps {
  children: ReactNode
}

function AllTheProviders({ children }: ChakraProviderProps) {
  return <ChakraProvider value={system}>{children}</ChakraProvider>
}

function customRender(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return render(ui, { wrapper: AllTheProviders, ...options })
}

export * from '@testing-library/react'
export { customRender as render }

