import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '../../../test/chakra-utils'
import userEvent from '@testing-library/user-event'
import { CrawlersGrid } from '../CrawlersGrid'
import * as api from '../../../lib/api'
import { createMockUser, createMockCrawlers } from '../../../test/mockFactories'

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
  const mockUser = createMockUser()
  const mockCrawlers = createMockCrawlers(2)

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(api.getUser).mockResolvedValue(mockUser as never)
    vi.mocked(api.fetchUserEntities).mockResolvedValue(mockCrawlers as never)
  })

  describe('Grid Display', () => {
    it('should render page title', async () => {
      render(<CrawlersGrid />)

      await waitFor(() => {
        expect(screen.getByText('Your Crawlers')).toBeInTheDocument()
      })
    })

    it('should render create crawler button', async () => {
      render(<CrawlersGrid />)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /new crawler/i })).toBeInTheDocument()
      })
    })

    it('should render crawler cards after loading', async () => {
      render(<CrawlersGrid />)

      await waitFor(() => {
        expect(screen.getByText('Test Crawler 1')).toBeInTheDocument()
        expect(screen.getByText('Test Crawler 2')).toBeInTheDocument()
      })
    })

    it('should display crawler stats on cards', async () => {
      render(<CrawlersGrid />)

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

      render(<CrawlersGrid />)

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

      render(<CrawlersGrid />)

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

      render(<CrawlersGrid />)

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
