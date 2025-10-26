import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '../../test/chakra-utils'
import userEvent from '@testing-library/user-event'
import { DiscordSignInButton } from '../DiscordSignInButton'
import * as api from '../../lib/api'

// Mock the API
vi.mock('../../lib/api', () => ({
  signInWithDiscord: vi.fn(),
}))

describe('DiscordSignInButton', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Button Rendering', () => {
    it('should render sign in button', () => {
      render(<DiscordSignInButton />)

      const button = screen.getByRole('button', { name: /sign in with discord/i })
      expect(button).toBeInTheDocument()
    })

    it('should have Discord branding color', () => {
      render(<DiscordSignInButton />)

      const button = screen.getByRole('button', { name: /sign in with discord/i })
      expect(button).toHaveStyle({ backgroundColor: expect.any(String) })
    })
  })

  describe('Sign In Functionality', () => {
    it('should call signInWithDiscord when clicked', async () => {
      const user = userEvent.setup()
      const mockSignIn = vi.mocked(api.signInWithDiscord)

      render(<DiscordSignInButton />)

      const button = screen.getByRole('button', { name: /sign in with discord/i })
      await user.click(button)

      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith(expect.stringContaining('/dashboard'))
      })
    })

    it('should show loading state when signing in', async () => {
      const user = userEvent.setup()
      const mockSignIn = vi.mocked(api.signInWithDiscord)

      // Make signIn hang to test loading state
      mockSignIn.mockImplementation(() => new Promise(() => {}))

      render(<DiscordSignInButton />)

      const button = screen.getByRole('button', { name: /sign in with discord/i })
      await user.click(button)

      await waitFor(() => {
        expect(screen.getByText(/signing in/i)).toBeInTheDocument()
      })
    })

    it('should disable button while loading', async () => {
      const user = userEvent.setup()
      const mockSignIn = vi.mocked(api.signInWithDiscord)

      // Make signIn hang to test loading state
      mockSignIn.mockImplementation(() => new Promise(() => {}))

      render(<DiscordSignInButton />)

      const button = screen.getByRole('button', { name: /sign in with discord/i })
      await user.click(button)

      await waitFor(() => {
        expect(button).toBeDisabled()
      })
    })

    it('should handle sign in errors gracefully', async () => {
      const user = userEvent.setup()
      const mockSignIn = vi.mocked(api.signInWithDiscord)
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      mockSignIn.mockRejectedValue(new Error('Sign in failed'))

      render(<DiscordSignInButton />)

      const button = screen.getByRole('button', { name: /sign in with discord/i })
      await user.click(button)

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith('Error signing in:', expect.any(Error))
      })

      consoleErrorSpy.mockRestore()
    })

    it('should accept custom redirectTo prop', async () => {
      const user = userEvent.setup()
      const mockSignIn = vi.mocked(api.signInWithDiscord)
      const customRedirect = 'https://example.com/custom'

      render(<DiscordSignInButton redirectTo={customRedirect} />)

      const button = screen.getByRole('button', { name: /sign in with discord/i })
      await user.click(button)

      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith(customRedirect)
      })
    })
  })
})
