import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor, within } from '../../../test/chakra-utils'
import userEvent from '@testing-library/user-event'
import CrawlerLiveSheet from '../index'
import { SalvageUnionReference } from 'salvageunion-reference'

describe('CrawlerLiveSheet', () => {
  // Get real data from salvageunion-reference
  const allCrawlers = SalvageUnionReference.Crawlers.all()
  const allBays = SalvageUnionReference.CrawlerBays.all()
  const allTechLevels = SalvageUnionReference.CrawlerTechLevels.all()

  if (allCrawlers.length === 0) {
    throw new Error('No crawlers found in salvageunion-reference')
  }

  if (allBays.length === 0) {
    throw new Error('No crawler bays found in salvageunion-reference')
  }

  // Use first crawler for most tests
  const testCrawler = allCrawlers[0]

  // Get non-storage bays for bay tests
  const nonStorageBays = allBays.filter((b) => b.name !== 'Storage Bay')

  beforeEach(() => {
    // No mocks needed - using real data
  })

  describe('Initial Render', () => {
    it('renders the crawler builder interface', () => {
      render(<CrawlerLiveSheet />)

      // Should have name input
      expect(screen.getByPlaceholderText(/enter crawler name/i)).toBeInTheDocument()
    })

    it('displays all main sections', () => {
      render(<CrawlerLiveSheet />)

      // Header inputs
      expect(screen.getByPlaceholderText(/enter crawler name/i)).toBeInTheDocument()
      const typeSelect = screen.getByRole('combobox')
      expect(typeSelect).toBeInTheDocument()

      // Resource steppers
      expect(screen.getByRole('group', { name: /SP/i })).toBeInTheDocument()
      expect(screen.getByRole('group', { name: /TL/i })).toBeInTheDocument()
      expect(screen.getByRole('group', { name: /UPGRADE/i })).toBeInTheDocument()
      expect(screen.getByText(/UPKEEP/i)).toBeInTheDocument()
      expect(screen.getByRole('group', { name: /SCRAP/i })).toBeInTheDocument()

      // Notes section
      expect(screen.getByPlaceholderText(/add notes about your crawler/i)).toBeInTheDocument()
    })

    it('shows resource steppers with initial values', () => {
      render(<CrawlerLiveSheet />)

      // SP should start at 20/20
      const spStepper = screen.getByRole('group', { name: /SP/i })
      expect(within(spStepper).getByText('20/20')).toBeInTheDocument()

      // Tech Level should start at 1
      const techLevelStepper = screen.getByRole('group', { name: /TL/i })
      expect(within(techLevelStepper).getByText('1')).toBeInTheDocument()

      // Upgrade should start at 0/25
      const upgradeStepper = screen.getByRole('group', { name: /UPGRADE/i })
      expect(within(upgradeStepper).getByText('0/25')).toBeInTheDocument()

      // Scrap should start at 0
      const scrapStepper = screen.getByRole('group', { name: /SCRAP/i })
      expect(within(scrapStepper).getByText('0')).toBeInTheDocument()
    })

    it('displays all bay cards', () => {
      render(<CrawlerLiveSheet />)

      // Should show at least one bay from real data
      if (allBays.length > 0) {
        // Check for Storage Bay which should always exist
        const storageBay = allBays.find((b) => b.name === 'Storage Bay')
        if (storageBay) {
          expect(screen.getByText('Storage Bay')).toBeInTheDocument()
        }
      }
    })
  })

  describe('Type Selection', () => {
    it('loads and displays crawler type options', () => {
      render(<CrawlerLiveSheet />)

      const typeSelect = screen.getByRole('combobox')
      expect(typeSelect).toBeInTheDocument()

      // Should have placeholder option
      expect(screen.getByText(/select crawler type/i)).toBeInTheDocument()

      // Should have crawler options - check for at least one real crawler
      if (allCrawlers.length > 0) {
        const firstCrawlerName = new RegExp(allCrawlers[0].name, 'i')
        expect(screen.getByRole('option', { name: firstCrawlerName })).toBeInTheDocument()
      }
    })

    it('displays abilities when crawler type is selected', async () => {
      const user = userEvent.setup()
      render(<CrawlerLiveSheet />)

      const typeSelect = screen.getByRole('combobox')

      await user.selectOptions(typeSelect, testCrawler.id)

      await waitFor(() => {
        // Check that at least one ability is displayed if the crawler has abilities
        if (testCrawler.abilities && testCrawler.abilities.length > 0) {
          const firstAbility = testCrawler.abilities[0]
          expect(screen.getByText(firstAbility.name)).toBeInTheDocument()
        }
      })
    })

    it('does not show confirmation alert on first type selection', async () => {
      const user = userEvent.setup()
      const confirmSpy = vi.spyOn(window, 'confirm')
      render(<CrawlerLiveSheet />)

      const typeSelect = screen.getByRole('combobox')

      await user.selectOptions(typeSelect, testCrawler.id)

      expect(confirmSpy).not.toHaveBeenCalled()

      confirmSpy.mockRestore()
    })
  })

  describe('Resource Management', () => {
    it('allows adjusting SP value', async () => {
      const user = userEvent.setup()
      render(<CrawlerLiveSheet />)

      // Select a crawler type first to enable inputs
      const crawlerTypeSelect = screen.getByRole('combobox', { name: /type/i })
      await user.selectOptions(crawlerTypeSelect, testCrawler.id)

      const spStepper = screen.getByRole('group', { name: /SP/i })
      const decrementButton = within(spStepper).getByRole('button', { name: /Decrement SP/i })

      // SP starts at max (20/20), so we can only decrement
      await user.click(decrementButton)
      expect(within(spStepper).getByText('19/20')).toBeInTheDocument()

      // Decrement again
      await user.click(decrementButton)
      expect(within(spStepper).getByText('18/20')).toBeInTheDocument()
    })

    it('allows adjusting tech level', async () => {
      const user = userEvent.setup()
      render(<CrawlerLiveSheet />)

      // Select a crawler type first to enable inputs
      const crawlerTypeSelect = screen.getByRole('combobox', { name: /type/i })
      await user.selectOptions(crawlerTypeSelect, testCrawler.id)

      const techLevelStepper = screen.getByRole('group', { name: /TL/i })
      const incrementButton = within(techLevelStepper).getByRole('button', {
        name: /Increment TL/i,
      })

      // Increment tech level
      await user.click(incrementButton)
      expect(within(techLevelStepper).getByText('2')).toBeInTheDocument()
    })

    it('allows adjusting upgrade value', async () => {
      const user = userEvent.setup()
      render(<CrawlerLiveSheet />)

      // Select a crawler type first to enable inputs
      const crawlerTypeSelect = screen.getByRole('combobox', { name: /type/i })
      await user.selectOptions(crawlerTypeSelect, testCrawler.id)

      const upgradeStepper = screen.getByRole('group', { name: /UPGRADE/i })
      const incrementButton = within(upgradeStepper).getByRole('button', {
        name: /Increment UPGRADE/i,
      })

      await user.click(incrementButton)
      expect(within(upgradeStepper).getByText('1/25')).toBeInTheDocument()
    })

    it('allows adjusting scrap value', async () => {
      const user = userEvent.setup()
      render(<CrawlerLiveSheet />)

      // Select a crawler type first to enable inputs
      const crawlerTypeSelect = screen.getByRole('combobox', { name: /type/i })
      await user.selectOptions(crawlerTypeSelect, testCrawler.id)

      const scrapStepper = screen.getByRole('group', { name: /SCRAP/i })
      const incrementButton = within(scrapStepper).getByRole('button', {
        name: /Increment SCRAP/i,
      })

      // Increment scrap
      await user.click(incrementButton)
      expect(within(scrapStepper).getByText('1')).toBeInTheDocument()
    })

    it('updates upkeep display when tech level changes', async () => {
      const user = userEvent.setup()
      render(<CrawlerLiveSheet />)

      // Select a crawler type first to enable inputs
      const crawlerTypeSelect = screen.getByRole('combobox', { name: /type/i })
      await user.selectOptions(crawlerTypeSelect, testCrawler.id)

      // Initial upkeep should be 5 TL1
      expect(screen.getByText('5 TL1')).toBeInTheDocument()

      const techLevelStepper = screen.getByRole('group', { name: /TL/i })
      const incrementButton = within(techLevelStepper).getByRole('button', {
        name: /Increment TL/i,
      })

      // Increment tech level
      await user.click(incrementButton)

      // Upkeep should update to 5 TL2
      await waitFor(() => {
        expect(screen.getByText('5 TL2')).toBeInTheDocument()
      })
    })

    it('resets upgrade to 0 when tech level changes', async () => {
      const user = userEvent.setup()
      render(<CrawlerLiveSheet />)

      // Select a crawler type first to enable inputs
      const crawlerTypeSelect = screen.getByRole('combobox', { name: /type/i })
      await user.selectOptions(crawlerTypeSelect, testCrawler.id)

      // First, increment upgrade
      const upgradeStepper = screen.getByRole('group', { name: /UPGRADE/i })
      const upgradeIncrementButton = within(upgradeStepper).getByRole('button', {
        name: /Increment UPGRADE/i,
      })
      await user.click(upgradeIncrementButton)
      expect(within(upgradeStepper).getByText('1/25')).toBeInTheDocument()

      // Now increment tech level
      const techLevelStepper = screen.getByRole('group', { name: /TL/i })
      const techLevelIncrementButton = within(techLevelStepper).getByRole('button', {
        name: /Increment TL/i,
      })
      await user.click(techLevelIncrementButton)

      // Upgrade should be reset to 0
      await waitFor(() => {
        expect(within(upgradeStepper).getByText('0/25')).toBeInTheDocument()
      })
    })
  })

  describe('Header Inputs', () => {
    it('allows entering crawler name', async () => {
      const user = userEvent.setup()
      render(<CrawlerLiveSheet />)

      // Select a crawler type first to enable inputs
      const crawlerTypeSelect = screen.getByRole('combobox', { name: /type/i })
      await user.selectOptions(crawlerTypeSelect, testCrawler.id)

      const nameInput = screen.getByPlaceholderText(/enter crawler name/i)

      await user.type(nameInput, 'The Iron Beast')
      expect(nameInput).toHaveValue('The Iron Beast')
    })

    it('allows entering description', async () => {
      const user = userEvent.setup()
      render(<CrawlerLiveSheet />)

      // Select a crawler type first to enable inputs
      const crawlerTypeSelect = screen.getByRole('combobox', { name: /type/i })
      await user.selectOptions(crawlerTypeSelect, testCrawler.id)

      const descriptionInput = screen.getByPlaceholderText(/enter crawler description/i)

      await user.type(descriptionInput, 'A mighty crawler')
      expect(descriptionInput).toHaveValue('A mighty crawler')
    })
  })

  describe('Bay Management', () => {
    it('allows entering operator for a bay', async () => {
      const user = userEvent.setup()
      render(<CrawlerLiveSheet />)

      // Select a crawler type first to enable inputs
      const crawlerTypeSelect = screen.getByRole('combobox', { name: /type/i })
      await user.selectOptions(crawlerTypeSelect, testCrawler.id)

      // Find any bay operator input (placeholder is "Enter operator name...")
      const operatorInputs = screen.getAllByPlaceholderText(/enter operator name/i)
      if (operatorInputs.length > 0) {
        const operatorInput = operatorInputs[0]
        await user.type(operatorInput, 'Captain Smith')
        expect(operatorInput).toHaveValue('Captain Smith')
      }
    })

    it('allows entering description for a bay', async () => {
      const user = userEvent.setup()
      render(<CrawlerLiveSheet />)

      // Select a crawler type first to enable inputs
      const crawlerTypeSelect = screen.getByRole('combobox', { name: /type/i })
      await user.selectOptions(crawlerTypeSelect, testCrawler.id)

      // Find bay notes inputs (placeholder is "Enter operator notes...")
      const bayNotes = screen.getAllByPlaceholderText(/enter operator notes/i)
      const firstBayNotes = bayNotes[0]

      await user.type(firstBayNotes, 'Comfortable quarters')
      expect(firstBayNotes).toHaveValue('Comfortable quarters')
    })
  })

  describe('Storage Bay', () => {
    it('displays storage bay separately from other bays', () => {
      render(<CrawlerLiveSheet />)

      // Storage Bay should be visible
      expect(screen.getByText('Storage Bay')).toBeInTheDocument()
    })

    it('shows add cargo button', () => {
      render(<CrawlerLiveSheet />)

      expect(screen.getByRole('button', { name: /\+/i })).toBeInTheDocument()
    })

    it('opens cargo modal when add cargo is clicked', async () => {
      const user = userEvent.setup()
      render(<CrawlerLiveSheet />)

      // Select a crawler type first to enable inputs
      const crawlerTypeSelect = screen.getByRole('combobox', { name: /type/i })
      await user.selectOptions(crawlerTypeSelect, testCrawler.id)

      const addCargoButton = screen.getByRole('button', { name: /\+/i })

      await user.click(addCargoButton)

      // Modal should be visible with the cargo description input
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/enter cargo description/i)).toBeInTheDocument()
      })
    })
  })

  describe('Notes', () => {
    it('shows notes section', () => {
      render(<CrawlerLiveSheet />)

      expect(screen.getByPlaceholderText(/add notes about your crawler/i)).toBeInTheDocument()
    })

    it('allows entering notes text', async () => {
      const user = userEvent.setup()
      render(<CrawlerLiveSheet />)

      // Select a crawler type first to enable inputs
      const crawlerTypeSelect = screen.getByRole('combobox', { name: /type/i })
      await user.selectOptions(crawlerTypeSelect, testCrawler.id)

      const notesTextarea = screen.getByPlaceholderText(/add notes about your crawler/i)

      await user.type(notesTextarea, 'This crawler has seen better days')
      expect(notesTextarea).toHaveValue('This crawler has seen better days')
    })
  })
})
