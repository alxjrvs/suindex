import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '../../../test/chakra-utils'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { PilotsGrid } from '../PilotsGrid'
import * as api from '../../../lib/api'
import { createMockUser, createMockPilots } from '../../../test/mockFactories'

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

describe('PilotsGrid', () => {
  const mockUser = createMockUser()
  const mockPilots = createMockPilots(2)

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(api.getUser).mockResolvedValue(mockUser as never)
    vi.mocked(api.fetchUserEntities).mockResolvedValue(mockPilots as never)
  })

  describe('Grid Display', () => {
    it('should render page title', async () => {
      render(
        <BrowserRouter>
          <PilotsGrid />
        </BrowserRouter>
      )

      await waitFor(() => {
        expect(screen.getByText('Your Pilots')).toBeInTheDocument()
      })
    })

    it('should render create pilot button', async () => {
      render(
        <BrowserRouter>
          <PilotsGrid />
        </BrowserRouter>
      )

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /new pilot/i })).toBeInTheDocument()
      })
    })

    it('should render pilot cards after loading', async () => {
      render(
        <BrowserRouter>
          <PilotsGrid />
        </BrowserRouter>
      )

      await waitFor(() => {
        expect(screen.getByText('Test Pilot 1')).toBeInTheDocument()
        expect(screen.getByText('Test Pilot 2')).toBeInTheDocument()
      })
    })

    it('should display pilot stats on cards', async () => {
      render(
        <BrowserRouter>
          <PilotsGrid />
        </BrowserRouter>
      )

      await waitFor(() => {
        // Check for HP and AP stats
        expect(screen.getAllByText(/hp/i).length).toBeGreaterThan(0)
        expect(screen.getAllByText(/ap/i).length).toBeGreaterThan(0)
      })
    })
  })

  describe('Create Pilot Functionality', () => {
    it('should call createEntity when create button is clicked', async () => {
      const user = userEvent.setup()
      const mockCreateEntity = vi.mocked(api.createEntity)
      const newPilot = { ...mockPilots[0], id: 'new-pilot-id' }
      mockCreateEntity.mockResolvedValue(newPilot as never)

      render(
        <BrowserRouter>
          <PilotsGrid />
        </BrowserRouter>
      )

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /new pilot/i })).toBeInTheDocument()
      })

      const createButton = screen.getByRole('button', { name: /new pilot/i })
      await user.click(createButton)

      await waitFor(() => {
        expect(mockCreateEntity).toHaveBeenCalledWith('pilots', expect.any(Object))
      })
    })

    it('should navigate to new pilot after creation', async () => {
      const user = userEvent.setup()
      const mockCreateEntity = vi.mocked(api.createEntity)
      const newPilot = { ...mockPilots[0], id: 'new-pilot-id' }
      mockCreateEntity.mockResolvedValue(newPilot as never)

      render(
        <BrowserRouter>
          <PilotsGrid />
        </BrowserRouter>
      )

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /new pilot/i })).toBeInTheDocument()
      })

      const createButton = screen.getByRole('button', { name: /new pilot/i })
      await user.click(createButton)

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard/pilots/new-pilot-id')
      })
    })
  })

  describe('Pilot Card Navigation', () => {
    it('should navigate to pilot detail when card is clicked', async () => {
      const user = userEvent.setup()

      render(
        <BrowserRouter>
          <PilotsGrid />
        </BrowserRouter>
      )

      await waitFor(() => {
        expect(screen.getByText('Test Pilot 1')).toBeInTheDocument()
      })

      // Click the VIEW button
      const viewButtons = screen.getAllByText('VIEW')
      await user.click(viewButtons[0])

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard/pilots/pilot-1')
      })
    })
  })
})
