import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '../../../test/chakra-utils'
import { Auth } from '../Auth'

// Mock the API
vi.mock('../../../lib/api', () => ({
  signInWithDiscord: vi.fn(),
}))

describe('Dashboard Auth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Auth Page Display', () => {
    it('should render sign in button', () => {
      render(<Auth />)

      expect(screen.getByRole('button', { name: /sign in with discord/i })).toBeInTheDocument()
    })

    it('should center the sign in button', () => {
      render(<Auth />)

      const button = screen.getByRole('button', { name: /sign in with discord/i })
      const container = button.closest('div')

      expect(container).toHaveStyle({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      })
    })

    it('should have full viewport height', () => {
      render(<Auth />)

      const button = screen.getByRole('button', { name: /sign in with discord/i })
      const container = button.closest('div')

      expect(container).toHaveStyle({
        minHeight: '100vh',
      })
    })
  })
})
