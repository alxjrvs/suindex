import { expect, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'

expect.extend(matchers)

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock Supabase environment variables for tests
process.env.VITE_SUPABASE_URL = 'https://test.supabase.co'
process.env.VITE_SUPABASE_ANON_KEY = 'test-anon-key'

// Mock Supabase globally for all tests
vi.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
      insert: vi.fn().mockResolvedValue({ data: null, error: null }),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
    })),
  },
}))

// IntersectionObserver mock
const IntersectionObserverMock = vi.fn(
  () =>
    ({
      disconnect: vi.fn(),
      observe: vi.fn(),
      takeRecords: vi.fn(),
      unobserve: vi.fn(),
      root: null,
      rootMargin: '',
      thresholds: [],
    }) as unknown as IntersectionObserver
)
vi.stubGlobal('IntersectionObserver', IntersectionObserverMock)
;(window as Window & typeof globalThis).IntersectionObserver =
  IntersectionObserverMock as unknown as typeof IntersectionObserver

// Scroll Methods mock
window.Element.prototype.scrollTo = () => {}
window.Element.prototype.scrollIntoView = () => {}

// requestAnimationFrame mock
window.requestAnimationFrame = (cb: FrameRequestCallback): number =>
  setTimeout(cb, 1000 / 60) as unknown as number

// URL object mock
window.URL.createObjectURL = (): string => 'https://i.pravatar.cc/300'
window.URL.revokeObjectURL = (): void => {}

// navigator mock
Object.defineProperty(window, 'navigator', {
  value: {
    clipboard: {
      writeText: vi.fn(),
    },
  },
})

// Override globalThis
Object.assign(global, { window, document: window.document })
