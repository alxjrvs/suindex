import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '../../../test/chakra-utils'
import { BrowserRouter } from 'react-router-dom'
import { CrawlerControlBar } from '../../CrawlerLiveSheet/CrawlerControlBar'
import { MechControlBar } from '../../MechLiveSheet/MechControlBar'
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

const mockSupabase = supabase as unknown as {
  auth: { getUser: ReturnType<typeof vi.fn> }
  from: ReturnType<typeof vi.fn>
}

describe('LiveSheetControlBar', () => {
  const mockUser = { id: 'user-123' }
  const mockOnGameChange = vi.fn()
  const mockOnPilotChange = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } })
  })

  describe('Crawler LiveSheet', () => {
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
          <CrawlerControlBar gameId={null} onGameChange={mockOnGameChange} />
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
          <CrawlerControlBar gameId="game-1" savedGameId="game-1" onGameChange={mockOnGameChange} />
        </BrowserRouter>
      )

      await waitFor(() => {
        expect(screen.getByText('→ Game')).toBeInTheDocument()
      })
    })
  })

  describe('Mech LiveSheet', () => {
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
          <MechControlBar
            pilotId="pilot-1"
            savedPilotId="pilot-1"
            onPilotChange={mockOnPilotChange}
          />
        </BrowserRouter>
      )

      await waitFor(() => {
        expect(screen.getByText('Pilot:')).toBeInTheDocument()
        expect(screen.getByText('→ Pilot')).toBeInTheDocument()
      })
    })
  })
})
