import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '../../../test/chakra-utils'
import { BrowserRouter } from 'react-router-dom'
import { BuilderControlBar } from '../BuilderControlBar'
import { supabase } from '../../../lib/supabase'

// Mock supabase
vi.mock('../../../lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(),
    },
    from: vi.fn(),
  },
}))

const mockSupabase = supabase as any

describe('BuilderControlBar', () => {
  const mockUser = { id: 'user-123' }
  const mockOnSave = vi.fn()
  const mockOnResetChanges = vi.fn()
  const mockOnGameChange = vi.fn()
  const mockOnPilotChange = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } })
  })

  describe('Crawler Builder', () => {
    it('fetches games for crawler builder', async () => {
      const mockGames = [
        { id: 'game-1', name: 'Game 1' },
        { id: 'game-2', name: 'Game 2' },
      ]

      const mockGameMembers = [{ game_id: 'game-1' }, { game_id: 'game-2' }]

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'game_members') {
          return {
            select: () => ({
              eq: () => Promise.resolve({ data: mockGameMembers }),
            }),
          }
        }
        if (table === 'games') {
          return {
            select: () => ({
              in: () => ({
                order: () => Promise.resolve({ data: mockGames }),
              }),
            }),
          }
        }
        return {}
      })

      render(
        <BrowserRouter>
          <BuilderControlBar
            backgroundColor="#c97d9e"
            entityType="crawler"
            gameId={null}
            onGameChange={mockOnGameChange}
            onSave={mockOnSave}
            onResetChanges={mockOnResetChanges}
            hasUnsavedChanges={false}
          />
        </BrowserRouter>
      )

      await waitFor(() => {
        expect(screen.getByText('Game:')).toBeInTheDocument()
      })
    })

    it('shows link button when game is assigned', async () => {
      const mockGames = [{ id: 'game-1', name: 'Game 1' }]
      const mockGameMembers = [{ game_id: 'game-1' }]

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'game_members') {
          return {
            select: () => ({
              eq: () => Promise.resolve({ data: mockGameMembers }),
            }),
          }
        }
        if (table === 'games') {
          return {
            select: () => ({
              in: () => ({
                order: () => Promise.resolve({ data: mockGames }),
              }),
            }),
          }
        }
        return {}
      })

      render(
        <BrowserRouter>
          <BuilderControlBar
            backgroundColor="#c97d9e"
            entityType="crawler"
            gameId="game-1"
            savedGameId="game-1"
            onGameChange={mockOnGameChange}
            onSave={mockOnSave}
            onResetChanges={mockOnResetChanges}
            hasUnsavedChanges={false}
          />
        </BrowserRouter>
      )

      await waitFor(() => {
        expect(screen.getByText('→ Game')).toBeInTheDocument()
      })
    })
  })

  describe('Mech Builder', () => {
    it('shows pilot dropdown and link button when pilot is assigned', async () => {
      const mockPilots = [{ id: 'pilot-1', callsign: 'Pilot 1' }]

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'pilots') {
          return {
            select: () => ({
              eq: () => ({
                order: () => Promise.resolve({ data: mockPilots }),
              }),
            }),
          }
        }
        return {}
      })

      render(
        <BrowserRouter>
          <BuilderControlBar
            backgroundColor="#6b8e7f"
            entityType="mech"
            pilotId="pilot-1"
            savedPilotId="pilot-1"
            onPilotChange={mockOnPilotChange}
            onSave={mockOnSave}
            onResetChanges={mockOnResetChanges}
            hasUnsavedChanges={false}
          />
        </BrowserRouter>
      )

      await waitFor(() => {
        expect(screen.getByText('Pilot:')).toBeInTheDocument()
        expect(screen.getByText('→ Pilot')).toBeInTheDocument()
      })
    })
  })

  describe('Save and Reset buttons', () => {
    it('disables save and reset when no unsaved changes', async () => {
      render(
        <BrowserRouter>
          <BuilderControlBar
            backgroundColor="#c97d9e"
            entityType="crawler"
            onSave={mockOnSave}
            onResetChanges={mockOnResetChanges}
            hasUnsavedChanges={false}
          />
        </BrowserRouter>
      )

      const saveButton = screen.getByRole('button', { name: /save/i })
      const resetButton = screen.getByRole('button', { name: /reset changes/i })

      expect(saveButton).toBeDisabled()
      expect(resetButton).toBeDisabled()
    })

    it('enables save and reset when there are unsaved changes', async () => {
      render(
        <BrowserRouter>
          <BuilderControlBar
            backgroundColor="#c97d9e"
            entityType="crawler"
            onSave={mockOnSave}
            onResetChanges={mockOnResetChanges}
            hasUnsavedChanges={true}
          />
        </BrowserRouter>
      )

      const saveButton = screen.getByRole('button', { name: /save/i })
      const resetButton = screen.getByRole('button', { name: /reset changes/i })

      expect(saveButton).not.toBeDisabled()
      expect(resetButton).not.toBeDisabled()
    })
  })
})
