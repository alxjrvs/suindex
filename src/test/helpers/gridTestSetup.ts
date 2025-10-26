import { vi } from 'vitest'
import * as api from '../../lib/api'

/**
 * Setup common mocks for Grid component tests
 * This includes API mocking and navigation mocking
 */
export function setupGridTestMocks() {
  // Mock the API module
  vi.mock('../../lib/api', () => ({
    getUser: vi.fn(),
    fetchUserEntities: vi.fn(),
    createEntity: vi.fn(),
  }))

  // Mock useNavigate
  const mockNavigate = vi.fn()
  vi.mock('react-router', async () => {
    const actual = await vi.importActual('react-router')
    return {
      ...actual,
      useNavigate: () => mockNavigate,
    }
  })

  return { mockNavigate }
}

/**
 * Setup beforeEach hook for Grid tests with mock data
 * @param mockUser - Mock user object
 * @param mockEntities - Mock entities array (pilots, mechs, crawlers, etc.)
 */
export function setupGridBeforeEach<T>(mockUser: unknown, mockEntities: T[]) {
  return () => {
    vi.clearAllMocks()
    vi.mocked(api.getUser).mockResolvedValue(mockUser as never)
    vi.mocked(api.fetchUserEntities).mockResolvedValue(mockEntities as never)
  }
}

/**
 * Complete setup for Grid component tests
 * Combines mock setup and beforeEach configuration
 *
 * @example
 * ```typescript
 * const { mockNavigate } = setupGridTest(mockUser, mockPilots)
 * ```
 */
export function setupGridTest<T>(mockUser: unknown, mockEntities: T[]) {
  const { mockNavigate } = setupGridTestMocks()
  const beforeEachFn = setupGridBeforeEach(mockUser, mockEntities)

  return {
    mockNavigate,
    beforeEachFn,
  }
}

/**
 * Mock window.confirm to always return true
 * Useful for tests that trigger confirmation dialogs
 *
 * @example
 * ```typescript
 * beforeEach(() => {
 *   mockWindowConfirm()
 * })
 * ```
 */
export function mockWindowConfirm(returnValue = true) {
  return vi.spyOn(window, 'confirm').mockReturnValue(returnValue)
}

/**
 * Mock window.confirm to always return false
 * Useful for testing cancellation flows
 */
export function mockWindowConfirmCancel() {
  return mockWindowConfirm(false)
}
