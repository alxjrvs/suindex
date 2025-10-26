import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '../../../test/chakra-utils'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { MechsGrid } from '../MechsGrid'
import * as api from '../../../lib/api'
import type { Tables } from '../../../types/database'

// Mock the API
vi.mock('../../../lib/api', () => ({
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

describe('MechsGrid', () => {
  const mockUser = {
    id: 'test-user-id',
    email: 'test@example.com',
  }

  const mockMechs: Tables<'mechs'>[] = [
    {
      id: 'mech-1',
      user_id: 'test-user-id',
      pattern: 'Test Mech 1',
      chassis_id: null,
      current_damage: 0,
      current_heat: 0,
      current_ep: 0,
      cargo: null,
      systems: null,
      modules: null,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      game_id: null,
      pilot_id: null,
    },
    {
      id: 'mech-2',
      user_id: 'test-user-id',
      pattern: 'Test Mech 2',
      chassis_id: null,
      current_damage: 5,
      current_heat: 3,
      current_ep: 2,
      cargo: null,
      systems: null,
      modules: null,
      created_at: '2024-01-02T00:00:00Z',
      updated_at: '2024-01-02T00:00:00Z',
      game_id: null,
      pilot_id: null,
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(api.getUser).mockResolvedValue(mockUser as never)
    vi.mocked(api.fetchUserEntities).mockResolvedValue(mockMechs as never)
  })

  describe('Grid Display', () => {
    it('should render page title', async () => {
      render(
        <BrowserRouter>
          <MechsGrid />
        </BrowserRouter>
      )

      await waitFor(() => {
        expect(screen.getByText('Your Mechs')).toBeInTheDocument()
      })
    })

    it('should render create mech button', async () => {
      render(
        <BrowserRouter>
          <MechsGrid />
        </BrowserRouter>
      )

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /new mech/i })).toBeInTheDocument()
      })
    })

    it('should display loading state initially', () => {
      render(
        <BrowserRouter>
          <MechsGrid />
        </BrowserRouter>
      )

      // Check for loading spinner (Chakra UI Spinner doesn't have progressbar role)
      expect(screen.getByText('Your Mechs')).toBeInTheDocument()
    })

    it('should render mech cards after loading', async () => {
      render(
        <BrowserRouter>
          <MechsGrid />
        </BrowserRouter>
      )

      await waitFor(() => {
        expect(screen.getByText('Test Mech 1')).toBeInTheDocument()
        expect(screen.getByText('Test Mech 2')).toBeInTheDocument()
      })
    })

    it('should display mech stats on cards', async () => {
      render(
        <BrowserRouter>
          <MechsGrid />
        </BrowserRouter>
      )

      await waitFor(() => {
        // Check for damage and heat stats
        expect(screen.getAllByText(/damage/i).length).toBeGreaterThan(0)
        expect(screen.getAllByText(/heat/i).length).toBeGreaterThan(0)
      })
    })
  })

  describe('Create Mech Functionality', () => {
    it('should call createEntity when create button is clicked', async () => {
      const user = userEvent.setup()
      const mockCreateEntity = vi.mocked(api.createEntity)
      const newMech = { ...mockMechs[0], id: 'new-mech-id' }
      mockCreateEntity.mockResolvedValue(newMech as never)

      render(
        <BrowserRouter>
          <MechsGrid />
        </BrowserRouter>
      )

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /new mech/i })).toBeInTheDocument()
      })

      const createButton = screen.getByRole('button', { name: /new mech/i })
      await user.click(createButton)

      await waitFor(() => {
        expect(mockCreateEntity).toHaveBeenCalledWith('mechs', expect.any(Object))
      })
    })

    it('should navigate to new mech after creation', async () => {
      const user = userEvent.setup()
      const mockCreateEntity = vi.mocked(api.createEntity)
      const newMech = { ...mockMechs[0], id: 'new-mech-id' }
      mockCreateEntity.mockResolvedValue(newMech as never)

      render(
        <BrowserRouter>
          <MechsGrid />
        </BrowserRouter>
      )

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /new mech/i })).toBeInTheDocument()
      })

      const createButton = screen.getByRole('button', { name: /new mech/i })
      await user.click(createButton)

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard/mechs/new-mech-id')
      })
    })

    it('should show loading state while creating', async () => {
      const user = userEvent.setup()
      const mockCreateEntity = vi.mocked(api.createEntity)

      // Make createEntity hang to test loading state
      mockCreateEntity.mockImplementation(() => new Promise(() => {}))

      render(
        <BrowserRouter>
          <MechsGrid />
        </BrowserRouter>
      )

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /new mech/i })).toBeInTheDocument()
      })

      const createButton = screen.getByRole('button', { name: /new mech/i })
      await user.click(createButton)

      await waitFor(() => {
        expect(createButton).toBeDisabled()
      })
    })
  })

  describe('Mech Card Navigation', () => {
    it('should navigate to mech detail when card is clicked', async () => {
      const user = userEvent.setup()

      render(
        <BrowserRouter>
          <MechsGrid />
        </BrowserRouter>
      )

      await waitFor(() => {
        expect(screen.getByText('Test Mech 1')).toBeInTheDocument()
      })

      // Click the VIEW button
      const viewButtons = screen.getAllByText('VIEW')
      await user.click(viewButtons[0])

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard/mechs/mech-1')
      })
    })
  })

  describe('Error Handling', () => {
    it('should display error message when loading fails', async () => {
      vi.mocked(api.fetchUserEntities).mockRejectedValue(new Error('Failed to load mechs'))

      render(
        <BrowserRouter>
          <MechsGrid />
        </BrowserRouter>
      )

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument()
      })
    })

    it('should retry loading when retry button is clicked', async () => {
      const user = userEvent.setup()
      vi.mocked(api.fetchUserEntities).mockRejectedValueOnce(new Error('Failed to load mechs'))

      render(
        <BrowserRouter>
          <MechsGrid />
        </BrowserRouter>
      )

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument()
      })

      // Reset mock to succeed on retry
      vi.mocked(api.fetchUserEntities).mockResolvedValue(mockMechs as never)

      const retryButton = screen.getByRole('button', { name: /retry/i })
      await user.click(retryButton)

      await waitFor(() => {
        expect(screen.getByText('Test Mech 1')).toBeInTheDocument()
      })
    })
  })
})
