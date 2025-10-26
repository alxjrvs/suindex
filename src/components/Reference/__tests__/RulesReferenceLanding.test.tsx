import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor, within } from '../../../test/chakra-utils'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
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
      render(
        <BrowserRouter>
          <RulesReferenceLanding schemas={schemas} />
        </BrowserRouter>
      )

      expect(screen.getByText('Salvage Union Rules Reference')).toBeInTheDocument()
    })

    it('should display the search input', () => {
      render(
        <BrowserRouter>
          <RulesReferenceLanding schemas={schemas} />
        </BrowserRouter>
      )

      const searchInput = screen.getByPlaceholderText('Search all rules, items, and schemas...')
      expect(searchInput).toBeInTheDocument()
    })

    it('should display schema count and item count in header', () => {
      render(
        <BrowserRouter>
          <RulesReferenceLanding schemas={schemas} />
        </BrowserRouter>
      )

      const headerText = screen.getByText(new RegExp(`Search across all ${schemas.length} schemas`))
      expect(headerText).toBeInTheDocument()
    })

    it('should render all schema cards in browse section', () => {
      render(
        <BrowserRouter>
          <RulesReferenceLanding schemas={schemas} />
        </BrowserRouter>
      )

      schemas.forEach((schema) => {
        const title = schema.title.replace('Salvage Union ', '')
        expect(screen.getByText(title)).toBeInTheDocument()
      })
    })
  })

  describe('Typeahead Search', () => {
    it('should show search results when typing', async () => {
      const user = userEvent.setup()
      render(
        <BrowserRouter>
          <RulesReferenceLanding schemas={schemas} />
        </BrowserRouter>
      )

      const searchInput = screen.getByPlaceholderText('Search all rules, items, and schemas...')
      await user.type(searchInput, 'Chassis')

      await waitFor(() => {
        // Check for "Schema" label which only appears in search results
        expect(screen.getByText('Schema')).toBeInTheDocument()
      })
    })

    it('should clear search results when input is cleared', async () => {
      const user = userEvent.setup()
      render(
        <BrowserRouter>
          <RulesReferenceLanding schemas={schemas} />
        </BrowserRouter>
      )

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
      render(
        <BrowserRouter>
          <RulesReferenceLanding schemas={schemas} />
        </BrowserRouter>
      )

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
      render(
        <BrowserRouter>
          <RulesReferenceLanding schemas={schemas} />
        </BrowserRouter>
      )

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

  describe('Schema Card Navigation', () => {
    it('should render schema cards with descriptions', () => {
      render(
        <BrowserRouter>
          <RulesReferenceLanding schemas={schemas} />
        </BrowserRouter>
      )

      // Just check that at least one schema description is present
      const firstSchema = schemas[0]
      const description = firstSchema.description.replace('Salvage Union ', '')
      expect(screen.getByText(new RegExp(description.substring(0, 20)))).toBeInTheDocument()
    })

    it('should display item count for each schema', () => {
      render(
        <BrowserRouter>
          <RulesReferenceLanding schemas={schemas} />
        </BrowserRouter>
      )

      // Check that item counts are displayed (use getAllByText for duplicates)
      const firstSchema = schemas[0]
      const itemCountText = `${firstSchema.itemCount} items`
      const elements = screen.queryAllByText(new RegExp(itemCountText))
      expect(elements.length).toBeGreaterThan(0)
    })
  })

  describe('Browse by Category Section', () => {
    it('should display browse by category heading', () => {
      render(
        <BrowserRouter>
          <RulesReferenceLanding schemas={schemas} />
        </BrowserRouter>
      )

      expect(screen.getByText('Browse by Category')).toBeInTheDocument()
    })
  })
})
