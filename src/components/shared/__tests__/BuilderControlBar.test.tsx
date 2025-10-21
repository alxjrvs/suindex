import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
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
  const mockOnCrawlerChange = vi.fn()
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
    it('fetches crawlers filtered by game_id when set', async () => {
      const mockCrawlers = [{ id: 'crawler-1', name: 'Crawler 1', game_id: 'game-1' }]
      const mockPilots = [{ id: 'pilot-1', callsign: 'Pilot 1' }]

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'crawlers') {
          return {
            select: () => ({
              eq: (field: string) => {
                if (field === 'user_id') {
                  return {
                    eq: (field2: string, value2: string) => {
                      if (field2 === 'game_id' && value2 === 'game-1') {
                        return {
                          order: () => Promise.resolve({ data: mockCrawlers }),
                        }
                      }
                      return { order: () => Promise.resolve({ data: [] }) }
                    },
                  }
                }
                return {}
              },
            }),
          }
        }
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
            gameId="game-1"
            crawlerId={null}
            pilotId={null}
            onCrawlerChange={mockOnCrawlerChange}
            onPilotChange={mockOnPilotChange}
            onSave={mockOnSave}
            onResetChanges={mockOnResetChanges}
            hasUnsavedChanges={false}
          />
        </BrowserRouter>
      )

      await waitFor(() => {
        expect(screen.getByText('Crawler:')).toBeInTheDocument()
      })
    })

    it('auto-sets game_id when crawler with game_id is selected', async () => {
      const user = userEvent.setup()
      const mockCrawlers = [
        { id: 'crawler-1', name: 'Crawler 1', game_id: 'game-1' },
        { id: 'crawler-2', name: 'Crawler 2', game_id: null },
      ]
      const mockPilots = [{ id: 'pilot-1', callsign: 'Pilot 1' }]

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'crawlers') {
          return {
            select: () => ({
              eq: () => ({
                order: () => Promise.resolve({ data: mockCrawlers }),
              }),
            }),
          }
        }
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
            crawlerId={null}
            pilotId={null}
            onGameChange={mockOnGameChange}
            onCrawlerChange={mockOnCrawlerChange}
            onPilotChange={mockOnPilotChange}
            onSave={mockOnSave}
            onResetChanges={mockOnResetChanges}
            hasUnsavedChanges={false}
          />
        </BrowserRouter>
      )

      await waitFor(() => {
        expect(screen.getByText('Crawler:')).toBeInTheDocument()
      })

      const crawlerSelect = screen.getByRole('combobox', { name: 'Crawler' })
      await user.selectOptions(crawlerSelect, 'crawler-1')

      expect(mockOnCrawlerChange).toHaveBeenCalledWith('crawler-1')
      expect(mockOnGameChange).toHaveBeenCalledWith('game-1')
    })

    it('shows link buttons when crawler and pilot are assigned', async () => {
      const mockCrawlers = [{ id: 'crawler-1', name: 'Crawler 1', game_id: null }]
      const mockPilots = [{ id: 'pilot-1', callsign: 'Pilot 1' }]

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'crawlers') {
          return {
            select: () => ({
              eq: () => ({
                order: () => Promise.resolve({ data: mockCrawlers }),
              }),
            }),
          }
        }
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
            crawlerId="crawler-1"
            pilotId="pilot-1"
            savedCrawlerId="crawler-1"
            savedPilotId="pilot-1"
            onCrawlerChange={mockOnCrawlerChange}
            onPilotChange={mockOnPilotChange}
            onSave={mockOnSave}
            onResetChanges={mockOnResetChanges}
            hasUnsavedChanges={false}
          />
        </BrowserRouter>
      )

      await waitFor(() => {
        expect(screen.getByText('→ Crawler')).toBeInTheDocument()
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
