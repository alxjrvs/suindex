import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '../../../test/chakra-utils'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { CrawlersGrid } from '../CrawlersGrid'
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

describe('CrawlersGrid', () => {
  const mockUser = {
    id: 'test-user-id',
    email: 'test@example.com',
  }

  const mockCrawlers: Tables<'crawlers'>[] = [
    {
      id: 'crawler-1',
      user_id: 'test-user-id',
      name: 'Test Crawler 1',
      crawler_type_id: null,
      tech_level: 1,
      current_damage: 0,
      current_scrap: 0,
      bays: null,
      cargo: null,
      npc: null,
      description: null,
      notes: null,
      upgrade: null,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      game_id: null,
    },
    {
      id: 'crawler-2',
      user_id: 'test-user-id',
      name: 'Test Crawler 2',
      crawler_type_id: null,
      tech_level: 2,
      current_damage: 5,
      current_scrap: 10,
      bays: null,
      cargo: null,
      npc: null,
      description: null,
      notes: null,
      upgrade: null,
      created_at: '2024-01-02T00:00:00Z',
      updated_at: '2024-01-02T00:00:00Z',
      game_id: null,
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(api.getUser).mockResolvedValue(mockUser as never)
    vi.mocked(api.fetchUserEntities).mockResolvedValue(mockCrawlers as never)
  })

  describe('Grid Display', () => {
    it('should render page title', async () => {
      render(
        <BrowserRouter>
          <CrawlersGrid />
        </BrowserRouter>
      )

      await waitFor(() => {
        expect(screen.getByText('Your Crawlers')).toBeInTheDocument()
      })
    })

    it('should render create crawler button', async () => {
      render(
        <BrowserRouter>
          <CrawlersGrid />
        </BrowserRouter>
      )

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /new crawler/i })).toBeInTheDocument()
      })
    })

    it('should render crawler cards after loading', async () => {
      render(
        <BrowserRouter>
          <CrawlersGrid />
        </BrowserRouter>
      )

      await waitFor(() => {
        expect(screen.getByText('Test Crawler 1')).toBeInTheDocument()
        expect(screen.getByText('Test Crawler 2')).toBeInTheDocument()
      })
    })

    it('should display crawler stats on cards', async () => {
      render(
        <BrowserRouter>
          <CrawlersGrid />
        </BrowserRouter>
      )

      await waitFor(() => {
        // Check for SP (Structure Points) stats
        expect(screen.getAllByText(/sp/i).length).toBeGreaterThan(0)
      })
    })
  })

  describe('Create Crawler Functionality', () => {
    it('should call createEntity when create button is clicked', async () => {
      const user = userEvent.setup()
      const mockCreateEntity = vi.mocked(api.createEntity)
      const newCrawler = { ...mockCrawlers[0], id: 'new-crawler-id' }
      mockCreateEntity.mockResolvedValue(newCrawler as never)

      render(
        <BrowserRouter>
          <CrawlersGrid />
        </BrowserRouter>
      )

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /new crawler/i })).toBeInTheDocument()
      })

      const createButton = screen.getByRole('button', { name: /new crawler/i })
      await user.click(createButton)

      await waitFor(() => {
        expect(mockCreateEntity).toHaveBeenCalledWith('crawlers', expect.any(Object))
      })
    })

    it('should navigate to new crawler after creation', async () => {
      const user = userEvent.setup()
      const mockCreateEntity = vi.mocked(api.createEntity)
      const newCrawler = { ...mockCrawlers[0], id: 'new-crawler-id' }
      mockCreateEntity.mockResolvedValue(newCrawler as never)

      render(
        <BrowserRouter>
          <CrawlersGrid />
        </BrowserRouter>
      )

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /new crawler/i })).toBeInTheDocument()
      })

      const createButton = screen.getByRole('button', { name: /new crawler/i })
      await user.click(createButton)

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard/crawlers/new-crawler-id')
      })
    })
  })

  describe('Crawler Card Navigation', () => {
    it('should navigate to crawler detail when card is clicked', async () => {
      const user = userEvent.setup()

      render(
        <BrowserRouter>
          <CrawlersGrid />
        </BrowserRouter>
      )

      await waitFor(() => {
        expect(screen.getByText('Test Crawler 1')).toBeInTheDocument()
      })

      // Click the VIEW button
      const viewButtons = screen.getAllByText('VIEW')
      await user.click(viewButtons[0])

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard/crawlers/crawler-1')
      })
    })
  })
})
