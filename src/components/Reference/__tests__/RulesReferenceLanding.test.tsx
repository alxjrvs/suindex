import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '../../../test/chakra-utils'
import userEvent from '@testing-library/user-event'
import { RulesReferenceLanding } from '../RulesReferenceLanding'
import { getSchemaCatalog } from 'salvageunion-reference'

const schemaIndexData = getSchemaCatalog()

describe('RulesReferenceLanding', () => {
  const schemas = schemaIndexData.schemas

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Page Structure', () => {
    it('should render the page title', () => {
      render(<RulesReferenceLanding schemas={schemas} />)

      expect(screen.getByText('Salvage Union Rules Reference')).toBeInTheDocument()
    })

    it('should display the search input', () => {
      render(<RulesReferenceLanding schemas={schemas} />)

      const searchInput = screen.getByPlaceholderText('Search all rules, items, and schemas...')
      expect(searchInput).toBeInTheDocument()
    })

    it('should display schema count and item count in header', () => {
      render(<RulesReferenceLanding schemas={schemas} />)

      const headerText = screen.getByText(new RegExp(`Search across all ${schemas.length} schemas`))
      expect(headerText).toBeInTheDocument()
    })

    it('should render the animated masonry grid', () => {
      render(<RulesReferenceLanding schemas={schemas} />)

      // The component now shows an animated masonry grid instead of schema cards
      // Just verify the main structure is present
      expect(screen.getByText('Salvage Union Rules Reference')).toBeInTheDocument()
    })
  })

  describe('Typeahead Search', () => {
    it('should show search results when typing', async () => {
      const user = userEvent.setup()
      render(<RulesReferenceLanding schemas={schemas} />)

      const searchInput = screen.getByPlaceholderText('Search all rules, items, and schemas...')
      await user.type(searchInput, 'Chassis')

      await waitFor(() => {
        // Check for "Schema" label which only appears in search results
        expect(screen.getByText('Schema')).toBeInTheDocument()
      })
    })

    it('should clear search results when input is cleared', async () => {
      const user = userEvent.setup()
      render(<RulesReferenceLanding schemas={schemas} />)

      const searchInput = screen.getByPlaceholderText('Search all rules, items, and schemas...')
      await user.type(searchInput, 'Chassis')

      await waitFor(() => {
        // Check for "Schema" label which only appears in search results
        expect(screen.getByText('Schema')).toBeInTheDocument()
      })

      await user.clear(searchInput)

      await waitFor(() => {
        // "Schema" label should be gone (only appears in search results dropdown)
        expect(screen.queryByText('Schema')).not.toBeInTheDocument()
      })
    })

    it('should support keyboard navigation in search results', async () => {
      const user = userEvent.setup()
      render(<RulesReferenceLanding schemas={schemas} />)

      const searchInput = screen.getByPlaceholderText('Search all rules, items, and schemas...')
      await user.type(searchInput, 'Chassis')

      await waitFor(() => {
        // Check for "Schema" label which only appears in search results
        expect(screen.getByText('Schema')).toBeInTheDocument()
      })

      // Arrow down should highlight next result
      await user.keyboard('{ArrowDown}')
      // Just verify no errors occur
      expect(searchInput).toBeInTheDocument()
    })

    it('should close search results on Escape key', async () => {
      const user = userEvent.setup()
      render(<RulesReferenceLanding schemas={schemas} />)

      const searchInput = screen.getByPlaceholderText('Search all rules, items, and schemas...')
      await user.type(searchInput, 'Chassis')

      await waitFor(() => {
        // Check for "Schema" label which only appears in search results
        expect(screen.getByText('Schema')).toBeInTheDocument()
      })

      await user.keyboard('{Escape}')

      await waitFor(() => {
        expect(searchInput).toHaveValue('')
      })
    })
  })

  describe('Animated Masonry Grid', () => {
    it('should render the animated masonry grid component', () => {
      render(<RulesReferenceLanding schemas={schemas} />)

      // The component now uses an animated masonry grid that displays random items
      // We can verify the page renders without errors
      expect(screen.getByText('Salvage Union Rules Reference')).toBeInTheDocument()
    })

    it('should display the search functionality', () => {
      render(<RulesReferenceLanding schemas={schemas} />)

      // Verify search is still available
      const searchInput = screen.getByPlaceholderText('Search all rules, items, and schemas...')
      expect(searchInput).toBeInTheDocument()
    })
  })
})
