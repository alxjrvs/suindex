import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, mock } from 'bun:test'
import { configure } from '@testing-library/dom'

configure({ asyncUtilTimeout: 5000 })

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock Supabase environment variables for tests
process.env.VITE_SUPABASE_URL = 'https://test.supabase.co'
process.env.VITE_SUPABASE_ANON_KEY = 'test-anon-key'

// Only set up DOM mocks if we're in a DOM environment
if (typeof window !== 'undefined') {
  // IntersectionObserver mock
  const IntersectionObserverMock = mock(
    () =>
      ({
        disconnect: mock(),
        observe: mock(),
        takeRecords: mock(),
        unobserve: mock(),
        root: null,
        rootMargin: '',
        thresholds: [],
      }) as unknown as IntersectionObserver
  )
  ;(globalThis as typeof globalThis & { IntersectionObserver: unknown }).IntersectionObserver =
    IntersectionObserverMock as unknown as typeof IntersectionObserver

  // Scroll Methods mock
  if (typeof Element !== 'undefined') {
    Element.prototype.scrollTo = () => {}
    Element.prototype.scrollIntoView = () => {}
  }

  // requestAnimationFrame mock
  globalThis.requestAnimationFrame = (cb: FrameRequestCallback): number =>
    setTimeout(cb, 1000 / 60) as unknown as number

  // URL object mock
  if (typeof URL !== 'undefined') {
    URL.createObjectURL = (): string => 'https://i.pravatar.cc/300'
    URL.revokeObjectURL = (): void => {}
  }

  // navigator mock
  Object.defineProperty(globalThis, 'navigator', {
    value: {
      clipboard: {
        writeText: mock(),
      },
    },
  })
}
