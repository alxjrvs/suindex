import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '../../test/chakra-utils'
import userEvent from '@testing-library/user-event'
import { TopNavigation } from '../TopNavigation'
import schemaIndexData from 'salvageunion-reference/schemas/index.json'
import * as api from '../../lib/api'
import { createMockUser } from '../../test/mockFactories'

// Mock the API
vi.mock('../../lib/api', () => ({
  signOut: vi.fn(),
  signInWithDiscord: vi.fn(),
}))

describe('TopNavigation', () => {
  const schemas = schemaIndexData.schemas
  const mockUser = createMockUser()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Navigation Items - Not Logged In', () => {
    it('should render Salvage Union Index link', () => {
      render(<TopNavigation user={null} schemas={schemas} />)

      expect(screen.getByText('Salvage Union')).toBeInTheDocument()
    })

    it('should render Schema dropdown', () => {
      render(<TopNavigation user={null} schemas={schemas} />)

      expect(screen.getByText('Schema')).toBeInTheDocument()
    })

    it('should render Playground dropdown', () => {
      render(<TopNavigation user={null} schemas={schemas} />)

      expect(screen.getByText('Playground')).toBeInTheDocument()
    })

    it('should show sign in button when not logged in', () => {
      render(<TopNavigation user={null} schemas={schemas} />)

      expect(screen.getByText('Sign in with Discord')).toBeInTheDocument()
    })
  })

  describe('Navigation Items - Logged In', () => {
    it('should show user name when logged in', () => {
      render(<TopNavigation user={mockUser} schemas={schemas} />)

      expect(screen.getByText('Test User')).toBeInTheDocument()
    })

    it('should show sign out button when logged in', () => {
      render(<TopNavigation user={mockUser} schemas={schemas} />)

      expect(screen.getByText('Sign Out')).toBeInTheDocument()
    })

    it('should show Pilots link when logged in', () => {
      render(<TopNavigation user={mockUser} schemas={schemas} />)

      expect(screen.getByText('Pilots')).toBeInTheDocument()
    })

    it('should show Mechs link when logged in', () => {
      render(<TopNavigation user={mockUser} schemas={schemas} />)

      expect(screen.getByText('Mechs')).toBeInTheDocument()
    })

    it('should show Crawlers link when logged in', () => {
      render(<TopNavigation user={mockUser} schemas={schemas} />)

      expect(screen.getByText('Crawlers')).toBeInTheDocument()
    })

    it('should show Games link when logged in', () => {
      render(<TopNavigation user={mockUser} schemas={schemas} />)

      expect(screen.getByText('Games')).toBeInTheDocument()
    })
  })

  describe('Sign Out Functionality', () => {
    it('should call signOut when sign out button is clicked', async () => {
      const user = userEvent.setup()
      const mockSignOut = vi.mocked(api.signOut)

      render(<TopNavigation user={mockUser} schemas={schemas} />)

      const signOutButton = screen.getByText('Sign Out')
      await user.click(signOutButton)

      await waitFor(() => {
        expect(mockSignOut).toHaveBeenCalled()
      })
    })

    it('should show signing out state', async () => {
      const user = userEvent.setup()
      const mockSignOut = vi.mocked(api.signOut)

      // Make signOut hang to test loading state
      mockSignOut.mockImplementation(() => new Promise(() => {}))

      render(<TopNavigation user={mockUser} schemas={schemas} />)

      const signOutButton = screen.getByText('Sign Out')
      await user.click(signOutButton)

      await waitFor(() => {
        expect(screen.getByText('Signing out...')).toBeInTheDocument()
      })
    })

    it('should disable sign out button while signing out', async () => {
      const user = userEvent.setup()
      const mockSignOut = vi.mocked(api.signOut)

      // Make signOut hang to test loading state
      mockSignOut.mockImplementation(() => new Promise(() => {}))

      render(<TopNavigation user={mockUser} schemas={schemas} />)

      const signOutButton = screen.getByText('Sign Out')
      await user.click(signOutButton)

      await waitFor(() => {
        const button = screen.getByText('Signing out...')
        expect(button).toBeDisabled()
      })
    })
  })

  describe('Mobile Menu', () => {
    it('should render hamburger menu button on mobile', () => {
      render(<TopNavigation user={null} schemas={schemas} />)

      const menuButton = screen.getByLabelText('Toggle menu')
      expect(menuButton).toBeInTheDocument()
    })
  })
})
